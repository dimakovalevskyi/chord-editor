import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Song, Lyrics, Chord, LyricsRow } from '../song';

@Component({
  selector: 'app-edit-lyrics-dialog',
  templateUrl: './edit-lyrics-dialog.component.html',
  styleUrls: ['./edit-lyrics-dialog.component.scss']
})
export class EditLyricsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditLyricsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>
  ) { }

  /**
   * Step of adding song. When we edit existing song we get on 3 step
   */
  step = 1;

  /**
   * Song lyrics on first state
   */
  stringLyrics = '';
  /**
   * Lyrics in format for separating chords lines from text lines
   */
  analyzingLyrics = [];
  /**
   * Lyrics in valid transformed format. Ready for DD
   */
  transformedLyrics: Lyrics = [];
  /**
   * Link to selected chord
   */
  selectedChord: Chord = {
    name: '',
    offset: 0
  };
  /**
   * Link to row, which contain selected chord
   */
  selectedRow: LyricsRow = {
    text: '',
    chords: [this.selectedChord]
  };
  /**
   * Styles object for drag helper
   */
  dragHelperStyle = {
    top: 0,
    left: 0
  };
  /**
   * Previous styles object for drag helper (need for D&D)
   */
  prevCursorPosition = {
    top: 0,
    left: 0
  };
  /**
   * Flag which tell when enadled drag mode
   */
  dragging = false;
  /**
   * Name for all new chords
   */
  newChordName = 'Am';

  /**
   * Check if line contain 3 or more space in a row. If contain this line looks like chords
   *
   * @param {string} s - checking string
   */
  isLineLooksLikeChords(s: string) {
    return s.indexOf('   ') > -1;
  }

  /**
   * Analyze entered lyrics, find lines with chords
   */
  analyzeLyrics() {
    this.stringLyrics.split('\n').forEach(value => {
      this.analyzingLyrics.push({
        text: value,
        isChords: this.isLineLooksLikeChords(value)
      });
    });
  }

  /**
   * Transfrorm chords from string to Array<Chord>
   *
   * @param {string} chordsAsString - transforming chords
   * @returns {Chord[]}
   */
  transformChords(chordsAsString: string) {
    const transformedValue = [{
      name: '',
      offset: 0
    }];
    chordsAsString.split(' ').forEach(symbol => {
      if (symbol !== '') {
        transformedValue[transformedValue.length - 1].name = symbol;
        transformedValue.push({
          name: '',
          offset: 1
        });
      } else {
        transformedValue[transformedValue.length - 1].offset++;
      }
    });

    if (transformedValue[transformedValue.length - 1].name === '' ) {
      transformedValue.pop();
    }
    if (transformedValue[0] && transformedValue[0].name === '' ) {
      transformedValue.shift();
    }
    return transformedValue;
  }

 /**
   * Returns string that consist of 'count' spaces
   *
   * @param {number} count - space count
   * @returns {string}
   */
  getSpaces(count: number) {
    return new Array((count > 0 ? count : 0) + 1).join(' ');
  }

  /**
   * Transform Array<Chord> into string
   *
   * @param {Chord[]} chords - transforming chords
   * @returns {string}
   */
  chordsToString(chords: Chord[]) {
    let result = '';
    chords.forEach(chord => result += this.getSpaces(chord.offset) + chord.name);
    return result;
  }

  /**
   * Select Chord event. Event passed will be stopped propagation
   *
   * @param {Object} event - Event object. will be stopped propagation
   * @param {Chord} chord - selecting chord
   * @param {LyricsRow} row - row which contain selecting chord
   */
  selectChordEvent(event, chord: Chord, row: LyricsRow) {
    event.stopPropagation();
    this.selectedChord = chord;
    this.selectedRow = row;
  }
  /**
   * Drag start event. Event passed will be stopped propagation
   *
   * @param {Object} event - Event object. will be stopped propagation
   * @param {Chord} chord - dragging chord
   * @param {LyricsRow} row - row which contain dragging chord
   */
  dragStartEvent(e, chord: Chord, row: LyricsRow) {
    e.stopPropagation();
    this.dragging = true;

    this.dragHelperStyle.top = e.pageY;
    this.dragHelperStyle.left = e.pageX + 1;
    this.prevCursorPosition.top = e.pageY;
    this.prevCursorPosition.left = e.pageX;

    document.onmousemove = this.dragTick.bind(this);
  }
  /**
   * Drag end event
   *
   * @param {Object} e - event object
   */
  dragEndEvent(e) {
    const newChordName = this.selectedChord.name;
    document.onmousemove = null;

    if (this.dragging) {
      let targetElement = e.target;
      while ((targetElement = targetElement.parentElement) && !targetElement.classList.contains('chords')) {}
      if (targetElement) {
        this.removeChord(this.selectedChord, this.selectedRow);
        this.insertChordEvent(e, this.transformedLyrics[targetElement.dataset.index], newChordName);
      }
    }
    this.dragging = false;
  }
  /**
   * Mousemove event. Bound only when dragging is active
   *
   * @param {Object} e - event object
   */
  dragTick(e) {
    this.dragHelperStyle.left += e.pageX - this.prevCursorPosition.left;
    this.dragHelperStyle.top += e.pageY - this.prevCursorPosition.top;

    this.prevCursorPosition.top = e.pageY;
    this.prevCursorPosition.left = e.pageX;
  }
  /**
   * Remove selected chord
   */
  removeSelectedChord() {
    if (!this.selectedChord.name) {
      return;
    }
    this.removeChord(this.selectedChord, this.selectedRow);
    this.selectedChord = {
      name: '',
      offset: 0
    };
    this.selectedRow = {
      text: '',
      chords: [this.selectedChord]
    };
  }

  /**
   * Remove chord from row
   *
   * @param {Chord} chord - removing chord
   * @param {LyricsRow} row - row which contain removing chord
   */
  removeChord(chord: Chord, row: LyricsRow) {
    const indexOfRemovingChord = row.chords.indexOf(chord);

    if (row.chords[indexOfRemovingChord + 1]) {
      row.chords[indexOfRemovingChord + 1].offset += chord.offset + chord.name.length;
    }

    row.chords.splice(indexOfRemovingChord, 1);
  }

  /**
   * Insert chord in row
   *
   * @param {number} totalOffset - offset from row start
   * @param {LyricsRow} row - row where will be inserted chord
   * @param {string} [name] - name for new chord. If not pass will be used 'newChordName'
   */
  insertChord(totalOffset: number, row: LyricsRow, name?: string) {
    let chordsWidthBefore = 0;
    let newChordIndex = 0;
    for (let i = 0; i < row.chords.length; i++) {
      if ((chordsWidthBefore + row.chords[i].name.length + row.chords[i].offset) > totalOffset) {
        break;
      }
      chordsWidthBefore += row.chords[i].name.length + row.chords[i].offset;
      newChordIndex++;
    }
    const newChordName = name || this.newChordName || '#';
    let needToDecreaseForNextChords = newChordName.length + totalOffset - chordsWidthBefore;

    row.chords.forEach((value, index) => {
      if (index < newChordIndex) {
        return;
      }
      if (needToDecreaseForNextChords > 0) {
        if (value.offset >= needToDecreaseForNextChords) {
          value.offset -= needToDecreaseForNextChords;
          needToDecreaseForNextChords = 0;
        } else {
          needToDecreaseForNextChords -= value.offset;
          value.offset = 0;
        }
      }
    });

    row.chords.splice(newChordIndex, 0, {
      offset: totalOffset - chordsWidthBefore,
      name: newChordName
    });

    this.selectedChord = row.chords[newChordIndex];
    this.selectedRow = row;
  }
  /**
   * Insert chord event
   *
   * @param {Object} event - Event object
   * @param {LyricsRow} row - row in which will be inserted chord
   * @param {string} [name] - name for new chord. If not pass will be used 'newChordName'
   *
   */
  insertChordEvent(e, row: LyricsRow, name?: string) {
    // 9 is width of 1 symbol
    this.insertChord(Math.trunc(e.offsetX / 9), row, name);
  }
  /**
   * Calculate and return some count of spaces to fill empty space after chords
   *
   * @param {LyricsRow} row - row for calculate
   * @returns {string}
   */
  getEmptySpace(row: LyricsRow) {
    const chordsWidth = row.chords.reduce((prevWidth, chord) => {
      return prevWidth + chord.name.length + chord.offset;
    }, 0);

    return this.getSpaces((row.text.length < 75 ? 75 : row.text.length) - chordsWidth);
  }

  /**
   * Transform lyrics from analized form to Lyrics type
   */
  transformLyrics() {
    let previousWasChord = false;

    this.analyzingLyrics.forEach(value => {
      if (value.isChords) {
        this.transformedLyrics.push({
          text: '',
          chords: this.transformChords(value.text)
        });
      } else if (previousWasChord) {
        this.transformedLyrics[this.transformedLyrics.length - 1].text = value.text;
      } else {
        this.transformedLyrics.push({
          text: value.text,
          chords: []
        });
      }

      previousWasChord = value.isChords;
    });
  }

  /**
   * Go to next step
   */
  next() {
    if (this.step === 1) {
      this.analyzeLyrics();
    } else if (this.step === 2) {
      this.transformLyrics();
    }

    this.step++;
  }

  /**
   * On initialization check if data was passed into popup.
   * If passed, go to step 3
   */
  ngOnInit() {
    if (this.data && this.data.length) {
      this.step = 3;
      this.transformedLyrics = this.data;
    }
  }

}

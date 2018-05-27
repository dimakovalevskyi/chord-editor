import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { EditLyricsDialogComponent } from '../edit-lyrics-dialog/edit-lyrics-dialog.component';
import { Song, Chord } from '../song';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Song|null
  ) { }

  /**
   * Current song
   */
  song: Song = {
    name: '',
    author: '',
    lyrics: []
  };
  /**
   * Flag that tell if we add song or edit song
   */
  addingMode = true;

  /**
   * Returns string that consist of 'count' spaces
   *
   * @param {number} count - space count
   * @returns {string}
   */
  protected getSpaces(count: number) {
    return new Array((count > 0 ? count : 0) + 1).join(' ');
  }

  /**
   * Transform Array<Chord> into string
   *
   * @param {Chord[]} chords transforming chords
   * @returns {string}
   */
  chordsToString(chords: Array<Chord>) {
    let result = '';
    chords.forEach(chord => result += this.getSpaces(chord.offset) + chord.name);
    return result;
  }

  /**
   * Open dialog for editing lyrics
   */
  editLyrics() {
    this.dialog.open(EditLyricsDialogComponent, {
      width: '800px',
      data: this.song.lyrics
    }).afterClosed().subscribe(result => {
      if (result) {
        this.song.lyrics = result;
      }
    });
  }

  /**
   * Check if data was passed in popup. If passed, enable editing mode instead of adding
   */
  ngOnInit() {
    if (this.data) {
      this.addingMode = false;
      this.song = this.data;
    }
  }

}

import { Component, Input } from '@angular/core';
import { Song, Chord } from '../song';
import { SongsService } from '../songs.service';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss']
})
export class SongItemComponent {

  /**
   * Song passed in component
   */
  @Input() song: Song;

  constructor(
    public songs: SongsService
   ) { }

  /**
  * Allias for service method open
  */
  open() {
    this.songs.open(this.song);
  }

  /**
   * Event on remove button. Event passed in function will be stopped propagation..
   * Allias for service method remove
   *
   * @param {Object} $event - event object, which will be stopped propagation
   */
  removeEvent($event) {
    $event.stopPropagation();
    this.songs.remove(this.song);
  }

  /**
   * Event on export button. Event passed in function will be stopped propagation.
   * Allias for service method export
   *
   * @param {Object} $event - event object, which will be stopped propagation
   */
  exportEvent($event) {
    $event.stopPropagation();
    this.songs.export(this.song);
  }

  /**
   * Calculate and returns count of words in song
   *
   * @returns {number} - count of words in song
   */
  calculateWordsCount() {
    return this.song.lyrics.reduce((count, value) => count += value.text.split(' ').length, 0);
  }

  /**
   * Calculate and returns chords used in song
   *
   * @returns {Chord[]} - array of chords
   */
  getUsedChords() {
    const usedChords = [];

    this.song.lyrics.forEach(line => {
      line.chords.forEach(chord => {
        if (usedChords.indexOf(chord.name) === -1) {
          usedChords.push(chord.name);
        }
      });
    });

    return usedChords;
  }
}

import { Component, OnInit } from '@angular/core';
import { SongsService } from './songs.service';
import { Song } from './song';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  songList: Array<Song> = [];

  constructor (public songs: SongsService) {}

  /**
   * Allias for service method add
   */
  addSong() {
    this.songs.add();
  }

  /**
   * Allias for service method export
   */
  exportSongs() {
    this.songs.export();
  }

  /**
   * Allias for service method import
   */
  importSongs() {
    this.songs.import();
  }

  /**
   * On initialization get link to songs array
   */
  ngOnInit() {
    this.songList = this.songs.getSongs();
  }
}

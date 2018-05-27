import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { OpenDialogComponent } from './open-dialog/open-dialog.component';
import { Song } from './song';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  constructor(
    protected dialog: MatDialog,
    protected notification: MatSnackBar
  ) { }

  /**
   * Internal array with all songs
   */
  protected songs: Array<Song> = [];

  /**
   * Return all song
   *
   * @returns {Songs[]}
   */
  getSongs() {
    return this.songs;
  }

  /**
   * Create and returns Material Dialog instance
   *
   * @param {Component} DialogComponent - Angular component, which will be used as dialog body
   * @param {number} width - Dialog width in px
   * @param {Any} data - data will be passed in dialog
   */
  protected createDialog(DialogComponent, width: number, data: Song|null = null) {
    return this.dialog.open(DialogComponent, {
      width: width + 'px',
      data: data ? {...data} : null
    });
  }

  /**
   * Open popup for adding new song
   */
  add() {
    this.createDialog(EditDialogComponent, 800).afterClosed().subscribe(result => {
      if (result) {
        this.songs.push(result);
      }
    });
  }

  /**
   * Open song in popup
   *
   * @param {Song} song - song for displaying in popup
   */
  open(song) {
    this.createDialog(EditDialogComponent, 800, song).afterClosed().subscribe(result => {
      if (result) {
        song.author = result.author;
        song.name = result.name;
        song.lyrics = result.lyrics;
      }
    });
  }

  /**
   * Remove song from library
   *
   * @param {Song} song - removing song
   */
  remove(song) {
    const index = this.songs.indexOf(song);

    if (index > -1) {
      this.songs.splice(index, 1);
    }
  }

  /**
   * Exports song into json file.
   * If don't pass argument 'song' will be exported all songs from library
   *
   * @param {Song} [song] - song for exporting
   */
  export(song?) {
    const exportingSongs = (song) ? [song] : this.songs;

    if (!exportingSongs.length) {
      this.notification.open('There are no songs for exprort');
      return;
    }

    const fileName = (exportingSongs.length === 1) ?
      'Exported ' + exportingSongs[0].author + ' - ' + exportingSongs[0].name :
      'Exported ' + exportingSongs.length + ' songs';
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportingSongs));
    const dlAnchorElem = document.getElementById('downloadHelperElement');

    dlAnchorElem.setAttribute('href',     dataStr     );
    dlAnchorElem.setAttribute('download', fileName + '.json');
    dlAnchorElem.click();
  }

  /**
   * Open dialog for importing songs from file into library
   */
  import() {
    this.createDialog(OpenDialogComponent, 300).afterClosed().subscribe(result => {
      if (result) {
        if (result.importType === 'overwrite') {
          this.songs.length = 0;
        }
        this.songs.push(...result.data);
      }
    });
  }
}

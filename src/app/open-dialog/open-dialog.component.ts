import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Song } from '../song';

@Component({
  selector: 'app-open-dialog',
  template: `
<h2 mat-dialog-title>Import songs to your library</h2>
<mat-dialog-content>

  <div class="form-group">
    <input id="file-upload" type="file" accept=".json" (change)="fileUpload($event)">
  </div>

  <div class="form-group">
    <mat-form-field>
      <mat-select placeholder="Import type" [(ngModel)]="importType">
        <mat-option value="concat">Add to current list</mat-option>
        <mat-option value="overwrite">Overwrite current list</mat-option>
      </mat-select>
    </mat-form-field>
  </div>

</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button color="warn" mat-dialog-close>Exit</button>
  <button mat-raised-button color="primary"
    [disabled]="!isDataValid"
    [mat-dialog-close]="{importType: importType, data: importedData}">Import</button>
</mat-dialog-actions>
`,
  styles: [`.form-group{ margin-bottom: 20px; }`]
})
export class OpenDialogComponent {

  /**
   * Import type. Can be 'concat' or 'import'.
   * If 'concat' - imported songs will be added to current library.
   * If 'import' - imported songs will overwrite current library.
   */
  importType = 'concat';
  importedData: Array<Song> = [];
  isDataValid = false;

  constructor(
    public dialogRef: MatDialogRef<OpenDialogComponent>,
    public notification: MatSnackBar
  ) { }

  /**
   * Unfortunately, i dont't have enough time for this :(
   *
   * @param data - data for validation
   */
  validateData(data) {
    return true;
  }

  /**
   * Change event for input[type="file"]
   *
   * @param {Object} event event object
   */
  fileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      this.notification.open('Please, select valid file.');
      this.isDataValid = false;
      return;
    }
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        this.importedData = JSON.parse(e.target.result);
      } catch (exception) {
        this.notification.open('JSON is invalid!');
        this.isDataValid = false;
        return;
      }
      this.isDataValid = this.validateData(this.importedData);
    }.bind(this);
    reader.readAsText(file);
  }
}

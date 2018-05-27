import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatTooltipModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { SongItemComponent } from './song-item/song-item.component';
import { SongsService } from './songs.service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { OpenDialogComponent } from './open-dialog/open-dialog.component';
import { EditLyricsDialogComponent } from './edit-lyrics-dialog/edit-lyrics-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SongItemComponent,
    EditDialogComponent,
    OpenDialogComponent,
    EditLyricsDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  providers: [
    SongsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditDialogComponent,
    OpenDialogComponent,
    EditLyricsDialogComponent,
  ]
})
export class AppModule { }

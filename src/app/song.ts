export interface Song {
  name: string;
  author: string;
  lyrics: Lyrics;
}

export interface Chord {
  name: string;
  offset: number;
}

export interface Lyrics extends Array<any> {
  [index: number]: LyricsRow;
}

export interface LyricsRow {
  text: string;
  chords: Array<Chord>;
}


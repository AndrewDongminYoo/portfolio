export interface LanguageMeta {
  type: Type;
  color?: string;
  extensions?: string[];
  tm_scope: string;
  ace_mode: string;
  language_id: number;
  aliases?: string[];
  codemirror_mode?: string;
  codemirror_mime_type?: string;
  interpreters?: string[];
  group?: string;
  filenames?: string[];
  wrap?: boolean;
  fs_name?: string;
  searchable?: boolean;
}

export enum Type {
  Data = 'data',
  Markup = 'markup',
  Programming = 'programming',
  Prose = 'prose',
}

export type Subject = {
  key: string;
  name: string;
  subject_type: string;
  work_count: number;
  works: Work[];
};

export type Work = {
  key: string;
  title: string;
  edition_count: number;
  cover_id: number;
  cover_edition_key: string;
  subject: string[];
  ia_collection: string[];
  lendinglibrary: boolean;
  printdisabled: boolean;
  lending_edition: string;
  lending_identifier: string;
  authors: Author[];
  first_publish_year: number;
  ia?: string;
  public_scan: boolean;
  has_fulltext: boolean;
};

export type Author = {
  key: string;
  name: string;
};

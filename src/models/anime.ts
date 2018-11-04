export interface Anime {
  id?:   number;
  link?:  string;
  name?: string;
  desc?: string;
  image?: string;
  score?: number;
}

export interface AnimeInfo {
  name: string;
  anime: string;
  image: string;
  summary: string;
  episodes;
  genres;
  status;
  rating: {current, max, vote};
}

export interface Season {
  id: number;
  name?: string;
  desc?: string;
  link: string;
  rating?: number;
  saisonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  url: string[];
  title?: string;
  desc?: string;
  rating?: number;
}

import {Anime, AnimeInfo} from '../../models/anime';

export class SetWatching {
  static readonly type = '[User] setWatching';
  constructor(public payload: AnimeInfo) {}
}

export class SetSession {
  static readonly type = '[User] setSession';
  constructor(public payload: any) {}
}

export class AddWatchListAnime {
  static readonly type = '[Watchlist] Add';
  constructor(public payload: AnimeInfo) {}
}

export class AddWatchListAnimes {
  static readonly type = '[Watchlist] AddArray';
  constructor(public payload: AnimeInfo[]) {}
}

export class RemoveWatchListAnime {
  static readonly type = '[Watchlist] Remove';
  constructor(public payload: string) {}
}

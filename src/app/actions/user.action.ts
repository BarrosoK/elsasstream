import {Anime, AnimeInfo} from '../../models/anime';

export class SetWatching {
  static readonly type = '[User] setWatching';

  constructor(public payload: AnimeInfo) {}
}

export class SetSession {
  static readonly type = '[User] setSession';

  constructor(public payload: any) {}
}

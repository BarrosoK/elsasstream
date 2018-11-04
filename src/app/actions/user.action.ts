import {Anime, AnimeInfo} from '../../models/anime';
export class SetWatching {
  static readonly type = '[User] setWatching';

  constructor(public payload: AnimeInfo) {}
}

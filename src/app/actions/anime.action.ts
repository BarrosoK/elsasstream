import {Anime} from '../../models/anime';

export class AddAnime {
  static readonly type = '[Anime] Add';

  constructor(public payload: Anime) {}
}

export class AddAnimes {
  static readonly type = '[Anime] AddArray';

  constructor(public payload: Anime[]) {}
}

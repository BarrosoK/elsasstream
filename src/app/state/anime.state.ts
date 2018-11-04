import { State, Action, StateContext, Selector } from '@ngxs/store';
import {Anime} from '../../models/anime';
import {AddAnime, AddAnimes} from '../actions/anime.action';

export class AnimeStateModel {
  animes: Anime[];
}

@State<AnimeStateModel>({
  name: 'animes',
  defaults: {
    animes: []
  }
})
export class AnimeState {

  @Selector()
  static getAnimes(state: AnimeStateModel) {
    return state.animes;
  }

  @Action(AddAnime)
  add({getState, patchState }: StateContext<AnimeStateModel>, { payload }: AddAnime) {
    const state = getState();
    patchState({
      animes: [...state.animes, payload]
    });
  }

  @Action(AddAnimes)
  addAnimes({getState, patchState}: StateContext<AnimeStateModel>, {payload}: AddAnimes) {
  const state = getState();
  patchState({
    animes: [...state.animes, ...payload]
  });
  }
}

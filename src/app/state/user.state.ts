import { State, Action, StateContext, Selector } from '@ngxs/store';
import {AnimeInfo} from '../../models/anime';
import {AddWatchListAnime, AddWatchListAnimes, RemoveWatchListAnime, SetScrapped, SetSession, SetWatching} from '../actions/user.action';
import {AngularFireAuth} from 'angularfire2/auth';

export class UserStateModel {
  session: any;
  watching: AnimeInfo;
  scrapped: string;
  watchList: AnimeInfo[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    watching: null,
    session: null,
    scrapped: null,
    watchList: [],
  }
})
export class UserState {


  constructor(private afAuth: AngularFireAuth) {

  }

  @Selector()
  static getSession(state: UserStateModel) {
    return state.session;
  }

  @Selector()
  static getWatching(state: UserStateModel) {
    return state.watching;
  }

  @Selector()
  static getWatchlist(state: UserStateModel) {
    return state.watchList;
  }

  @Action(SetScrapped)
  setScrapped({getState, patchState}: StateContext<UserStateModel>, {payload}: SetScrapped) {
    const state = getState();
    patchState({
        scrapped: payload
      });
  }

  @Action(SetSession)
  setSession({getState, patchState}: StateContext<UserStateModel>, {payload}: SetSession) {
    const state = getState();
    patchState({
      session: payload
    });
  }

  @Action(SetWatching)
  add({getState, patchState }: StateContext<UserStateModel>, { payload }: SetWatching) {
    const state = getState();
    patchState({
      watching: payload
    });
  }

  @Action(AddWatchListAnime)
  addWatchListAnime({getState, patchState}: StateContext<UserStateModel>, {payload}: AddWatchListAnime) {
    const state = getState();
    patchState({
      watchList: [...state.watchList, payload]
    });
  }

  @Action(AddWatchListAnimes)
  addWatchListAnimes({getState, patchState}: StateContext<UserStateModel>, {payload}: AddWatchListAnimes) {
    const state = getState();
    patchState({
      watchList: [...state.watchList, ...payload]
    });
  }

  @Action(RemoveWatchListAnime)
  removeWatchListAnime({getState, patchState}: StateContext<UserStateModel>, {payload}: RemoveWatchListAnime) {
    const state = getState();
    patchState({
      watchList: state.watchList.filter(anime => anime.anime !== payload)
    });
  }

}

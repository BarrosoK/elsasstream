import { State, Action, StateContext, Selector } from '@ngxs/store';
import {AnimeInfo} from '../../models/anime';
import {SetSession, SetWatching} from '../actions/user.action';
import {AngularFireAuth} from 'angularfire2/auth';

export class UserStateModel {
  session: any;
  watching: AnimeInfo;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    watching: null,
    session: null
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
}

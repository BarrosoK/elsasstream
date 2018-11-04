import { State, Action, StateContext, Selector } from '@ngxs/store';
import {AnimeInfo} from '../../models/anime';
import {SetWatching} from '../actions/user.action';

export class UserStateModel {
  watching: AnimeInfo;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    watching: null
  }
})
export class UserState {

  @Selector()
  static getWatching(state: UserStateModel) {
    return state.watching;
  }

  @Action(SetWatching)
  add({getState, patchState }: StateContext<UserStateModel>, { payload }: SetWatching) {
    const state = getState();
    patchState({
      watching: payload
    });
  }
}

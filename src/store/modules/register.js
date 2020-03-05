import { HTTP_POST } from '../const';
import { REGISTER_REQUEST } from '../const/register';
import { AUTH_LOGIN } from '../const/auth';

export default {
  namespaced: true,
  actions: {
    [REGISTER_REQUEST]: async ({ dispatch, commit }, { email, password }) => {
      let request = await dispatch(HTTP_POST, {
        method: REGISTER_REQUEST,
        body: { email, password },
        with_token: false,
        no_commit: true,
        namespace: 'register',
      }, { root: true });

      if (request) {
        await dispatch(`auth/${ AUTH_LOGIN }`, { email, password }, { root: true })
      }
    },
  },
};

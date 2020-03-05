import Vue from 'vue'
import jwt from "jsonwebtoken";
import router from '../../router/';
import { AUTH_LOGIN, AUTH_LOGOUT } from '../const/auth';
import { HTTP_POST } from '../const';
import { SET_PROJECT } from '../const/projects';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
  },
  getters: {
    getToken: state => state.token,
    getUsername: state => state.username,
  },
  actions: {
    [AUTH_LOGIN]: async ({ dispatch, commit }, { email, password }) => {
      let request = await dispatch(HTTP_POST, {
        method: AUTH_LOGIN,
        body: { email, password },
        with_token: false,
        no_commit: true,
        namespace: 'auth',
      }, { root: true });

      if (request) {
        let token = request.data.token;
        let user_info = jwt.decode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('username', user_info.username);

        commit(AUTH_LOGIN, { token, username: user_info.username });
        await router.push({ name: 'Widgets' });
      }
    },
    [AUTH_LOGOUT]: async ({ dispatch, commit }) => {
      commit(AUTH_LOGOUT);
      commit('projects/' + SET_PROJECT, {data: ''}, { root: true });
      await router.push({ name: 'Login' });
    },
  },
  mutations: {
    [AUTH_LOGIN]: (state, { token, username }) => {
      Vue.set(state, 'token', token);
      Vue.set(state, 'username', username);
    },
    [AUTH_LOGOUT]: (state) => {
      localStorage.removeItem('projectId');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      Vue.set(state, 'token', '');
      Vue.set(state, 'username', '');
    },
  },
};

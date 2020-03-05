import Vue from 'vue'
import { HTTP_GET, HTTP_POST } from '../const';
import { SCRIPTS_UPLOAD, SCRIPTS_UPLOAD_PHRASES, SCRIPTS_LIST, SCRIPTS_CLEAR_PHONES } from '../const/scripts';


export default {
  namespaced: true,
  state: {
    scripts: [],
    scriptList: [],
  },
  getters: {
    getScripts: state => state.scripts,
    getScriptList: state => state.scriptList,
  },
  actions: {
    [SCRIPTS_UPLOAD]: async ({ dispatch, commit }, { id, file, data }) => {
      return await dispatch(HTTP_POST, {
        method: SCRIPTS_UPLOAD,
        params: { id },
        namespace: 'scripts',
        upload: true,
        file: file,
        data: data,
      }, { root: true });
    },
    [SCRIPTS_UPLOAD_PHRASES]: async ({ dispatch, commit }, { id, scriptId, phrases }) => {
      return await dispatch(HTTP_POST, {
        method: SCRIPTS_UPLOAD_PHRASES,
        params: { id, scriptId },
        namespace: 'scripts',
        upload: true,
        phrases: phrases,
        no_commit: true,
      }, { root: true });
    },
    [SCRIPTS_LIST]: async ({ dispatch, commit }, { id, page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: SCRIPTS_LIST,
        params: { page, perPage },
        replace: { id },
        namespace: 'scripts',
      }, { root: true });
    },

  },
  mutations: {
    [SCRIPTS_UPLOAD]: (state, { data }) => {
      Vue.set(state, 'scripts', data);
    },
    [SCRIPTS_LIST]: (state, { data }) => {
      Vue.set(state, 'scriptList', data.collection);
    },
    [SCRIPTS_CLEAR_PHONES]: (state) => {
      Vue.set(state, 'scriptList', []);
    },
  },
};

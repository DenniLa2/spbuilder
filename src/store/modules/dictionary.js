import Vue from 'vue'
import { HTTP_GET, HTTP_POST } from '../const';
import { DICTIONARY_LIST, DICTIONARY_UPLOAD } from '../const/dictionary';


export default {
  namespaced: true,
  state: {
    dictionaryList: [],
  },
  getters: {
    getDictionaryList: state => state.dictionaryList,
  },
  actions: {
    [DICTIONARY_UPLOAD]: async ({ dispatch, commit }, { id, file, data }) => {
      return await dispatch(HTTP_POST, {
        method: DICTIONARY_UPLOAD,
        params: { id },
        namespace: 'dictionary',
        upload: true,
        file: file,
        data: data,
        no_commit: true,
      }, { root: true });
    },
    [DICTIONARY_LIST]: async ({ dispatch, commit }, { id, page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: DICTIONARY_LIST,
        params: { page, perPage },
        replace: { id },
        namespace: 'dictionary',
      }, { root: true });
    },

  },
  mutations: {
    [DICTIONARY_LIST]: (state, { data }) => {
      Vue.set(state, 'dictionaryList', data.collection);
    },
  },
};

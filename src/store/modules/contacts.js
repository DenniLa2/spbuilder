import Vue from 'vue'
import { HTTP_GET, HTTP_POST, HTTP_PUT } from '../const';
import {
  CONTACTS_UPLOAD_PHONES,
  CONTACTS_IMPORT_PHONES,
  CONTACTS_GET_PHONES,
  CONTACTS_CLEAR_PHONES,
  CONTACTS_GET_LIST,
  CONTACTS_CLEAR_BASE,
} from '../const/contacts';


export default {
  namespaced: true,
  state: {
    contacts: [],
    contactList: [],
    contactBaseList: [],
  },
  getters: {
    getContacts: state => state.contacts,
    getContactList: state => state.contactList,
    getContactBaseList: state => state.contactBaseList,
  },
  actions: {
    [CONTACTS_UPLOAD_PHONES]: async ({ dispatch, commit }, { file }) => {
      return await dispatch(HTTP_POST, {
        method: CONTACTS_UPLOAD_PHONES,
        namespace: 'contacts',
        upload: true,
        file: file,
      }, { root: true });
    },
    [CONTACTS_IMPORT_PHONES]: async ({ dispatch, commit }, { data }) => {
      return await dispatch(HTTP_POST, {
        method: CONTACTS_IMPORT_PHONES,
        body: {
          name: data.name,
          desc: data.desc,
          fields: data.fields,
          file: data.file,
          options: data.options,
        },
        namespace: 'contacts',
        no_commit: true,
      }, { root: true });
    },
    [CONTACTS_GET_PHONES]: async ({ dispatch, commit }, { page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: CONTACTS_GET_PHONES,
        params: { page, perPage },
        namespace: 'contacts',
      }, { root: true });
    },
    [CONTACTS_GET_LIST]: async ({ dispatch, commit }, { baseId, page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: CONTACTS_GET_LIST,
        params: { page, perPage },
        replace: { baseId },
        namespace: 'contacts',
      }, { root: true });
    },
  },
  mutations: {
    [CONTACTS_UPLOAD_PHONES]: (state, { data }) => {
      Vue.set(state, 'contacts', data);
    },
    [CONTACTS_GET_PHONES]: (state, { data }) => {
      Vue.set(state, 'contactList', data.collection);
    },
    [CONTACTS_CLEAR_PHONES]: (state) => {
      Vue.set(state, 'contactList', []);
    },
    [CONTACTS_GET_LIST]: (state, { data }) => {
      Vue.set(state, 'contactBaseList', data.collection);
    },
    [CONTACTS_CLEAR_BASE]: (state) => {
      Vue.set(state, 'contactBaseList', []);
    },
  },
};

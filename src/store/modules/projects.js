import Vue from 'vue'
import { HTTP_GET, HTTP_POST, HTTP_PUT } from '../const';
import {
  PROJECT_ACTIVATE,
  PROJECT_ARCHIVE,
  PROJECT_CHANGE_STATUS, PROJECT_CREATE, PROJECT_EDIT,
  PROJECT_FORM,
  PROJECT_LIST, SET_PROJECT,
} from '../const/projects';

export default {
  namespaced: true,
  state: {
    project_list: [],
    current_project: '' || JSON.parse(localStorage.getItem('projectId')),
  },
  getters: {
    getProjects: state => state.project_list,
    getProject: state => id => {
      return state.project_list.find(todo => todo.id === id);
    },
    getCurrentProject: state => state.current_project,
  },
  actions: {
    [PROJECT_LIST]: async ({ dispatch, commit }, { page, perPage }) => {
      await dispatch(HTTP_GET, {
        method: PROJECT_LIST,
        params: { page, perPage },
        namespace: 'projects',
      }, { root: true });
    },
    [PROJECT_CHANGE_STATUS]: async ({ dispatch, commit }, { id, type }) => {
      await dispatch(HTTP_POST, {
        method: type === 'activate' ? PROJECT_ACTIVATE : PROJECT_ARCHIVE,
        params: { id },
        namespace: 'projects',
      }, { root: true });
    },
    [PROJECT_FORM]: async ({ dispatch, commit }, { id, status, name, description }) => {
      if(id){
        return await dispatch(HTTP_PUT, {
          method: PROJECT_EDIT,
          params: { id },
          body: { name, description, status },
          namespace: 'projects',
        }, { root: true });
      } else {
        return await dispatch(HTTP_POST, {
          method: PROJECT_CREATE,
          body: { name, description },
          namespace: 'projects',
        }, { root: true });
      }
    },
  },
  mutations: {
    [PROJECT_LIST]: (state, { data }) => {
      Vue.set(state, 'project_list', data.collection)
    },
    [PROJECT_ACTIVATE]: (state, { params }) => {
      let arrKey = null;
      let project = state.project_list.find((item, key) => {
        if(item.id === params.id){
          arrKey = key;
          return true;
        }
      });
      project.status = "Active";
      Vue.set(state.project_list, arrKey, project)
    },
    [PROJECT_ARCHIVE]: (state, { params }) => {
      let arrKey = null;
      let project = state.project_list.find((item, key) => {
        if(item.id === params.id){
          arrKey = key;
          return true;
        }
      });
      project.status = "Archive";
      Vue.set(state.project_list, arrKey, project)
    },
    [PROJECT_EDIT]: (state, { data }) => {
      let arrKey = null;
      state.project_list.find((item, key) => {
        if(item.id === data.id){
          arrKey = key;
          return true;
        }
      });
      Vue.set(state.project_list, arrKey, data)
    },
    [PROJECT_CREATE]: (state, { data }) => {
      Vue.set(state.project_list, state.project_list.length, data)
    },
    [SET_PROJECT]: (state, { data }) => {
      Vue.set(state, 'current_project', data)
    },
  }
};

import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import router from "../router/";
import i18n from '../i18n'

import layout from './modules/layout';
import auth from './modules/auth';
import register from './modules/register';
import projects from './modules/projects';
import contacts from './modules/contacts';
import scripts from './modules/scripts';
import dictionary from './modules/dictionary';
import campaign from './modules/campaign';
import cfg from './config';
import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE,
  HEALTH_CHECK,
  PAGINATION,
  LOADING,
  ERROR,
  REMOVE_ERROR,
} from './const';
import path from './const/path';
import { AUTH_LOGIN, AUTH_LOGOUT } from './const/auth';

Vue.use(Vuex);

/**
 * Функция формирования url
 * Заменяет данные, например из /user_info/:id => /user_info/1
 * @param url
 * @param params
 * @returns {string|process.env.VUE_APP_API_URL|*}
 */
const getUrl = (url, params = {}) => {
  if (!url) {
    console.error('ERROR URL', url, params);
    return cfg.baseURLApi;
  }
  let path = url;
  if (Object.keys(params).length > 0) {
    Object.keys(params).forEach(function (key) {
      path = path.replace(`:${ key }:`, params[key]);
    });
  }
  return cfg.baseURLApi + path;
};

/**
 * Универсальный метод обработки ошибкок при запросах
 * @param e
 * @param commit
 * @param method
 * @param error
 * @returns {Promise<{response}|*>}
 */
const handleError = async (e, commit, method, error) => {
  commit(LOADING, {
    name: method,
    value: 'error',
  });
  if (e.response) {
    if (e.response.status === 401 && method !== AUTH_LOGIN) {
      commit(`auth/${ AUTH_LOGOUT }`);
      await router.push({ name: 'Login' });
    }
  }

  let error_message = 'Что-то пошло не так, обратитесь в тех. поддержку';
  if (error) {
    error_message = error;
  } else if (e.response && (e.response.data.message || e.response.data.title)) {
    let message = e.response.data.message || e.response.data.title;
    let formatted_error = message.split(' ').join('_').replace('.', '').toLowerCase();
    error_message = i18n.t(`error.${ formatted_error }`);
  }
  commit(ERROR, {
    name: method,
    value: error_message,
  });
};

export default new Vuex.Store({
  modules: {
    layout,
    auth,
    register,
    projects,
    contacts,
    scripts,
    dictionary,
    campaign,
  },
  state: {
    loading: {},
    error: {},
    pagination: {},
  },
  getters: {
    loading: (state) => name => name ? state.loading[name] : state.loading,
    error: (state) => name => name ? state.error[name] : state.error,
    pagination: (state) => name => name ? state.pagination[name] : state.pagination,
  },
  actions: {
    /**
     * Запрос GET
     * @param state
     * @param commit
     * @param dispatch
     * @param method - константа на который будет идти запрос
     * @param params - объект с параметрами, ключ -> значение, будет добавлен ?key=value
     * @param with_token - отправлять токен?
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @param args - дополнительные аргументы
     * @returns {Promise<AxiosResponse<T>>}
     */
    [HTTP_GET]: async (
      { state, commit, dispatch },
      { method, params, with_token = true, no_commit = false, ...args },
    ) => {
      console.info({ log: 'HTTP_GET' }, method, params, with_token, no_commit, args);
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.auth.token };
      }
      if (params) {
        config.params = params;
      }
      let replace = {};
      if(args.replace) {
        replace = args.replace
      }
      commit(LOADING, {
        name: method,
        value: 'loading',
      });
      commit(REMOVE_ERROR, method);
      try {
        let request = await axios.get(getUrl(path[method], replace), config);
        commit(LOADING, {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          if (args.namespace) {
            method = args.namespace + '/' + method;
          }
          commit(method, { data: request.data, params });
        }
        if (request.data.pagination) {
          commit(PAGINATION, { name: method, data: request.data.pagination });
        }
        return request;
      } catch (e) {
        console.error('ERROR_HTTP_GET', e);
        await handleError(e, commit, method);
      }
    },

    /**
     * Запрос POST
     * @param state
     * @param commit
     * @param dispatch
     * @param method - константа на который будет идти запрос
     * @param params - параметры для замены в url
     * @param body - тело/данные запроса
     * @param with_token - отправлять токен?
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @param args - дополнительные аргументы
     * @returns {Promise<AxiosResponse<T>|*>}
     */
    [HTTP_POST]: async (
      { state, commit, dispatch },
      { method, params, body = {}, with_token = true, no_commit = false, ...args },
    ) => {
      console.info({ log: 'HTTP_POST' }, method, params, body, with_token, no_commit, args);
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.auth.token };
      }
      commit(LOADING, {
        name: method,
        value: 'loading',
      });
      commit(REMOVE_ERROR, method);

      try {
        if (args.upload) {
          config.headers['Content-Type'] = 'multipart/form-data';
          body = new FormData();
          if (args.phrases) {
            body.append('phrases', args.phrases);
          } else {
            body.append('file', args.file);
          }
          if(args.data){
            body.append('data', JSON.stringify(args.data));
          }
        }

        let request = await axios.post(getUrl(path[method], params), body, config);
        commit(LOADING, {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          if (args.namespace) {
            method = args.namespace + '/' + method;
          }
          commit(method, { data: request.data, params });
        }
        if (request.data.pagination) {
          commit(PAGINATION, { name: method, data: request.data.pagination });
        }
        return request;
      } catch (e) {
        console.error('ERROR_HTTP_POST', e);
        await handleError(e, commit, method);
      }
    },

    /**
     * Запрос PUT
     * @param state
     * @param commit
     * @param dispatch
     * @param method - константа на который будет идти запрос
     * @param params - параметры для замены в url
     * @param body - тело/данные запроса
     * @param with_token - отправлять токен?
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @param args - дополнительные аргументы
     * @returns {Promise<AxiosResponse<T>|*>}
     */
    [HTTP_PUT]: async (
      { state, commit, dispatch },
      { method, params, body = {}, with_token = true, no_commit = false, ...args },
    ) => {
      console.info({ log: 'HTTP_PUT' }, method, params, body, with_token, no_commit, args);
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.auth.token };
      }
      commit(LOADING, {
        name: method,
        value: 'loading',
      });
      commit(REMOVE_ERROR, method);
      try {
        let request = await axios.put(getUrl(path[method], params), body, config);
        commit(LOADING, {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          if (args.namespace) {
            method = args.namespace + '/' + method;
          }
          commit(method, { data: request.data, params });
        }
        if (request.data.pagination) {
          commit(PAGINATION, { name: method, data: request.data.pagination });
        }
        return request;
      } catch (e) {
        console.error('ERROR_HTTP_PUT', e);
        await handleError(e, commit, method);
      }
    },

    /**
     * Запрос DELETE
     * @param state
     * @param commit
     * @param dispatch
     * @param method - константа на который будет идти запрос
     * @param params - параметры для замены в url
     * @param body - тело/данные запроса
     * @param with_token - отправлять токен?
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @param args - дополнительные аргументы
     * @returns {Promise<AxiosResponse<T>|*>}
     */
    [HTTP_DELETE]: async (
      { state, commit, dispatch },
      { method, params, body = {}, with_token = true, no_commit = false, ...args },
    ) => {
      console.info({ log: 'HTTP_DELETE' }, method, params, body, with_token, no_commit, args);
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.auth.token };
      }
      commit(LOADING, {
        name: method,
        value: 'loading',
      });
      commit(REMOVE_ERROR, method);
      try {
        let request = await axios.delete(getUrl(path[method], params), config);
        commit(LOADING, {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          if (args.namespace) {
            method = args.namespace + '/' + method;
          }
          commit(method, { data: request.data, params });
        }
        if (request.data.pagination) {
          commit(PAGINATION, { name: method, data: request.data.pagination });
        }
        return request;
      } catch (e) {
        console.error('ERROR_HTTP_DELETE', e);
        await handleError(e, commit, method);
      }
    },
    /**
     * Запрос проверки работоспособности сервера
     * @param state
     * @param commit
     * @param dispatch
     * @returns {Promise<void>}
     */
    [HEALTH_CHECK]: async ({ dispatch }) => {
      let request = await dispatch(HTTP_GET, {
        method: HEALTH_CHECK,
        with_token: false,
        no_commit: true,
      });
      if (!request) {
        await router.push({ name: 'ServerError' });
      }
    },
  },
  mutations: {
    [LOADING]: (state, { name, value }) => {
      Vue.set(state.loading, name, value);
    },
    [ERROR]: (state, { name, value }) => {
      Vue.set(state.error, name, value);
    },
    [REMOVE_ERROR]: (state, name) => {
      Vue.set(state.error, name, null);
    },
    [PAGINATION]: (state, { name, data }) => {
      Vue.set(state.pagination, name, data);
    },
  },
});

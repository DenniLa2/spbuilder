import Vue from 'vue'
import { HTTP_GET, HTTP_POST } from '../const';
import {
  CAMPAIGN_CREATE,
  CAMPAIGN_LIST,
  CAMPAIGN_START,
  CAMPAIGN_STOP,
  CAMPAIGN_CHANGE_STATUS,
  CAMPAIGN_HISTORY,
} from '../const/campaign';


export default {
  namespaced: true,
  state: {
    campaignList: [],
    campaignHistory: [],
  },
  getters: {
    getCampaignList: state => state.campaignList,
    getCampaignHistory: state => state.campaignHistory,
  },
  actions: {
    [CAMPAIGN_CREATE]: async ({ dispatch, commit }, { id, name, phoneDB, script, dictionary }) => {
      return await dispatch(HTTP_POST, {
        method: CAMPAIGN_CREATE,
        params: { id },
        namespace: 'campaign',
        body: { name, phoneDB, script, dictionary },
        no_commit: true,
      }, { root: true });
    },
    [CAMPAIGN_CHANGE_STATUS]: async ({ dispatch, commit }, { id, campaignId, type }) => {
      return await dispatch(HTTP_POST, {
        method: type === 'start' ? CAMPAIGN_START : CAMPAIGN_STOP,
        params: { id, campaignId },
        namespace: 'campaign',
        no_commit: true,
      }, { root: true });
    },
    [CAMPAIGN_LIST]: async ({ dispatch, commit }, { id, page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: CAMPAIGN_LIST,
        params: { page, perPage },
        replace: { id },
        namespace: 'campaign',
      }, { root: true });
    },
    [CAMPAIGN_HISTORY]: async ({ dispatch, commit }, { id, campaignId, page, perPage }) => {
      return await dispatch(HTTP_GET, {
        method: CAMPAIGN_HISTORY,
        params: { page, perPage },
        replace: { id, campaignId },
        namespace: 'campaign',
      }, { root: true });
    },

  },
  mutations: {
    [CAMPAIGN_LIST]: (state, { data }) => {
      Vue.set(state, 'campaignList', data.collection);
    },
    [CAMPAIGN_HISTORY]: (state, { data }) => {
      Vue.set(state, 'campaignHistory', data.collection);
    },
  },
};

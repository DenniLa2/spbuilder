import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import i18n from '../i18n'
import { isActiveToken } from '../mixins/auth';

import Layout from '@/components/Layout/Layout';
import Widgets from '@/views/Widgets/Widgets';
import Login from '@/views/Login/Login';
import Register from '@/views/Register/Register';
import NotFound from '@/views/Error/NotFound';
import ServerError from '@/views/Error/ServerError';

/* Проекты */
import Projects from '@/views/Projects/Projects';

import ContactsDatabase from "@/views/Contacts/ContactsDatabase";
import ContactsImport from '@/views/Contacts/Import/ContactsImport';
import ContactsList from '@/views/Contacts/List/ContactsList';

import Scripts from '@/views/Scripts/Scripts';
import ScriptsUpload from '@/views/Scripts/ScriptsUpload';
import Dictionary from '@/views/Dictionary/Dictionary';
import DictionaryUpload from '@/views/Dictionary/DictionaryUpload';

import Campaign from '@/views/Campaign/Сampaign';
import CampaignCreate from '@/views/Campaign/СampaignCreate';
import CampaignHistory from '@/views/Campaign/History/CampaignHistory';


Vue.use(Router);

const ifAuthenticatedAndCheckProject = (to, from, next) => {
  if (isActiveToken(store.getters['auth/getToken'])) {
    if (to.meta.chooseProject && !store.getters['projects/getCurrentProject']) {
      Vue.notify({
        group: 'custom-template',
        type: 'error',
        title: i18n.t('projects.choose_project'),
        duration: 2000,
      });
      next(false);
      return;
    }
    next();
    return;
  }
  next('/login');
};

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/app/dashboard'},
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: i18n.t('auth.authorization')
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: i18n.t('auth.registration')
      }
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      beforeEnter: ifAuthenticatedAndCheckProject,
      children: [
        // main pages
        {
          path: 'dashboard',
          name: 'Widgets',
          component: Widgets,
          beforeEnter: ifAuthenticatedAndCheckProject,
        },
        {
          path: 'projects',
          name: 'Projects',
          component: Projects,
          beforeEnter: ifAuthenticatedAndCheckProject,
          meta: {
            title: i18n.t('projects.name')
          },
        },
        {
          path: 'contacts-database',
          name: 'ContactsDatabase',
          component: ContactsDatabase,
          beforeEnter: ifAuthenticatedAndCheckProject,
          meta: {
            title: i18n.t('contacts.name'),
          },
          children: [
            {
              path: 'contacts-import',
              name: 'ContactsImport',
              component: ContactsImport,
              beforeEnter: ifAuthenticatedAndCheckProject,
              meta: {
                title: i18n.t('contacts.import'),
              },
            },
            {
              path: 'base/:base_id',
              name: 'ContactsList',
              component: ContactsList,
              beforeEnter: ifAuthenticatedAndCheckProject,
              meta: {
                title: i18n.t('contacts.list'),
              },
            },
          ],
        },
        {
          path: 'scripts',
          name: 'Scripts',
          component: Scripts,
          meta: {
            chooseProject: true,
          },
          beforeEnter: ifAuthenticatedAndCheckProject,
          children: [
            {
              path: 'scripts-upload',
              name: 'ScriptsUpload',
              component: ScriptsUpload,
              meta: {
                chooseProject: true,
              },
              beforeEnter: ifAuthenticatedAndCheckProject,
            },
          ],
        },
        {
          path: 'dictionary',
          name: 'Dictionary',
          component: Dictionary,
          meta: {
            chooseProject: true,
          },
          beforeEnter: ifAuthenticatedAndCheckProject,
          children: [
            {
              path: 'upload',
              name: 'DictionaryUpload',
              component: DictionaryUpload,
              meta: {
                chooseProject: true,
              },
              beforeEnter: ifAuthenticatedAndCheckProject,
            },
          ],
        },
        {
          path: 'campaign',
          name: 'Campaign',
          component: Campaign,
          meta: {
            chooseProject: true,
          },
          beforeEnter: ifAuthenticatedAndCheckProject,
          children: [
            {
              path: 'create',
              name: 'CampaignCreate',
              component: CampaignCreate,
              meta: {
                chooseProject: true,
              },
              beforeEnter: ifAuthenticatedAndCheckProject,
            },
            {
              path: ':campaign_id/history',
              name: 'CampaignHistory',
              component: CampaignHistory,
              meta: {
                chooseProject: true,
              },
              beforeEnter: ifAuthenticatedAndCheckProject,
            },
          ],
        }
      ],
    },
    {
      path: '/500',
      name: 'ServerError',
      component: ServerError,
      meta: {
        title: i18n.t('error.server_error'),
      },
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: i18n.t('error.not_found'),
      },
    },
  ],
});

const title = i18n.t('common.project_name');
router.beforeEach((to, from, next) => {
  document.title = title;
  if (to.meta && to.meta.title) {
    document.title = `${ to.meta.title } | ${ title }`;
  }
  next();
});

export default router;

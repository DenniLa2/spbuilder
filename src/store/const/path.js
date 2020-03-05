import { AUTH_LOGIN } from './auth';
import { REGISTER_REQUEST } from './register';
import { HEALTH_CHECK } from './index';
import { PROJECT_ACTIVATE, PROJECT_ARCHIVE, PROJECT_CREATE, PROJECT_EDIT, PROJECT_LIST } from './projects';
import { CONTACTS_UPLOAD_PHONES, CONTACTS_IMPORT_PHONES, CONTACTS_GET_PHONES, CONTACTS_GET_LIST } from './contacts';
import { SCRIPTS_LIST, SCRIPTS_UPLOAD, SCRIPTS_UPLOAD_PHRASES } from './scripts';
import { DICTIONARY_LIST, DICTIONARY_UPLOAD } from './dictionary';
import { CAMPAIGN_CREATE, CAMPAIGN_HISTORY, CAMPAIGN_LIST, CAMPAIGN_START, CAMPAIGN_STOP } from './campaign';

const path = {
  [AUTH_LOGIN]: '/login',
  [REGISTER_REQUEST]: '/signup',
  [HEALTH_CHECK]: '/healthcheck',
  [PROJECT_LIST]: '/projects',
  [PROJECT_ACTIVATE]: '/projects/:id:/activate',
  [PROJECT_ARCHIVE]: '/projects/:id:/archive',
  [PROJECT_CREATE]: '/projects/create',
  [PROJECT_EDIT]: '/projects/:id:/edit',
  [CONTACTS_UPLOAD_PHONES]: '/phonedb/upload',
  [CONTACTS_IMPORT_PHONES]: '/phonedb/import',
  [CONTACTS_GET_PHONES]: '/phonedb',
  [CONTACTS_GET_LIST]: '/phonedb/:baseId:',
  [SCRIPTS_UPLOAD]: '/projects/:id:/upload/script',
  [SCRIPTS_UPLOAD_PHRASES]: '/projects/:id:/:scriptId:/upload/phrases',
  [SCRIPTS_LIST]: '/projects/:id:/scripts',
  [DICTIONARY_UPLOAD]: '/projects/:id:/upload/dictionary',
  [DICTIONARY_LIST]: '/projects/:id:/dictionaries',
  [CAMPAIGN_LIST]: '/projects/:id:/campaigns',
  [CAMPAIGN_CREATE]: '/projects/:id:/campaigns',
  [CAMPAIGN_START]: '/projects/:id:/campaigns/:campaignId:/run',
  [CAMPAIGN_STOP]: '/projects/:id:/campaigns/:campaignId:/stop',
  [CAMPAIGN_HISTORY]: '/projects/:id:/campaigns/:campaignId:/history',
};
export default path;

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import moment from 'moment';
import VueTextareaAutosize from 'vue-textarea-autosize';
import { VueMaskDirective } from 'v-mask';
import { ValidationProvider, localize } from 'vee-validate';
import VueFormWizard from 'vue-form-wizard';
import axios from 'axios';
import VCalendar from 'v-calendar';
import VueApexCharts from 'vue-apexcharts';
import CKEditor from '@ckeditor/ckeditor5-vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import store from './store';
import router from './router/';
import App from './App';
import layoutMixin from './mixins/layout';
import config from './store/config';
import Widget from './components/Widget/Widget';
import i18n from './i18n';
import Paginate from 'vuejs-paginate';
import Notifications from 'vue-notification'
axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common['Content-Type'] = "application/json";
const token = localStorage.getItem('token');
if (token) {
    // axios.defaults.headers.common['Authorization'] = "Bearer " + token;
}

Vue.component('v-select', vSelect);
Vue.use(BootstrapVue);
Vue.use(VCalendar, {
  firstDayOfWeek: 2
});
Vue.component('Widget', Widget);
Vue.use(VueTextareaAutosize);
Vue.use(CKEditor);
Vue.component('apexchart', VueApexCharts);
Vue.directive('mask', VueMaskDirective);
import ru from './i18n/validation/ru.json';
localize('ru', ru);
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VueFormWizard);
Vue.mixin(layoutMixin);
Vue.component('paginate', Paginate);

Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.prototype.$moment = moment;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App),
});

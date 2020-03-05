import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './locales/en';
import ru from './locales/ru';


Vue.use(VueI18n);

export default new VueI18n( {
    locale: 'ru',
    messages: {
        en,
        ru
    }
});

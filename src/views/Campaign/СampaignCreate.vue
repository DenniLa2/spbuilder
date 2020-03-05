<template lang="pug">
  b-row
    b-col
      widget(title="")
        b-row
          b-col(md="6")
            h4 {{ $t('campaign.create') }}
          b-col.text-right(md="6")
            router-link.btn.btn-primary(:to="{name:'Campaign'}") {{ $t('common.back') }}
        b-alert.alert-sm(variant='danger', :show='isError')
          | {{ errorMessage }}
        Loader(:show="isLoading", :is-custom="true")
        ValidationObserver(v-slot="{ passes }" ref="form")
          form-wizard(shape="tab" color="#3498db" title="" subtitle="" @on-change="updateProgress")
            b-progress.progress-xs(variant="info" :value="progress" :max="3")
            b-button(slot="prev" variant="primary")
              | {{ $t('campaign.previous') }}
            b-button(slot="next" variant="primary")
              | {{ $t('campaign.next') }}
            b-button(slot="finish" variant="success" @click.prevent="passes(createCampaign)")
              | {{ $t('campaign.create') }}
            tab-content(:title="'1.' + $t('campaign.choose_script')" :before-change="tabValidation")
              b-form
                ValidationObserver(v-if="progress === 1")
                  b-form-group(:label="$t('campaign.campaign_name')" label-for="username")
                    ValidationProvider(:name="$t('campaign.campaign_name')" rules="required" v-slot="{ errors }")
                      b-form-input#username(type="text" v-model="name")
                      .validation-error {{ errors[0] }}
                  b-form-group(:label="$t('scripts.name')" label-for="username")
                    ValidationProvider(:name="$t('scripts.name')" rules="required" v-slot="{ errors }")
                      v-select#default-select(
                        v-model="scriptId"
                        :options="scripts"
                        label="name"
                        :reduce="script => script.id"
                        :placeholder="$t('scripts.choose')"
                      )
                      .validation-error {{ errors[0] }}
            tab-content(:title="'2.' + $t('campaign.choose_base')" :before-change="tabValidation")
              b-form
                ValidationObserver(v-if="progress === 2")
                  b-form-group(:label="$t('contacts.name')" label-for="base-select")
                    ValidationProvider(:name="$t('contacts.name')" rules="required" v-slot="{ errors }")
                      v-select#base-select(
                        v-model="baseId"
                        :options="getContacts"
                        label="name"
                        :reduce="contact => contact.id"
                        :placeholder="$t('contacts.choose')"
                      )
                      .validation-error {{ errors[0] }}
            tab-content(:title="'3.' + $t('campaign.choose_options')")
              b-form
                ValidationObserver(v-if="progress === 3")
                  h4 {{ $t('campaign.place_for_additional_settings') }}
                  b-form-group(:label="$t('dictionary.name')" label-for="destAdress")
                    ValidationProvider(:name="$t('dictionary.name')" rules="required" v-slot="{ errors }")
                      v-select#default-select(
                        v-model="dictionaryId"
                        :options="dictionaries"
                        label="name"
                        :reduce="dictionary => dictionary.id"
                        :placeholder="$t('campaign.choose_dictionary')"
                      )
                      .validation-error {{ errors[0] }}

</template>

<script>
  import Vue from 'vue';
  import vSelect from 'vue-select';
  import Widget from '@/components/Widget/Widget';
  import { mapActions, mapGetters } from 'vuex';
  import { SCRIPTS_LIST } from '../../store/const/scripts';
  import { CONTACTS_GET_PHONES } from '../../store/const/contacts';
  import { CAMPAIGN_CREATE } from '../../store/const/campaign';
  import { DICTIONARY_LIST } from '../../store/const/dictionary';
  import i18n from '../../i18n';
  import Loader from '@/components/Loader/Loader';
  import { ValidationProvider, ValidationObserver } from 'vee-validate';


  export default {
    name: 'CampaignCreate',
    components: { Widget, vSelect, Loader, ValidationProvider, ValidationObserver },
    data() {
      return {
        progress: 1,
        name: '',
        projectId: '',
        baseId: '',
        scriptId: '',
        dictionaryId: '',
      };
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('scripts', {
        scripts: 'getScriptList',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      ...mapGetters('contacts', {
        'getContacts': 'getContactList',
      }),
      ...mapGetters('dictionary', {
        'dictionaries': 'getDictionaryList',
      }),
      isLoading() {
        return this.loading(DICTIONARY_LIST) === 'loading';
      },
      isError() {
        return this.loading(DICTIONARY_LIST) === 'error';
      },
      errorMessage() {
        return this.error(DICTIONARY_LIST);
      },
    },
    created() {
      this.projectId = this.currentProject;
      this.getList();
    },
    methods: {
      ...mapActions('scripts', {
        'scriptList': SCRIPTS_LIST,
      }),
      ...mapActions('contacts', {
        'contactList': CONTACTS_GET_PHONES,
      }),
      ...mapActions('dictionary', {
        'dictionaryList': DICTIONARY_LIST,
      }),
      ...mapActions('campaign', {
        'create_campaign': CAMPAIGN_CREATE,
      }),
      async getList() {
        await this.scriptList({
          id: this.projectId.id,
          page: 1,
          perPage: 100,
        });
        await this.contactList({
          id: this.projectId.id,
          page: 1,
          perPage: 100,
        });
        await this.dictionaryList({
          id: this.projectId.id,
          page: 1,
          perPage: 100,
        });
      },
      updateProgress(prevIndex, nextIndex) {
        if (nextIndex >= 0) {
          Vue.set(this, 'progress', nextIndex + 1);
        }
      },
      async tabValidation() {
        return await this.$refs.form.validate();
      },

      async createCampaign() {
        const result = await this.create_campaign({
          id: this.projectId.id,
          name: this.name,
          phoneDB: this.baseId,
          script: this.scriptId,
          dictionary: this.dictionaryId,
        });
        if (result) {
          this.$router.push({ name: 'Campaign' });
          this.$notify({
            group: 'custom-template',
            type: 'success',
            title: i18n.t('common.saved'),
            duration: 2000,
          })
        }
      },
    },
  };
</script>

<style src="@/assets/styles/Wizard.scss" lang="scss"/>

<template lang="pug">
  div
    Widget
      b-row
        b-col(md="6")
          h4 {{ $t('contacts.import') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'ContactsDatabase'}") {{ $t('common.back') }}
      b-alert.alert-sm.mt-3(variant='danger', :show='isError')
        | {{ errorMessage }}
      Loader(:show="isLoading", :is-custom="true")
      ValidationObserver(v-slot="{ passes }")
        b-form-group.mt-4(
          horizontal
          :label="`${$t('contacts.choose_file')}`"
          :label-cols="2"
          label-for="fileupload1"
          label-text-align="right"
          breakpoint="md"
        )
          b-input-group.fileinput.fileinput-new
            label.form-control(for="fileupload1")
              div
                span(v-if="file")
                | {{ file.name }}
            b-input-group-append
              b-button.btn-file(type="button" variant="default" :style="{ padding: 0}")
                label.file-upload-label(for="fileupload1") {{ `${$t('common.select_file')}`}}
              input#fileupload1.display-none(type="file" name="file" @change="onChangeInputFiles")
          .validation-error(v-if="fileError") {{ fileError }}
          button.btn.btn-success.mt-3(@click.prevent="passes(sendFile)" v-if="!formSended") {{ `${$t('contacts.send')}` }}
    contacts-handling(:project="projectId.id")


</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { PROJECT_LIST } from '../../../store/const/projects';
  import { CONTACTS_UPLOAD_PHONES } from '../../../store/const/contacts';
  import { required } from 'vee-validate/dist/rules';
  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import { REMOVE_ERROR } from '../../../store/const';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import ContactsHandling from '@/views/Contacts/Import/ContactsHandling';
  import i18n from '../../../i18n'


  extend('required', required);
  export default {
    name: "ContactsImport",
    components: {
      ValidationObserver,
      ValidationProvider,
      Widget,
      Loader,
      ContactsHandling
    },
    data() {
      return {
        projectId: '',
        file: {},
        fileError: null,
        formSended: false,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('projects', {
        'projects': 'getProjects',
        'currentProject': 'getCurrentProject',
      }),
      ...mapGetters('contacts', {
        'contacts': 'getContacts',
      }),
      isLoading() {
        return this.loading(CONTACTS_UPLOAD_PHONES) === 'loading';
      },
      isError() {
        return this.loading(CONTACTS_UPLOAD_PHONES) === 'error';
      },
      errorMessage() {
        return this.error(CONTACTS_UPLOAD_PHONES);
      },
    },
    created() {
      this.projectId = this.currentProject
    },
    mounted() {
      this.loadProjects();
    },
    beforeDestroy() {
      this.setContacts({ data: [] });
    },
    methods: {
      ...mapActions('projects', {
        'projectListRequest': PROJECT_LIST,
      }),
      ...mapActions('contacts', {
        'uploadPhones': CONTACTS_UPLOAD_PHONES,
      }),
      ...mapMutations({
        'removeError': REMOVE_ERROR,
      }),
      ...mapMutations('contacts', {
        'setContacts': CONTACTS_UPLOAD_PHONES,
      }),
      async loadProjects() {
        await this.projectListRequest({
          page: 1,
          perPage: 100,
        });
      },
      onChangeInputFiles(e) {
        if (e.target.files && e.target.files.length > 0) {
          let file = e.target.files[0];
          let filename = file.name.split('.').pop();
          if (filename !== 'csv') {
            this.fileError = i18n.t('common.only_csv');
          } else {
            this.fileError = null;
            this.file = e.target.files[0];
          }
        }
      },
      async sendFile() {
        if (!this.file.name) {
          this.fileError = i18n.t('common.select_file');
        } else {
          this.fileError = null;
          let request = await this.uploadPhones({
            id: this.projectId.id,
            file: this.file,
          });
          if(request){
            this.$set(this, 'formSended', true);
          } else {
            this.$set(this, 'formSended', false);
          }
        }
      },
    },
  }
</script>

<style>
  .display-none {
    display: none;
  }

  .btn-file {
    padding-bottom: 0;
  }

  .table-resposive {
    overflow: auto
  }

  .file-upload-label {
    display: block;
    margin-bottom: 0;
    padding: 0.375rem 1rem;
    cursor: pointer;
  }

  .select-table-row {
    display: flex;
  }

  .select-table-col {
    flex: 0 0 200px;
    padding: 0.75rem;
    border-top: 1px solid #D7DFE6;
  }

  .select-table-col-header {
    padding-bottom: 5px;
    font-weight: bold;
  }

</style>

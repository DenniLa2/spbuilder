<template lang="pug">
  div
    Widget
      b-row
        b-col(md="6")
          h4 {{ $t('dictionary.import_dictionary') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'Dictionary'}") {{ $t('common.back') }}
      Loader(:show="isLoading", :is-custom="true")
      b-alert.alert-sm(variant='danger', :show='isError')
        | {{ errorMessage }}
      ValidationObserver(v-slot="{ passes }")
        b-form.form-label-left.mt-4
          b-form-group(
            horizontal=""
            label="Имя"
            label-for="name"
            label-class="text-md-left"
            :label-cols="2"
            breakpoint="md"
          )
            ValidationProvider(name="Имя" rules="required" v-slot="{ errors }")
              b-form-input#name(type="text" v-model="name")
              .validation-error {{ errors[0] }}
          b-form-group(
            horizontal=""
            label="Описание"
            label-for="description"
            label-class="text-md-left"
            :label-cols="2"
            breakpoint="md"
          )
            b-form-input#description(type="text" v-model="desc")
        b-form-group(
          horizontal
          :label="`${$t('contacts.choose_file')}`"
          :label-cols="2"
          label-for="fileupload"
          label-text-align="right"
          breakpoint="md"
        )
          b-input-group.fileinput.fileinput-new
            label.form-control(for="fileupload")
              div
                span(v-if="file")
                | {{ file.name }}
            b-input-group-append
              b-button.btn-file(type="button" variant="default" :style="{ padding: 0}")
                label.file-upload-label(for="fileupload") {{ `${$t('common.select_file')}`}}
              input#fileupload.display-none(type="file" name="file" @change="onChangeInputFiles")
          .validation-error(v-if="fileError") {{ fileError }}
          button.btn.btn-success.mt-3(@click.prevent="passes(sendFile)") {{ `${$t('contacts.send')}` }}
</template>

<script>
  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import Widget from '../../components/Widget/Widget';
  import { required } from 'vee-validate/dist/rules';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Loader from '../../components/Loader/Loader';
  import i18n from '../../i18n';
  import { DICTIONARY_UPLOAD } from '../../store/const/dictionary';

  extend('required', required);

  export default {
    name: "DictionaryUpload",
    components: {
      ValidationObserver,
      ValidationProvider,
      Widget,
      Loader,
    },
    data() {
      return {
        projectId: '',
        name: '',
        desc: '',
        file: {},
        fileError: null,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      isLoading() {
        return this.loading(DICTIONARY_UPLOAD) === 'loading';
      },
      isError() {
        return this.loading(DICTIONARY_UPLOAD) === 'error';
      },
      errorMessage() {
        return this.error(DICTIONARY_UPLOAD);
      },
    },
    created() {
      this.projectId = this.currentProject
    },
    methods: {
      ...mapActions('dictionary', {
        'uploadDictionary': DICTIONARY_UPLOAD,
      }),
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
          const result = await this.uploadDictionary({
            id: this.projectId.id,
            file: this.file,
            data: {
              name: this.name,
              desc: this.desc,
            }
          });
          if(result) {
            this.addSuccessNotification(i18n.t('common.saved'));
            this.$router.push({ name: 'Dictionary' })
          }

        }
      },
      addSuccessNotification(message) {
        this.$notify({
          group: 'custom-template',
          type: 'success',
          title: message,
          duration: 2000,
        })
      },
    },
  }
</script>

<style scoped>

</style>

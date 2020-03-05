<template lang="pug">
  div
    Widget
      b-row
        b-col(md="6")
          h4 {{ $t('scripts.import') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'Scripts'}") {{ $t('common.back') }}
      Loader(:show="isLoading", :is-custom="true")
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
          button.btn.btn-success.mt-3(@click.prevent="passes(sendFile)" v-if="!scripts.id") {{ `${$t('contacts.send')}` }}
    Widget(v-if="scripts.id")
      ValidationObserver(v-slot="{ passes }")
        b-form-group(
          horizontal
          :label="`${$t('contacts.choose_file')}`"
          :label-cols="2"
          label-for="fileupload2"
          label-text-align="right"
          breakpoint="md"
        )
          b-input-group.fileinput.fileinput-new
            label.form-control.form-control-padding(for="fileupload2")
              div.selected-files(v-if="audioFile")
                div.selected-file(v-for="audio in audioFile")
                  span(:title="audio.name") {{ audio.name }}
                  span.delete-icon(@click.prevent="deleteAudio(audio.name)") x
            b-input-group-append
              b-button.btn-file(type="button" variant="default" :style="{ padding: 0}")
                label.file-upload-label(for="fileupload2") {{ `${$t('common.select_file')}`}}
              input#fileupload2.display-none(type="file" name="phrases" @change="onChangeInputAudioFiles" multiple)
          .validation-error(v-if="audioFileError") {{ audioFileError }}
          b-progress.mt-4(v-if="showProgress" :value="progress")
          button.btn.btn-success.mt-3(@click.prevent="passes(sendAudioFile)") {{ `${$t('contacts.send')}` }}

</template>

<script>
  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import Widget from '../../components/Widget/Widget';
  import { required } from 'vee-validate/dist/rules';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { SCRIPTS_UPLOAD, SCRIPTS_UPLOAD_PHRASES } from '../../store/const/scripts';
  import { PROJECT_LIST } from '../../store/const/projects';
  import { REMOVE_ERROR } from '../../store/const';
  import Loader from '../../components/Loader/Loader';
  import i18n from '../../i18n';

  extend('required', required);

  export default {
    name: "ScriptsUpload",
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
        audioFile: [],
        fileError: null,
        audioFileError: null,
        showProgress: false,
        progress: 0,
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
      ...mapGetters('scripts', {
        'scripts': 'getScripts',
      }),
      isLoading() {
        return this.loading(SCRIPTS_UPLOAD) === 'loading';
      },
      isError() {
        return this.loading(SCRIPTS_UPLOAD) === 'error';
      },
      errorMessage() {
        return this.error(SCRIPTS_UPLOAD);
      },
    },
    created() {
      this.projectId = this.currentProject
    },
    beforeDestroy() {
      this.setScripts({ data: [] });
    },
    methods: {
      ...mapActions('scripts', {
        'uploadScript': SCRIPTS_UPLOAD,
        'uploadPhrases': SCRIPTS_UPLOAD_PHRASES,
      }),
      ...mapMutations({
        'removeError': REMOVE_ERROR,
      }),
      ...mapMutations('scripts', {
        'setScripts': SCRIPTS_UPLOAD,
      }),
      deleteAudio(name) {
        this.audioFile = this.audioFile.filter(audio => audio.name !== name);
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
      onChangeInputAudioFiles(e) {
        if (e.target.files && e.target.files.length > 0) {
          this.audioFileError = null;
          let files = e.target.files;
          files.forEach(file => {
            let type = file.type.split('/').shift();
            if (type !== 'audio') {
              this.audioFileError = i18n.t('common.only_audio');
            }
          });
          if (!this.audioFileError) {
            this.audioFile.forEach(audio => {
              files = Object.values(files).filter(file => file.name !== audio.name)
            });
            this.audioFileError = null;
            this.audioFile = this.audioFile.length > 0 ? this.audioFile.concat(files) :  Object.values(files);
          }
        }
      },
      async sendFile() {
        if (!this.file.name) {
          this.fileError = i18n.t('common.select_file');
        } else {
          this.fileError = null;
          await this.uploadScript({
            id: this.projectId.id,
            file: this.file,
            data: {
              name: this.name,
              desc: this.desc,
            }
          });
        }
      },
      async sendAudioFile() {
        if (this.audioFile.length < 1) {
          this.audioFileError = i18n.t('common.select_file');
          return;
        }
        this.audioFileError = null;
        let errors = [];
        this.$set(this, 'showProgress', true);
        let progressValue = 100 / this.audioFile.length;

        for (let file of this.audioFile) {
          let result = await this.uploadPhrases({
            id: this.projectId.id,
            scriptId: this.scripts.id,
            phrases: file,
          });
          if(!result) {
            errors.push(file.name);
          } else {
            this.$set(this, 'progress', this.progress + progressValue);
          }
        }

        if(errors.length < 1) {
          this.$set(this, 'showProgress', false);
          this.$notify({
            group: 'custom-template',
            type: 'success',
            title: i18n.t('common.saved'),
            duration: 2000,
          });
          this.$router.push({ name: 'Scripts' });
        }
      },
    },
  }
</script>

<style scoped>
  .selected-files {
    display: flex;
    flex-wrap: wrap;
  }
  .selected-file{
    padding: 2px 30px 2px 10px;
    background: #1A86D0;
    margin-right: 10px;
    color: white;
    position: relative;
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 15px;
    margin-bottom: 5px;
  }
  .delete-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #fff;
    border-radius: 50%;
    color: #FD5F05;
    border: 1px solid;
    width: 20px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }
  .form-control-padding {
    overflow: auto;
    padding: 0.575rem 1rem 0.375rem
  }
  .form-control {
    height: auto;
  }
</style>

<template lang="pug">
  .projects-form
    Widget(
      :title="`<h4>${getTitle}</h4>`"
      customHeader
    )
      br
      legend
      b-alert.alert-sm(variant='danger', :show='isError')
        | {{ errorMessage }}
      b-form-group
        ValidationObserver(v-slot="{ passes }" ref="form")
          b-form(@submit.prevent="passes(saveProject)")
            ValidationProvider(:name="$t('common.name')" rules="required" v-slot="{ errors }")
              b-form-group(
                horizontal=""
                :label="$t('common.name')"
                label-for="name"
                label-class="text-md-right"
                :label-cols="4"
                breakpoint="md"
              )
                b-form-input#name(
                  type="text"
                  v-model="form.name"
                )
                .validation-error.no-pl {{ errors[0] }}
            b-form-group(
              horizontal=""
              :label="$t('common.description')"
              label-for="description"
              label-class="text-md-right"
              :label-cols="4"
              breakpoint="md"
            )
              b-form-textarea#description(
                v-model="form.description"
              )
            b-form-group.form-action(horizontal="" label="" label-for="transparent-field" :label-cols="4" breakpoint="md")
              b-button.mr-xs(
                variant="primary"
                type="submit"
                :disabled="isLoading"
              ) {{ saveBtnText }}
              b-button(
                v-if="isEdit"
                @click="cancelEdit"
                variant="inverse"
              ) {{ $t('common.cancel') }}
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    PROJECT_CREATE,
    PROJECT_EDIT,
    PROJECT_FORM,
  } from '../../../store/const/projects';
  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import { required } from 'vee-validate/dist/rules';
  import i18n from '../../../i18n';

  extend('required', required);

  export default {
    name: 'ProjectForm',
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false,
      },
      projectId: {
        type: String,
        default: 'null',
      },
    },
    data() {
      return {
        form: {
          id: null,
          name: '',
          description: '',
        },
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('projects', {
        'project': 'getProject',
      }),
      getTitle() {
        return this.isEdit ? i18n.t('projects.edit') : i18n.t('projects.create');
      },
      saveBtnText() {
        if (this.isLoading) {
          return i18n.t('common.loading')
        }
        return this.isEdit ? i18n.t('common.save') : i18n.t('common.create');
      },
      isLoading() {
        return this.loading(PROJECT_CREATE) === 'loading' || this.loading(PROJECT_EDIT) === 'loading';
      },
      isError() {
        return this.loading(PROJECT_CREATE) === 'error' || this.loading(PROJECT_EDIT) === 'error';
      },
      errorMessage() {
        return this.error(PROJECT_CREATE) || this.error(PROJECT_EDIT);
      },
    },
    watch: {
      projectId(val) {
        if (val && val !== '') {
          let currentProject = this.project(val);
          this.form.id = currentProject.id;
          this.form.name = currentProject.name;
          this.form.description = currentProject.description;
          this.form.status = currentProject.status;
        }
      },
    },
    mounted() {
    },
    methods: {
      ...mapActions('projects', {
        'sendForm': PROJECT_FORM,
      }),
      clearForm() {
        this.form.id = null;
        this.form.name = '';
        this.form.description = '';
      },
      cancelEdit() {
        this.clearForm();
        this.$emit('cancelEdit');
      },
      async saveProject() {
        let request = await this.sendForm(this.form);
        if (request) {
          this.clearForm();
          this.$notify({
            group: 'custom-template',
            type: 'success',
            title: i18n.t('common.saved'),
            duration: 2000,
          });
          this.$refs.form.reset();
        }
      },
    },
  }
</script>
<style lang="scss">
  .projects-page .table td {
    vertical-align : middle;
  }
</style>

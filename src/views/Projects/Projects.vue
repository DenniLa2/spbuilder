<template lang="pug">
  .projects-page
    router-view
    b-row
      b-col(lg="6")
        Loader(:show="isLoading", :is-custom="true")
        Widget(
          :title="`<h4>${$t('projects.name')}</h4>`"
          customHeader
        )
          b-alert.alert-sm(variant='danger', :show='isError')
            | {{ errorMessage }}
          TableComponent(
            :columns="columns"
            :values="projects"
            :search="false"
            @page-change="changePage",
            :pagination="true",
            :pageCount="pageCount"
            type="stripped"
          )
            template(v-slot:actions="{value}")
              .btn.btn-sm.btn-info.mr-xs(
                @click="editProject(value.id)"
                :title="$t('common.edit')"
              )
                i.fa.fa-pencil
              .btn.btn-sm.btn-danger.mr-xs(
                @click="changeProjectStatus(value.id, value.status)"
                :title="getStatusTitleText(value.status)"
                :disabled="isChangeStatus"
              )
                i.fa(:class="getStatusIcon(value.status)")
            template(v-slot:status="{value}")
              b-badge(:variant="getBadgeClass(value.status)") {{ $t(`common.${value.status}`) }}

      b-col(lg="6")
        ProjectForm(
          :is-edit="isEdit",
          :project-id="projectId"
          @cancelEdit="cancelEdit"
        )

</template>
<script>
  import Footer from '@/components/Parts/Footer';
  import ProjectForm from '@/views/Projects/components/Form';
  import Loader from '@/components/Loader/Loader';
  import { mapActions, mapGetters } from 'vuex';
  import { PROJECT_ACTIVATE, PROJECT_ARCHIVE, PROJECT_CHANGE_STATUS, PROJECT_LIST } from '../../store/const/projects';
  import i18n from '../../i18n'
  import TableComponent from '../../components/Table/Table';
  import PaginationMixin from '../../components/mixins/padination';

  export default {
    name: 'Projects',
    mixins: [PaginationMixin],
    components: {
      Footer,
      ProjectForm,
      Loader,
      TableComponent,
    },
    data() {
      return {
        page: 1,
        perPage: 10,
        isEdit: false,
        projectId: '',
        columns: [
          { name: 'name', width: 70, title: i18n.t('common.name') },
          { name: 'status', width: 15, title: i18n.t('common.status') },
          { name: 'actions', width: 15, title: i18n.t('common.actions') },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('projects', {
        'projects': 'getProjects',
      }),
      isLoading() {
        return this.loading(PROJECT_LIST) === 'loading';
      },
      isError() {
        return this.loading(PROJECT_LIST) === 'error' || this.loading(PROJECT_ARCHIVE) === 'error' || this.loading(PROJECT_ACTIVATE) === 'error';
      },
      isChangeStatus() {
        return this.loading(PROJECT_ARCHIVE) === 'loading' || this.loading(PROJECT_ACTIVATE) === 'loading';
      },
      errorMessage() {
        return this.error(PROJECT_LIST) || this.error(PROJECT_ARCHIVE) || this.error(PROJECT_ACTIVATE);
      },
      pageCount() {
        return this.calculatePageCount(`projects/${ PROJECT_LIST }`, this.perPage);
      },
    },
    mounted() {
      this.loadProjects();
    },
    methods: {
      ...mapActions('projects', {
        'projectListRequest': PROJECT_LIST,
        'changeStatusRequest': PROJECT_CHANGE_STATUS,
      }),
      loadProjects() {
        this.projectListRequest({
          page: this.page,
          perPage: this.perPage,
        });
      },
      isActiveProject(status) {
        return status === 'Active';
      },
      getBadgeClass(status) {
        return this.isActiveProject(status) ? 'success' : 'danger';
      },
      getStatusIcon(status) {
        return this.isActiveProject(status) ? 'fa-stop' : 'fa-play';
      },
      getStatusTitleText(status) {
        return this.isActiveProject(status) ? i18n.t('common.to_archive') : i18n.t('common.enable');
      },
      changeProjectStatus(id, status) {
        let type = this.isActiveProject(status) ? 'archive' : 'activate';
        let request = this.changeStatusRequest({
          id,
          type,
        });
        if (request) {
          this.$notify({
            group: 'custom-template',
            type: 'success',
            title: i18n.t('common.saved'),
            duration: 2000,
          });
        }
      },
      editProject(id) {
        this.isEdit = true;
        this.projectId = id;
      },
      cancelEdit() {
        this.isEdit = false;
        this.projectId = '';
      },
      changePage(pageNum) {
        this.$set(this, 'page', pageNum);
        this.loadProjects();
      },
    },
  }
</script>
<style lang="scss">
  .projects-page .table td {
    vertical-align : middle;
  }
</style>

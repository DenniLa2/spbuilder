<template lang="pug">
  router-view(v-if="!isScript")
  widget(v-else)
    b-row
      b-col(md="6")
        h4 {{ $t('scripts.name') }}
      b-col.text-right(md="6")
        router-link.btn.btn-primary(:to="{name:'ScriptsUpload'}") {{ $t('scripts.import') }}
    hr

    b-form.form-label-left.mt-4
      b-alert.alert-sm(variant='danger', :show='isError')
        | {{ errorMessage }}
    .scripts-table
      Loader(:show="isLoading", :is-custom="true")
      TableComponent.mt-5.mb-4(
        :columns="columns"
        :values="getScripts"
        type="hover"
        @page-change="changePage"
        :pagination="true"
        :pageCount="pageCount"
      )
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { SCRIPTS_LIST } from '../../store/const/scripts';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import TableComponent from '@/components/Table/Table';
  import i18n from '../../i18n';
  import PaginationMixin from '../../components/mixins/padination';

  export default {
    name: "Scripts",
    mixins: [PaginationMixin],
    components: {
      Widget,
      Loader,
      TableComponent,
    },
    data() {
      return {
        projectId: {},
        page: 1,
        perPage: 20,
        columns: [
          { name: 'name', width: 50, title: i18n.t('common.name') },
          { name: 'description',  width: 50, title: i18n.t('common.description') },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('scripts', {
        'getScripts': 'getScriptList',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      isScript() {
        return this.$route.name === 'Scripts';
      },
      isLoading() {
        return this.loading(SCRIPTS_LIST) === 'loading';
      },
      errorMessage() {
        return this.error(SCRIPTS_LIST);
      },
      isError() {
        return this.loading(SCRIPTS_LIST) === 'error';
      },
      pageCount() {
        return this.calculatePageCount(`scripts/${ SCRIPTS_LIST }`, this.perPage);
      },
    },
    watch: {
      'currentProject'(val){
        if(val){
          this.projectId = val;
          this.getList();
        }
      },
      '$route'() {
        if(this.isScript){
          this.getList();
        }
      }
    },
    created() {
      this.projectId = this.currentProject
    },
    mounted() {
      this.getList();
    },
    methods: {
      ...mapActions('scripts', {
        'scriptList': SCRIPTS_LIST,
      }),
      getList() {
        this.scriptList({
          id: this.projectId.id,
          page: this.page,
          perPage: this.perPage,
        });
      },
      changePage(pageNum) {
        this.$set(this, 'page', pageNum);
        this.getList();
      },
    },
  }
</script>

<style scoped>

</style>

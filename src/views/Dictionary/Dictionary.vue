<template lang="pug">
  div
    router-view
    widget(v-if="isDictionary")
      b-row
        b-col(md="6")
          h4 {{ $t('dictionary.name') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'DictionaryUpload'}") {{ $t('dictionary.import_dictionary') }}
      hr

      b-form.form-label-left.mt-4
        b-alert.alert-sm(variant='danger', :show='isError')
          | {{ errorMessage }}
      .disctionary-table
        Loader(:show="isLoading", :is-custom="true")
        TableComponent.mt-5.mb-4(
          :columns="columns"
          :values="dictionaries"
          type="stripped"
          @page-change="changePage"
          :pagination="true"
          :pageCount="pageCount"
        )
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import i18n from '../../i18n';
  import TableComponent from '@/components/Table/Table';
  import { DICTIONARY_LIST } from '../../store/const/dictionary';
  import PaginationMixin from '../../components/mixins/padination';

  export default {
    name: "Dictionary",
    mixins: [PaginationMixin],
    components: {
      Widget,
      Loader,
      TableComponent,
    },
    data() {
      return {
        projectId: '',
        page: 1,
        perPage: 20,
        columns: [
          { name: 'name', title: i18n.t('common.name') },
          { name: 'description', title: i18n.t('common.description') }
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('dictionary', {
        'dictionaries': 'getDictionaryList',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
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
      isDictionary() {
        return this.$route.name === 'Dictionary';
      },
      pageCount() {
        return this.calculatePageCount(`dictionary/${ DICTIONARY_LIST }`, this.perPage);
      },
    },
    watch: {
      'currentProject'(val){
        if(val){
          this.projectId = val;
          this.getList();
        }
      },
      '$route' () {
        if(this.isDictionary){
          this.getList();
        }
      }
    },
    created() {
      this.projectId = this.currentProject;
    },

    mounted() {
      this.getList();
    },
    methods: {
      ...mapActions('dictionary', {
        'dictionaryList': DICTIONARY_LIST,
      }),
      async getList() {
        if (!this.isDictionary) {
          return;
        }
        await this.dictionaryList({
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

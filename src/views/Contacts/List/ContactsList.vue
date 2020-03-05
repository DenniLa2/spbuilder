<template lang="pug">
  div
    router-view
    widget
      b-row
        b-col(md="6")
          h4 {{ $t('contacts.list') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'ContactsDatabase'}") {{ $t('common.back') }}
      hr
      .contacts-table
        Loader(:show="isLoading", :is-custom="true")
        TableComponent.mt-5.mb-4(
          :columns="getColumns"
          :values="baseList"
          type="stripped"
          @page-change="changePage"
          :pagination="true"
          :pageCount="pageCount"
        )
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { CONTACTS_CLEAR_BASE, CONTACTS_GET_LIST, CONTACTS_GET_PHONES } from '../../../store/const/contacts';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import i18n from '../../../i18n';
  import TableComponent from '@/components/Table/Table';
  import PaginationMixin from '../../../components/mixins/padination';

  export default {
    name: "DatabaseImport",
    mixins: [PaginationMixin],
    components: {
      Widget,
      Loader,
      TableComponent
    },
    data() {
      return {
        baseId: null,
        page: 1,
        perPage: 50,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('contacts', {
        'getBaseList': 'getContactBaseList',
      }),
      isLoading() {
        return this.loading(CONTACTS_GET_LIST) === 'loading';
      },
      isError() {
        return this.loading(CONTACTS_GET_LIST) === 'error';
      },
      errorMessage() {
        return this.error(CONTACTS_GET_LIST);
      },
      baseList(){
        let bases = [];
        this.getBaseList.map(base => {
          let field = {};
          if(base.fields.length > 0){
            base.fields.map(value => {
              let field_array = Object.entries(value);
              field[field_array[0][0]] = field_array[0][1]; // TODO подумать как лучше сделать
            })
          }
          bases.push({ phone: base.number, ...field});
        });
        return bases;
      },
      getColumns(){
        let columns = [];
        if(this.baseList.length > 0){
          let baseList = this.baseList;
          let firstBase = baseList.shift();
          Object.keys(firstBase).forEach((item) => {
            columns.push({
              name: item,
              title: item,
            });
          });
        }
        return columns;
      },
      pageCount() {
        return this.calculatePageCount(`contacts/${ CONTACTS_GET_LIST }`, this.perPage);
      },
    },
    created(){
      this.$set(this, 'baseId', this.$route.params.base_id);
    },
    mounted(){
      this.getList();
    },
    methods: {
      ...mapActions('contacts', {
        'contactList': CONTACTS_GET_LIST,
      }),
      ...mapMutations('contacts', {
        'contactsClear': CONTACTS_CLEAR_BASE,
      }),
      async getList() {
        if(this.baseId){
          await this.contactList({
            baseId: this.baseId,
            page: this.page,
            perPage: this.perPage
          });
        }
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

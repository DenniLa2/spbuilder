<template lang="pug">
  div
    router-view
    widget(v-if="isContactsList")
      b-row
        b-col(md="6")
          h4 {{ $t('contacts.name') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'ContactsImport'}") {{ $t('contacts.import_base') }}
      hr

      b-form.form-label-left.mt-4
        b-alert.alert-sm(variant='danger', :show='isError')
          | {{ errorMessage }}
        Loader(:show="isProjectsLoading", :is-custom="true")
      .contacts-table
        Loader(:show="isLoading", :is-custom="true")
        TableComponent.mt-5.mb-4(
          :columns="columns"
          :values="getContacts"
          type="stripped"
          @page-change="changePage"
          :pagination="true"
          :pageCount="pageCount"
        )
          template(v-slot:status="{ value }")
            b-badge(:variant="getBadgeClass(value.status)") {{ $t(`common.${value.status}`) }}
          template(v-slot:actions="{ value }")
            b-button(size="xs" variant="info")
              router-link(
                :to="{ name: 'ContactsList', params: { base_id: value.id }}"
                tag="span"
              ) {{ $t('common.see') }}
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { CONTACTS_CLEAR_PHONES, CONTACTS_GET_PHONES } from '../../store/const/contacts';
  import { PROJECT_LIST } from '../../store/const/projects';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import i18n from '../../i18n';
  import TableComponent from '@/components/Table/Table';
  import PaginationMixin from '../../components/mixins/padination';

  export default {
    name: "DatabaseImport",
    mixins: [PaginationMixin],
    components: {
      Widget,
      Loader,
      TableComponent,
    },
    data() {
      return {
        page: 1,
        perPage: 20,
        columns: [
          { name: 'name', title: i18n.t('common.name') },
          { name: 'description', title: i18n.t('common.description') },
          { name: 'status', width: 10, title: i18n.t('common.status') },
          { name: 'actions', width: 10, title: i18n.t('common.actions') },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('contacts', {
        'getContacts': 'getContactList',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      isLoading() {
        return this.loading(CONTACTS_GET_PHONES) === 'loading';
      },
      isProjectsLoading() {
        return this.loading(PROJECT_LIST) === 'loading';
      },
      isError() {
        return this.loading(PROJECT_LIST) === 'error' || this.loading(CONTACTS_GET_PHONES) === 'error';
      },
      errorMessage() {
        return this.error(PROJECT_LIST) || this.error(CONTACTS_GET_PHONES);
      },
      isContactsList() {
        return this.$route.name === 'ContactsDatabase';
      },
      pageCount() {
        return this.calculatePageCount(`contacts/${ CONTACTS_GET_PHONES }`, this.perPage);
      },
    },
    watch: {
      '$route' () {
        if(this.isContactsList){
          this.getList();
        }
      }
    },

    mounted() {
      this.getList();
    },
    methods: {
      ...mapActions('contacts', {
        'contactList': CONTACTS_GET_PHONES,
      }),
      ...mapMutations('contacts', {
        'clearPhones': CONTACTS_CLEAR_PHONES,
      }),
      async getList() {
        if (!this.isContactsList) {
          return;
        }
        await this.contactList({
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
      changePage(pageNum) {
        this.$set(this, 'page', pageNum);
        this.getList();
      },
    },
  }
</script>

<style scoped>

</style>

<template lang="pug">
  div
    router-view
    widget(v-if="isCampaign")
      b-row
        b-col(md="6")
          h4 {{ $t('campaign.name') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'CampaignCreate'}") {{ $t('campaign.create') }}
      hr

      b-form.form-label-left.mt-4
        b-alert.alert-sm(variant='danger', :show='isError')
          | {{ errorMessage }}
      .campaign-table
        Loader(:show="isLoading", :is-custom="true")
        TableComponent.mt-5.mb-4(
          :columns="columns"
          :values="companies"
          type="stripped"
          @page-change="changePage"
          :pagination="true"
          :pageCount="pageCount"
        )
          template(v-slot:project="{value}")
            | {{ value.project.name }}
          template(v-slot:dictionary="{value}")
            | {{ value.dictionary.name }}
          template(v-slot:script="{value}")
            | {{ value.script.name }}
          template(v-slot:phoneDB="{value}")
            | {{ value.phoneDB.name }}
          template(v-slot:status="{value}")
            b-badge(:variant="getBadgeClass(value.status.title)") {{ $t(`common.${value.status.title}`) }}
          template(v-slot:actions="{value}")
            .btn.btn-sm.mr-xs(
              :class="{'btn-danger': isActiveProject(value.status.title), 'btn-success': !isActiveProject(value.status.title)}"
              @click="changeCampaignStatus(value.id, value.project.id, value.status.title)"
              :title="getStatusTitleText(value.status.title)"
            )
              i.fa(:class="getStatusIcon(value.status.title)")
            router-link.btn.btn-sm.btn-primary.mr-xs(
              tag="div"
              :to="{ name: 'CampaignHistory', params: { campaign_id: value.id } }"
              :title="$t('common.see_history')"
            )
              i.fa.fa-eye
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import i18n from '../../i18n';
  import TableComponent from '@/components/Table/Table';
  import { CAMPAIGN_LIST, CAMPAIGN_CHANGE_STATUS } from '../../store/const/campaign';
  import PaginationMixin from '../../components/mixins/padination';

  export default {
    name: "Campaign",
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
          { name: 'project', title: i18n.t('projects.name_single') },
          { name: 'dictionary', title: i18n.t('dictionary.name_single') },
          { name: 'script', title: i18n.t('scripts.name_single') },
          { name: 'phoneDB', title: i18n.t('contacts.name') },
          { name: 'status', title: i18n.t('common.status') },
          { name: 'actions', title: i18n.t('common.actions') },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('campaign', {
        'companies': 'getCampaignList',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      isLoading() {
        return this.loading(CAMPAIGN_LIST) === 'loading';
      },
      isError() {
        return this.loading(CAMPAIGN_LIST) === 'error';
      },
      errorMessage() {
        return this.error(CAMPAIGN_LIST);
      },
      isCampaign() {
        return this.$route.name === 'Campaign';
      },
      pageCount() {
        return this.calculatePageCount(`campaign/${ CAMPAIGN_LIST }`, this.perPage);
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
        if (this.isCampaign) {
          this.getList();
        }
      },
    },
    created() {
      this.projectId = this.currentProject;
    },

    mounted() {
      this.getList();
    },
    methods: {
      ...mapActions('campaign', {
        'campaignList': CAMPAIGN_LIST,
        'campaignChangeStatus': CAMPAIGN_CHANGE_STATUS,
      }),
      async getList() {
        if (!this.isCampaign) {
          return;
        }
        await this.campaignList({
          id: this.projectId.id,
          page: this.page,
          perPage: this.perPage,
        });
      },
      changePage(pageNum) {
        this.$set(this, 'page', pageNum);
        this.getList();
      },
      isActiveProject(status) {
        return status === 'Runing';
      },
      getBadgeClass(status) {
        if(status === 'Stopped'){
          return 'danger'
        }
        return this.isActiveProject(status) ? 'success' : 'info';
      },
      getStatusTitleText(status) {
        return this.isActiveProject(status) ? i18n.t('common.stop') : i18n.t('common.start');
      },
      getStatusIcon(status) {
        return this.isActiveProject(status) ? 'fa-stop' : 'fa-play';
      },
      async changeCampaignStatus(campaignId, projectId, status) {
        let type = this.isActiveProject(status) ? 'stop' : 'start';
        let request = await this.campaignChangeStatus({
          id: projectId,
          campaignId,
          type
        });
        if (request) {
          this.$notify({
            group: 'custom-template',
            type: 'success',
            title: i18n.t('common.saved'),
            duration: 2000,
          });
          this.getList();
        }
      },
    },
  }
</script>

<style scoped>

</style>

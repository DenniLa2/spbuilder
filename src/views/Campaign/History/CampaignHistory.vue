<template lang="pug">
  div
    widget
      b-row
        b-col(md="6")
          h4 {{ $t('campaign.history') }}
        b-col.text-right(md="6")
          router-link.btn.btn-primary(:to="{name:'Campaign'}") {{ $t('common.back') }}
      hr

      b-form.form-label-left.mt-4
        b-alert.alert-sm(variant='danger', :show='isError')
          | {{ errorMessage }}
      .contacts-table
        Loader(:show="isLoading", :is-custom="true")
        TableComponent.mt-5.mb-4(
          :columns="columns"
          :values="history"
          type="stripped"
          @page-change="changePage"
          :pagination="true"
          :pageCount="pageCount"
        )
          template(v-slot:startedDateTime="{value}")
            div(v-if="value.startedDateTime")
              | {{ $moment(value.startedDateTime, 'YYYY-MM-DD HH:mm:ss ZZ').format('Do MMMM YYYY, HH:mm:ss') }}
          template(v-slot:endedDateTime="{value}")
            div(v-if="value.endedDateTime")
              | {{ $moment(value.endedDateTime, 'YYYY-MM-DD HH:mm:ss ZZ').format('Do MMMM YYYY, HH:mm:ss') }}
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import i18n from '../../../i18n';
  import TableComponent from '@/components/Table/Table';
  import { CAMPAIGN_HISTORY } from '../../../store/const/campaign';
  import PaginationMixin from '../../../components/mixins/padination';

  export default {
    name: "CampaignHistory",
    mixins: [PaginationMixin],
    components: {
      Widget,
      Loader,
      TableComponent,
    },
    data() {
      return {
        projectId: '',
        campaignId: '',
        page: 1,
        perPage: 20,
        columns: [
          { name: 'startedDateTime', title: i18n.t('campaign.started_date_time') },
          { name: 'endedDateTime', title: i18n.t('campaign.ended_date_time') },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapGetters('campaign', {
        'history': 'getCampaignHistory',
      }),
      ...mapGetters('projects', {
        'currentProject': 'getCurrentProject',
      }),
      isLoading() {
        return this.loading(CAMPAIGN_HISTORY) === 'loading';
      },
      isError() {
        return this.loading(CAMPAIGN_HISTORY) === 'error';
      },
      errorMessage() {
        return this.error(CAMPAIGN_HISTORY);
      },
      pageCount() {
        return this.calculatePageCount(`campaign/${ CAMPAIGN_HISTORY }`, this.perPage);
      },
    },
    watch: {
      'currentProject'(val){
        if(val){
          this.projectId = val;
          this.getList();
        }
      },
    },
    created() {
      this.$set(this, 'projectId', this.currentProject);
      this.$set(this, 'campaignId', this.$route.params.campaign_id);
    },
    mounted() {
      this.getList();
    },
    methods: {
      ...mapActions('campaign', {
        'campaignHistory': CAMPAIGN_HISTORY,
      }),
      ...mapMutations('campaign', {
        'setHistory': CAMPAIGN_HISTORY,
      }),
      async getList() {
        await this.campaignHistory({
          id: this.projectId.id,
          campaignId: this.campaignId,
          page: this.page,
          perPage: this.perPage,
        });
      },
      changePage(pageNum) {
        this.$set(this, 'page', pageNum);
        this.getList();
      },
    },
    beforeDestroy() {
      this.setHistory({ data: [] });
    },
  }
</script>

<style scoped>

</style>

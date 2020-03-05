<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  b-navbar.app-header.d-print-none(:class="[navbarTypeClass, 'header-' + navbarColorScheme]")
    a.navbarBrand.d-md-none
      i.fa.fa-circle.text-primary.mr-n-sm
        i.fa.fa-circle.text-danger
          | sing
          i.fa.fa-circle.text-danger.mr-n-sm
            i.fa.fa-circle.text-primary
    b-nav.ml-auto
      b-nav-item.d-md-down-none
        .current-project-title {{ $t('projects.name_single') }}:
        v-select.current-project#default-select(
          v-model="projectId"
          :options="getProjectOptions"
          item-text='name'
          :placeholder="$t('contacts.choose_project')"
        )
      b-nav-item.d-md-down-none
        span.avatar.rounded-circle.thumb-sm.float-left.mr-2
          img.rounded-circle(:src="avatarImage" alt="...")
        span.small {{ username }}
      b-nav-item-dropdown#v-step-2.settingsDropdown.d-sm-down-none(no-caret="" right="")
        template(slot="button-content")
          i.la.la-cog.px-2
        b-dropdown-item
          i.la.la-user
          | {{ $t('header.account') }}
        b-dropdown-divider
        b-dropdown-item-button(@click="logoutUser")
          i.la.la-sign-out
          | {{ $t('header.log_out') }}
</template>

<script>
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import avatarImage from '@/assets/images/people/a5.jpg';
import ProfileNotifications from '@/components/ProfileNotifications/ProfileNotifications';
import { AUTH_LOGOUT } from '../../store/const/auth';
  import { PROJECT_LIST, SET_PROJECT } from '../../store/const/projects';

export default {
  name: 'Header',
  components: { ProfileNotifications },
  data() {
    return {
      avatarImage,
      projectId: ''
    }
  },
  computed: {
    ...mapState('layout', [
      'sidebarClose',
      'sidebarStatic',
      'navbarType',
      'navbarColorScheme',
    ]),
    ...mapGetters('auth', {
      'username': 'getUsername',
    }),
    ...mapGetters('projects', {
      'projects': 'getProjects',
      'current_project': 'getCurrentProject',
    }),
    navbarTypeClass: function () {
      return "navbar-" + this.navbarType + "-type"
    },
    getProjectOptions() {
      return this.projects.map(item => {
        return { id: item.id, label: item.name };
      });
    },
  },
  mounted() {
    this.projectId = this.current_project;
    this.loadProjects();
  },
  watch:{
    projectId(projectId) {
      if(!projectId){
        this.projectRemove();
        if(this.$route.name !== 'Projects'){
          this.$router.push({ name: 'Projects'});
        }
        return;
      }
      this.projectSave();
    },
  },
  methods: {
    ...mapActions('auth', {
      'logoutUser': AUTH_LOGOUT,
    }),
    ...mapActions('projects', {
      'projectListRequest': PROJECT_LIST,
    }),
    ...mapMutations('projects', {
      'setCurrentProject': SET_PROJECT,
    }),
    loadProjects() {
      this.projectListRequest({
        page: this.page,
        perPage: this.perPage,
      });
    },
    projectSave() {
      localStorage.setItem('projectId', JSON.stringify(this.projectId));
      this.setCurrentProject({ data: this.projectId });
    },
    projectRemove() {
      localStorage.removeItem('projectId');
      this.setCurrentProject({ data: '' });
    },
  },
};
</script>

<style src="./Header.scss" lang="scss"></style>

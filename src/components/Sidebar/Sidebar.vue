<template lang="pug">
  .sidebar-wrapper
    nav(
      :class="{sidebar: true, sidebarStatic}"
    )
      header.logo
        router-link(to="/app/dashboard")
          span.primary-word SP
          |  BUILDER
      ul.nav
        NavLink(
          :activeItem="activeItem"
          header="Dashboard"
          link="/app/dashboard"
          iconName="flaticon-home"
          index="main"
          isHeader
        )
        NavLink(
          :activeItem="activeItem"
          :header="$t('projects.name')"
          link="/app/projects"
          iconName="flaticon-folder-2"
          index="main"
          isHeader
        )
        NavLink(
          :activeItem="activeItem"
          :header="$t('contacts.name')"
          link="/app/contacts-database"
          iconName="flaticon-database-1"
          index="main"
          isHeader
        )
        NavLink(
          :activeItem="activeItem"
          :header="$t('scripts.name')"
          link="/app/scripts"
          iconName="flaticon-file"
          index="main"
          isHeader
        )
        NavLink(
          :activeItem="activeItem"
          :header="$t('dictionary.name')"
          link="/app/dictionary"
          iconName="flaticon-notebook-3"
          index="main"
          isHeader
        )
        NavLink(
          :activeItem="activeItem"
          :header="$t('campaign.name')"
          link="/app/campaign"
          iconName="flaticon-megaphone"
          index="main"
          isHeader
        )

</template>

<script>
import { mapState, mapActions } from 'vuex';
import isScreen from '@/core/screenHelper';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'danger',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'primary',
        },
      ],
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarStatic: state => state.sidebarStatic,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>

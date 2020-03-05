<template lang="pug">
  div(:class="[{root: true, sidebarClose, sidebarStatic}, 'sing-dashboard', 'sidebar-' + sidebarColorName, 'sidebar-' + sidebarType]")
    sidebar
    .wrap
      Header
      div.content
        breadcrumb-history(:exclude="['chat']")
        transition(name='router-animation')
          router-view
        Footer
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';

  const { mapState, mapActions } = createNamespacedHelpers('layout');

  import Sidebar from '@/components/Sidebar/Sidebar';
  import Header from '@/components/Header/Header';
  import Footer from '@/components/Parts/Footer';
  import BreadcrumbHistory from '@/components/BreadcrumbHistory/BreadcrumbHistory';

  export default {
    name: 'Layout',
    components: {
      Sidebar,
      Header,
      Footer,
      BreadcrumbHistory,
    },
    data() {
      return {
        tourStartTimeout: 500,
      }
    },
    methods: {
      ...mapActions([
        'switchSidebar',
        'changeSidebarActive',
        'toggleSidebar',
        'applyTourStep'
      ]),
      handleWindowResize() {
        const width = window.innerWidth;

        if (width <= 768 && this.sidebarStatic) {
          this.toggleSidebar();
          this.changeSidebarActive(null);
        }
      },
    },
    computed: {
      ...mapState([
        "sidebarClose",
        "sidebarStatic",
        "sidebarColorName",
        "sidebarType",
        "helperOpened",
      ]),
    },
    created() {
      this.$store.state.layout.sidebarStatic = true;
      this.handleWindowResize();
      window.addEventListener('resize', this.handleWindowResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
  };
</script>

<style src="./Layout.scss" lang="scss"/>

<template lang="pug">
  div(:class="{ 'theme-helper': true, 'theme-helper-opened': helperOpened }")
    #v-step-3.theme-helper-toggler(@click="toggleHelper(!helperOpened)")
      .theme-helper-spinner.bg-primary.text-white
        i.la.la-cog
        i.la.la-cog.fs-smaller
    section.widget.theme-helper-content
      .widget-body.mt-3
        h3.mb-3 Theme
        .theme-settings
          h5#v-step-4(style="position: static") Navbar Type
          .form-group.row
            .abc-radio
              input#navbar_static(
                type="radio"
                name="navbar-type"
                :value="navbarTypes.STATIC"
                :checked="navbarType === navbarTypes.STATIC"
                @change="updateLayoutComponentType({component: layoutComponents.NAVBAR, type: navbarTypes.STATIC})"
              )
              label(for="navbar_static") Static
            .abc-radio
              input#navbar_floating(
                type="radio"
                name="navbar-type"
                :value="navbarTypes.FLOATING"
                :checked="navbarType === navbarTypes.FLOATING"
                @change="updateLayoutComponentType({component: layoutComponents.NAVBAR, type: navbarTypes.FLOATING})"
              )
              label(for="navbar_floating") Floating
          h5#v-step-5 Navbar Color
          colorpicker(
            :colors="appConfig.themeColors"
            :activecolor="navbarColorName"
            @change="updateLayoutComponentColor({component: layoutComponents.NAVBAR, color: $event})"
          )
          h5#v-step-6 Sidebar Type
          .form-group.row
            .abc-radio
              input#sidebar_transparent(
                type="radio"
                name="sidebar-type"
                :value="sidebarTypes.TRANSPARENT"
                :checked="sidebarType === sidebarTypes.TRANSPARENT"
                @change="updateLayoutComponentType({component: layoutComponents.SIDEBAR, type: sidebarTypes.TRANSPARENT})"
              )
              label(for="sidebar_transparent") Transparent
            .abc-radio
              input#sidebar_solid(
                type="radio"
                name="sidebar-type"
                :value="sidebarTypes.SOLID"
                :checked="sidebarType === sidebarTypes.SOLID"
                @change="updateLayoutComponentType({component: layoutComponents.SIDEBAR, type: sidebarTypes.SOLID})"
              )
              label(for="sidebar_solid") Solid
          h5#v-step-7 Sidebar Color
          colorpicker(
            :colors="appConfig.themeColors"
            :activecolor="sidebarColorName"
            @change="updateLayoutComponentColor({component: layoutComponents.SIDEBAR, color: $event})"
          )
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Colorpicker from '../Colorpicker/Colorpicker';
const { mapState, mapActions } = createNamespacedHelpers('layout');

export default {
    name: 'Helper',
  components: {Colorpicker},
  computed: {
      ...mapState(['navbarColorName', 'sidebarColorName', 'navbarType', 'sidebarType', 'helperOpened'])
  },
  methods: {
      ...mapActions(['changeTheme', 'updateLayoutComponentType', 'updateLayoutComponentColor', 'toggleHelper'])
  }
};
</script>

<style src="./Helper.scss" lang="scss"></style>

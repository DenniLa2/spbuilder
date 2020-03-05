<template lang="pug">
  li(v-if="!childrenLinks && isHeader" :class="{headerLink: true, className}")
    router-link.sidebar-link(:to="link")
      span.icon
        i(:class="fullIconName")
      | {{header}}
      sup.headerLabel(v-if="label" :class="'text-' + labelColor") {{label}}
      b-badge(v-if="badge" variant="primary" pill="") {{badge}}
  li(v-else-if="childrenLinks" :class="{headerLink: true, className}")
    div(@click="() => togglePanelCollapse(link)")
      router-link.d-flex.sidebar-link(:to="link" event="")
        span.icon
          i(:class="fullIconName")
        | {{header}}
        sup.ml-1.headerLabel(v-if="label" :class="'text-' + labelColor") {{label}}
        div(:class="{caretWrapper: true, carretActive: isActive}")
          i.fa.fa-angle-left
    b-collapse(:id="'collapse' + index" :visible="isActive")
      ul.sub-menu
        navlink(
          v-for="link in childrenLinks"
          :activeitem="activeItem"
          :header="link.header"
          :index="link.index"
          :link="link.link"
          :childrenLinks="link.childrenLinks"
          :key="link.link"
        )
  li(v-else="")
    router-link(:to="index !== 'menu' && link")
      | {{header}}
      sup.headerLabel(v-if="label" :class="'text-' + labelColor") {{label}}

</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NavLink',
  props: {
    badge: { type: String, dafault: '' },
    header: { type: String, default: '' },
    iconName: { type: String, default: '' },
    headerLink: { type: String, default: '' },
    link: { type: String, default: '' },
    childrenLinks: { type: Array, default: null },
    className: { type: String, default: '' },
    isHeader: { type: Boolean, default: false },
    deep: { type: Number, default: 0 },
    activeItem: { type: String, default: '' },
    label: { type: String },
    labelColor: { type: String, default: 'warning' },
    index: { type: String },
  },
  data() {
    return {
      headerLinkWasClicked: true,
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive']),
    togglePanelCollapse(link) {
      this.changeSidebarActive(link);
      this.headerLinkWasClicked = !this.headerLinkWasClicked
      || !this.activeItem.includes(this.index);
    },
  },
  computed: {
    fullIconName() {
      return `fi ${this.iconName}`;
    },
    isActive() {
      return (this.activeItem
      && this.activeItem.includes(this.index)
      && this.headerLinkWasClicked);
    },
  },
};
</script>

<style src="./NavLink.scss" lang="scss" scoped />

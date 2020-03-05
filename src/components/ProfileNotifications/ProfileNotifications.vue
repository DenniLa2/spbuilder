<template lang="pug">
  section.notifications.navbar-notifications
    header.cardHeader.card-header
      .text-center.mb-sm
        strong You have 13 notifications
      b-button-group#notification-b-buttons
        b-button(variant="default" @click="changeNotificationsTab(1)") Notifications
        b-button(variant="default" @click="changeNotificationsTab(2)") Messages
        b-button(variant="default" @click="changeNotificationsTab(3)") Progress
    newnotifictionslist(v-if="newNotifications")
    notifictionslist(v-else-if="notificationsTabSelected === 1")
    messages(v-else-if="notificationsTabSelected === 2")
    progress(v-else-if="notificationsTabSelected === 3")
    notifictionslist(v-else="")
      footer.cardFooter.text-sm.card-footer
        span.fs-mini Synced at: 21 Apr 2014 18:36
        b-button(variant="link" @click="loadNotifications" :class="{disabled: isLoad, 'btnNotificationsReload btn-xs float-right py-0': true}")
          span(v-if="isLoad")
            i.la.la-refresh.la-spin  Loading...
          i.la.la-refresh(v-else="")

</template>

<script>
import Vue from 'vue';

import NotifictionsList from './NotificationsDemo/NotificationsList';
import NewNotifictionsList from './NotificationsDemo/NewNotificationsList';
import Messages from './NotificationsDemo/Messages';
import Progress from './NotificationsDemo/Progress';

export default {
  name: 'ProfileNotification',
  components: {
    NotifictionsList, NewNotifictionsList, Messages, Progress,
  },
  data() {
    return {
      notificationsTabSelected: 1,
      newNotifications: null,
      isLoad: false,
    };
  },
  methods: {
    changeNotificationsTab(tab) {
      Vue.set(this, 'notificationsTabSelected', tab);
      Vue.set(this, 'newNotifications', null);
    },
    loadNotifications() {
      Vue.set(this, 'isLoad', true);

      setTimeout(() => {
        Vue.set(this, 'newNotifications', 'new notifications component');
        Vue.set(this, 'isLoad', false);
      }, 1500);
    },
  },
};
</script>

<style src="./ProfileNotifications.scss" lang="scss" />

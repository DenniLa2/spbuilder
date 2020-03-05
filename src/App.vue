<template lang="pug">
  div.main-container
    custom-notifications
    notifications
    router-view
</template>

<script>
import CustomNotifications from '@/components/Notifications/Notifications';
import { mapActions } from 'vuex';
import { HEALTH_CHECK } from './store/const';

export default {
  name: 'App',
  components: {
    CustomNotifications,
  },
  data() {
    return {
      interval: null,
      timeout: 5 * 60 * 1000, // 5 минут
    }
  },
  created() {
    this.$moment.locale('ru');
  },
  mounted(){
    this.initCheckInterval();
  },
  methods: {
    ...mapActions({
      'healthCheck' : HEALTH_CHECK,
    }),
    initCheckInterval(){
      if(this.interval){
        clearInterval(this.interval)
      }
      this.interval = setInterval(()=> {
        this.healthCheck();
      }, this.timeout);
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style src="./assets/styles/theme.scss" lang="scss" />

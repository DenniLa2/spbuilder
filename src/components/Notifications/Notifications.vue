<template lang="pug">
  notifications(group="custom-template" position="top right" :style="{ top: '65px'}")
    template(slot="body" slot-scope="props")
      div.vue-notification(:class="props.item.type")
        div.vue-notification-text
          div {{props.item.title}}
          div(v-html="props.item.text")
        div.vue-notification-close
          a.close(@click="props.close")
            i.fa.fa-fw.fa-close
</template>
<style lang="scss" scoped>
  .vue-notification{
    display: flex;
  }
  .close{
    text-shadow: none;
  }
  .vue-notification-close{
    flex: 0 0 30px;
    display: flex;
    align-items: center;
  }
  .vue-notification-text{
    flex: 1;
    font-size: 14px;
  }
</style>

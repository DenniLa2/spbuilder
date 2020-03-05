<template lang="pug">
  div(v-if='!excluded')
    b-breadcrumb(:items='tree')
</template>
<script>
  import i18n from '../../i18n';

  export default {
    name: 'BreadcrumbHistory',
    props: {
      exclude: { type: Array, default: () => [] },
    },
    computed: {
      excluded() {
        return this.exclude.indexOf(this.$route.path.split('/').pop()) > -1;
      },
      tree() {
        let routes =  this.$route.path.split('/').slice(2);
        let tree = [{
            text: 'SPBUILDER',
            to: { name: 'Widgets' }
          }];
        if(this.$route.name === 'ContactsList'){
          tree.push({
            text: i18n.t('routes.contacts-database'),
            to: { name: 'ContactsDatabase'},
          });
          tree.push({
            text: i18n.t('routes.contacts-list'),
            active: true
          });
        } else if(this.$route.name === 'CampaignHistory') {
          tree.push({
            text: i18n.t('routes.campaign'),
            to: { name: 'Campaign'},
          });
          tree.push({
            text: i18n.t('routes.campaign-history'),
            active: true
          });
        } else {
          routes.map((route, index) => {
            let name = route.split('-')
              .map(word => word[0].toUpperCase() + word.slice(1))
              .join('');
            if(index === routes.length - 1){ // last
              tree.push({
                text: i18n.t(`routes.${route}`),
                active: true
              });
            } else {
              tree.push({
                text: i18n.t(`routes.${route}`),
                to: { name: name }
              });
            }
          });
        }
        return tree;
      },
    },
  }
</script>

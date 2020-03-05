<template lang="pug">
  .error-page
    b-container
      .errorContainer.mx-auto
        h1.errorCode 404
        p.errorInfo
          | {{ $t('error.page_not_found') }}

      Footer(active_class="pageFooter")
</template>

<script>
import Footer from '@/components/Parts/Footer';
export default {
  name: 'NotFound',
  components: {
    Footer,
  },
};
</script>

<style src="./Error.scss" lang="scss" scoped />

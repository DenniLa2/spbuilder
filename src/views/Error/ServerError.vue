<template lang="pug">
  .error-page
    b-container
      .errorContainer.mx-auto
        h1.errorCode 500
        p.errorInfo
          | {{ $t('error.service_not_available') }}
        p.errorInfo
          | {{ $t('common.send_email_to_us', { email: 'support@spbuilder.ru' }) }}
      Footer(active_class="pageFooter")
</template>

<script>
import Footer from '@/components/Parts/Footer';
export default {
  name: 'ServerError',
  components: {
    Footer,
  },
};
</script>

<style src="./Error.scss" lang="scss" scoped />

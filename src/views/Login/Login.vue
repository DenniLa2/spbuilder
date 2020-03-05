<template lang="pug">
  .auth-page
    b-container
      h5.auth-logo
        i.fa.fa-circle.text-primary
        | {{ $t('common.project_name') }}
        i.fa.fa-circle.text-danger
      widget.widget-auth.mx-auto(:title="$t('auth.authorization')", customheader='')
        p.widget-auth-info
          | {{ $t('auth.use_email_and_password') }}
        ValidationObserver(v-slot="{ passes }")
          form.mt(@submit.prevent='passes(login)')
            b-alert.alert-sm(variant='danger', :show='isError')
              | {{ errorMessage }}
            .form-group
              ValidationProvider(name="Email" rules="required|email" v-slot="{ errors }")
                input.form-control.no-border(
                  v-model='email',
                  type='email',
                  name='email',
                  :placeholder="$t('common.email')"
                )
                .validation-error {{ errors[0] }}
            .form-group
              ValidationProvider(name="Пароль" rules="required|min:5" v-slot="{ errors }")
                input.form-control.no-border(
                  v-model='password',
                  type='password',
                  name='password',
                  :placeholder="$t('common.password')"
                )
                .validation-error {{ errors[0] }}
            b-button.auth-btn.mb-3(
              type='submit',
              size='sm',
              variant='info'
              :disabled="isLoading"
            ) {{ isLoading ? $t('common.loading') : $t('auth.login') }}
            p.widget-auth-info
              | {{ $t('auth.dont_have_an_account') }}
            router-link.d-block.text-center(:to="{ name: 'Register' }")
              | {{ $t('auth.create_an_account') }}
      Footer(active_class="auth-footer")

</template>

<script>
  import Widget from '@/components/Widget/Widget';
  import Footer from '@/components/Parts/Footer';
  import { mapActions, mapGetters } from 'vuex';
  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import { required, email, min } from 'vee-validate/dist/rules';

  extend('email', email);
  extend('required', required);
  extend('min', min);

  import { AUTH_LOGIN } from '../../store/const/auth';

  export default {
    name: 'LoginPage',
    components: {
      Widget,
      Footer,
      ValidationProvider,
      ValidationObserver,
    },
    data() {
      return {
        email: '',
        password: '',
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      isLoading() {
        return this.loading(AUTH_LOGIN) === 'loading';
      },
      isError() {
        return this.loading(AUTH_LOGIN) === 'error';
      },
      errorMessage(){
        return this.error(AUTH_LOGIN);
      }
    },
    methods: {
      ...mapActions('auth', {
        loginRequest: AUTH_LOGIN,
      }),
      async login() {
        await this.loginRequest({
          email: this.email,
          password: this.password,
        });
      },
    },
  };
</script>

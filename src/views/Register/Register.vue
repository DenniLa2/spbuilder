<template lang="pug">
  .auth-page
    b-container
      h5.auth-logo
        i.fa.fa-circle.text-gray
        | {{ $t('common.project_name') }}
        i.fa.fa-circle.text-warning
      widget.widget-auth.mx-auto(:title="$t('auth.registration')", customheader='')
        p.widget-auth-info
          | {{ $t('auth.please_fill_all_fields_below') }}
        ValidationObserver(v-slot="{ passes }")
          form.mt(@submit.prevent="passes(register)")
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
              ValidationProvider(name="Пароль" rules="required|min:5|password:@Подтверждение пароля" v-slot="{ errors }")
                input.form-control.no-border(
                  v-model="password",
                  type='password',
                  name='password',
                  :placeholder="$t('common.password')"
                )
                .validation-error {{ errors[0] }}
            .form-group
              ValidationProvider(name="Подтверждение пароля" rules="required|min:5" v-slot="{ errors }")
                input.form-control.no-border(
                  v-model='password_confirm',
                  type='password',
                  name='password_confirm',
                  :placeholder="$t('common.password_confirm')"
                )
                .validation-error {{ errors[0] }}
            b-button.auth-btn.mb-3(
              type='submit',
              variant='inverse',
              size='sm'
              :disabled="isLoading"
            )
             | {{ isLoading ? $t('common.loading') : $t('auth.create_an_account') }}
        p.widget-auth-info
          | {{ $t('auth.already_have_the_account') }}
        router-link.d-block.text-center(to='login') {{ $t('auth.authorization') }}
    Footer(active_class="auth-footer")

</template>
<script>
  import Widget from '../../components/Widget/Widget';
  import Footer from '@/components/Parts/Footer';
  import { mapActions, mapGetters } from 'vuex';
  import i18n from '../../i18n'

  import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
  import { required, email, min } from 'vee-validate/dist/rules';
  import { REGISTER_REQUEST } from '../../store/const/register';

  extend('email', email);
  extend('required', required);
  extend('min', min);

  extend('password', {
    params: ['target'],
    validate(value, { target }) {
      return value === target;
    },
    message: i18n.t('error.password_confirmation_doesnt_match'),
  });

  export default {
    name: 'RegisterPage',
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
        password_confirm: '',
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      isLoading() {
        return this.loading(REGISTER_REQUEST) === 'loading';
      },
      isError() {
        return this.loading(REGISTER_REQUEST) === 'error';
      },
      errorMessage(){
        return this.error(REGISTER_REQUEST);
      }
    },
    methods: {
      ...mapActions('register', {
        registerUser : REGISTER_REQUEST,
      }),
      async register() {
        await this.registerUser({
          email: this.email,
          password: this.password,
        });
      },
    },
  }
</script>

<template lang="pug">
  Widget(v-if="contacts.headers")
    Loader(:show="isImportLoading", :is-custom="true")
    b-alert.alert-sm.mt-3(variant='danger', :show='isImportError')
      | {{ errorImportMessage }}
    h4.mb-4  Заполните данные для иморта
    ValidationObserver(v-slot="{ passes }")
      b-form-group(
        horizontal=""
        label="Имя"
        label-for="name"
        label-class="text-md-right"
        :label-cols="1"
        breakpoint="md"
      )
        ValidationProvider(name="Имя" rules="required" v-slot="{ errors }")
          b-form-input#name(type="text" v-model="name")
          .validation-error {{ errors[0] }}
      b-form-group(
        horizontal=""
        label="Описание"
        label-for="description"
        label-class="text-md-right"
        :label-cols="1"
        breakpoint="md"
      )
        b-form-input#description(type="text" v-model="desc")
      b-row
        b-col(md="1")
        b-col(md="5")
          b-form-group.abc-checkbox.abc-checkbox-primary.checkboxes
            input#checkbox-primary(type="checkbox" v-model="deleteDuplicate")
            label(for="checkbox-primary") {{`${$t('contacts.remove_duplicates')}`}}
        b-col(md="5")
          b-form-group.abc-checkbox.abc-checkbox-primary.checkboxes
            input#checkbox-primary2(type="checkbox" v-model="mixContacts")
            label(for="checkbox-primary2") {{`${$t('contacts.shuffle_contacts')}`}}
        b-col(md="1")
      b-row
        b-col(md="1")
        b-col(md="11")
          hr
      b-row
        b-col(md="1")
        b-col(md="6")
          h5.mt-1 {{ $t('contacts.match_the_contact') }}
        b-col.text-right(md="5")
          b-button.mr-sm(variant="primary" @click="$bvModal.show('select-modal')") {{`${$t('contacts.add_field_for_matching')}`}}
      b-row
        b-col(md="1")
        b-col(md="11")
          TableComponent.mt-4.mb-4(
            :columns="getColumns"
            :values="getRecords"
            type="stripped"
          )
            template(v-slot:column="{ value }")
              .select-table-col-header {{ value }}
                v-select#default-select(
                  v-model="fields[value]"
                  :options="getOriginalHeader"
                  :placeholder="$t('contacts.do_not_import')"
                )
      b-row
        b-col(md="1")
        b-col(md="11")
          button.btn.btn-success(@click.prevent="passes(sendContacts)") {{ `${$t('common.save')}` }}
    ValidationObserver(v-slot="{ passes }")
      b-modal#select-modal(title="Modal title" body-class="bg-white")
        .row.display-flex(v-for="(field, key) in newFields")
          .col
            ValidationProvider(:name="'Name' + key" rules="required" v-slot="{ errors }")
              input.form-control(v-model="newFields[key]")
              .validation-error {{ errors[0] }}
          .col-1.delete-icon(@click="deleteField(key)" v-if="key !== 0") x
        .btn.btn-default.mt-4(@click="addNewField") Добавить поле
        template(v-slot:modal-footer)
          .btn.btn-success(@click.prevent="passes(addField)") {{`${$t('common.save')}`}}
          .btn.btn-primary(@click="$bvModal.hide('select-modal')") {{`${$t('common.close')}`}}
        template(v-slot:modal-header)
          h4 {{`${$t('contacts.add_field_for_matching')}`}}
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate';
  import Widget from '@/components/Widget/Widget';
  import Loader from '@/components/Loader/Loader';
  import { CONTACTS_IMPORT_PHONES, CONTACTS_UPLOAD_PHONES } from '../../../store/const/contacts';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import i18n from '../../../i18n';
  import TableComponent from '@/components/Table/Table';

  export default {
    name: "ContactsHandling",
    components: {
      TableComponent,
      ValidationObserver,
      ValidationProvider,
      Widget,
      Loader,
    },
    props: {
      project: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        name: '',
        desc: '',
        originalHeaders: ['phone'],
        deleteDuplicate: false,
        mixContacts: false,
        tableError: null,
        fields: {},
        newFields: [''],
      }
    },
    computed: {
      ...mapGetters('contacts', {
        'contacts': 'getContacts',
      }),
      ...mapGetters([
        'loading',
        'error',
      ]),
      getOriginalHeader() {
        return this.originalHeaders.filter(value => !Object.values(this.fields).includes(value))
      },
      getColumns() {
        if (this.contacts.headers) {
          return this.contacts.headers.map(header => {
            return { name: header, width: 15 };
          })
        }
        return {};

      },
      getRecords() {
        if (this.contacts.records) {
          const records = this.contacts.records.map(record => {
            let value = {};
            let headers = this.contacts.headers;
            for (let i = 0; i < headers.length; i++) {
              value[headers[i]] = record[i];
            }
            return value;
          });
          return records;
        }
        return [];
      },
      errorImportMessage() {
        return this.error(CONTACTS_IMPORT_PHONES);
      },
      isImportLoading() {
        return this.loading(CONTACTS_IMPORT_PHONES) === 'loading';
      },
      isImportError() {
        return this.loading(CONTACTS_IMPORT_PHONES) === 'error';
      },
    },
    beforeDestroy() {
      this.setContacts({ data: [] });
    },
    watch: {
      contacts: 'setDefaultValue',
    },
    methods: {
      ...mapMutations('contacts', {
        'setContacts': CONTACTS_UPLOAD_PHONES,
      }),
      ...mapActions('contacts', {
        'importContacts': CONTACTS_IMPORT_PHONES,
      }),
      addField() {
        this.newFields.forEach(newField => this.originalHeaders.push(newField));
        this.addSuccessNotification(i18n.t('common.added'));
        this.$bvModal.hide('select-modal');
        this.newFields = [''];
      },
      addNewField() {
        this.newFields.push('');
      },
      deleteField(fieldKey) {
        this.newFields = this.newFields.filter((field, key) => key !== fieldKey);
      },
      setDefaultValue(val) {
        if (val.headers) {
          val.headers.forEach(header => {
            this.$set(this.fields, header, i18n.t());
          });
        }
      },
      async sendContacts() {
        this.tableError = null;
        let fields = {};
        for (let key in this.fields) {
          if (this.fields[key] !== '') {
            fields[key] = this.fields[key];
          }
        }
        if (Object.keys(fields).length === 0) {
          this.tableError = 'Выберите поля для сопоставления';
          return;
        }

        const data = {
          name: this.name,
          desc: this.desc,
          fields: fields,
          file: this.contacts.file,
          options: {
            unique: this.deleteDuplicate,
            shuffle: this.mixContacts,
          },
        };
        let result = await this.importContacts({
          id: this.project,
          data: data,
        });
        if (result) {
          this.addSuccessNotification(i18n.t('common.saved'));
          this.fields = {};
          this.setContacts({ data: [] });
          this.$router.push({ name: 'ContactsDatabase' })
        }
      },
      addSuccessNotification(message) {
        this.$notify({
          group: 'custom-template',
          type: 'success',
          title: message,
          duration: 2000,
        })
      },
    },
  }
</script>

<style scoped>
  .delete-icon {
    color: #FD5F05;
    font-size: 31px;
    line-height: 31px;
    padding: 0;
    cursor: pointer;
  }
</style>

import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'pagination',
    ]),
  },
  methods: {
    calculatePageCount(method, perPage){
      let pagination = this.pagination(method);
      if (pagination && pagination.total) {
        return Math.ceil(pagination.total / perPage)
      }
      return 1;
    },
  }
}

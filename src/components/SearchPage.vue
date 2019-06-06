<template>
  <popup
    v-model="localVisible"
    position="right"
    :class="$style.container">
    <div :class="$style.container">
      <form action="/">
        <search
          ref="searchBar"
          show-action
          v-model="value"
          :placeholder="searchPlaceholder"
          @cancel="localVisible = false"
          @search="onSearch"/>
      </form>
    </div>
  </popup>
</template>

<script>
import {
  Popup,
  Search,
} from 'vant';

export default {
  components: {
    Popup,
    Search,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: '请输入搜索内容',
    },
  },

  data: () => ({
    value: '',
  }),

  computed: {
    localVisible: {
      get () {
        return this.visible;
      },
      set (value) {
        this.$emit('update:visible', value);
      },
    },
  },

  watch: {
    localVisible (newVal, oldVal) {
      if (newVal) {
        // console.log(document.getElementsByClassName('van-field__control')[0], 123);
        this.$nextTick(_ => {
          this.$refs.searchBar.$el.getElementsByClassName('van-field__control')[0].focus();
        });
      }
    },
  },

  methods: {
    onSearch () {
      this.$emit('search', this.value);
      this.localVisible = false;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    width: 100%;
    height: 100%;
    background-color: $border-color;
  }
</style>

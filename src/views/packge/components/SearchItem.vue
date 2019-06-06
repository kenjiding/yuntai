<template>
  <div :class="$style.itemWrap">
    <van-search
      :placeholder="inputTitle"
      v-model="searchValue"
      :class="$style.search"
      :show-action="false"/>
  </div>
</template>

<script>
import { Search } from 'vant';

export default {
  name: '',

  data () {
    return {
    };
  },

  props: {
    inputTitle: {
      type: String,
      default: '请输入查询',
    },
    searchValue: String,

  },

  components: {
    [Search.name]: Search,
  },

  methods: {},
  created () {},
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.itemWrap {
  width: 100%;
  height: 64px;
  padding: 0 13px;
  box-sizing: border-box;
  background-color: $color-white !important;
}

.search {
  height: 100%;
  width: 100%;
  padding: 0;
  background-color: $color-white !important;

  .van-field {
    padding: 6px 8px;
    background-color: $border-color;
    border-radius: $border-radius;
  }
}

</style>

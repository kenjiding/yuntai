<template>
  <ych-page :class="$style.wrap">
    <page-header
      title="活动介绍"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
    />
    <cell
      cell-type="text"
      v-model="introduction"
      :is-need-title="false"
      :placeholder="placeholder"
      subtitle="支持换行输入"/>
    <van-button
      size="large"
      type="primary"
      :class="$style.button"
      @click="save">保存</van-button>
  </ych-page>
</template>

<script>
import Cell from '../Cell';
import PageHeader from '../PageHeader';
import { Toast } from 'vant';

export default {
  name: 'Introduction',

  components: {
    Cell,
    PageHeader,
  },

  props: {
    introductionShow: Boolean,
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    placeholderDefualt: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    introductionShow: {
      handler (val) {
        this.introduction = val ? this.value : '';
      },
      immediate: true,
    },
  },

  data () {
    return {
      introduction: '',
    };
  },
  created () {},

  methods: {
    save () {
      if (this.introduction) {
        this.$emit('close', this.introduction);
        return;
      }
      if (this.placeholderDefualt) {
        this.$emit('close', this.placeholder);
      } else {
        Toast('请填写活动介绍');
      }
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.button {
  position: fixed;
  bottom: 0;
}

</style>

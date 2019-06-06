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
      :placeholder="`规则：从2018年的11月34号14点开始至2018年的11月34号17点之间抓取娃娃最多的玩家将获得iPhone x、MacBook Pro、ipad等奖励；\n 奖品：\n 第一名：MacBook Pro \n 第二名：iPhone x \n 第三名：ipad \n `"
      subtitle="支持换行输入"/>
    <van-button
      size="large"
      type="primary"
      :class="$style.button"
      @click="save">保存</van-button>
  </ych-page>
</template>

<script>
import Cell from '@/components/Cell';
import PageHeader from '@/components/PageHeader';
import { Toast } from 'vant';

export default {
  name: '',

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
      if (!this.introduction) {
        Toast('请填写活动介绍');
        return;
      }
      this.$emit('close', this.introduction);
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

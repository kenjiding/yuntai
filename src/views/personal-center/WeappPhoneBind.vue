<template>
  <ych-page>
    <van-switch-cell v-model="expandValue" title="小程序获取用户手机号" />
    <p :class="$style.text">说明：</p>
    <p :class="$style.text">开启后，用户进入小程序，需要授权手机号才可以正常使用</p>

    <bottomButton
      text="保存"
      @confirm="save"/>
  </ych-page>
</template>

<script>
import { Toast, SwitchCell } from 'vant';
import bottomButton from '../philately/components/BottomButton';
import Person from '@/api/Person';

export default {
  name: '',

  components: {
    [SwitchCell.name]: SwitchCell,
    bottomButton,
  },

  data () {
    return {
      expandValue: false,
    };
  },
  created () {
    this.expandValue = this.$route.query.isBind;
  },

  methods: {
    save () {
      Toast.loading({
        mask: true,
        message: '保存中...',
        duration: 0,
      });
      Person.postPhoneBind({PhoneBind: this.expandValue}).then(() => {
        Toast.clear();
        this.$router.back();
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.text {
  color: $font-color-secondary;
  font-size: 14px;
  padding: 0 20px;
  line-height: 20px;

  &:first-of-type {
    margin-top: 20px;
  }
}
</style>

<template>
  <ych-dialog
    v-model="localValue"
    title="投币测试"
    cancel-button-text="异常"
    confirm-button-text="正常并保存"
    @confirm="$emit('confirm')">

    <div :class="$style['dialog-content']">
      <p>脉冲间隔：{{ data.PulseInterval || 0 }} ms</p>
      <p>脉冲宽度：{{ data.PulseWidth || 0 }} ms</p>
      <p>每局脉冲数：10 ms</p>

      <div :class="$style.tips">
        请检查设备上分是否异常！<br/>
        若上分异常请选择其它方案<br/>
        或自定义参数后再测试<br/>
      </div>
    </div>
  </ych-dialog>
</template>

<script type="text/javascript">
export default {
  name: 'app',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    testCoin () {
      if (!this.data.PulseNum || !this.data.AdvancedSettings) {
        return 10;
      } else {
        return this.data.PulseNum;
      }
    },
    localValue: {
      get () {
        return this.value;
      },

      set (val) {
        this.$emit('input', val);
      },
    },
  },

  data () {
    return {
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" module>
@import '@/styles/them.scss';

.dialog-content {
  padding: 20px 26px;
  line-height: 1.5;
  color: $font-color-regular;
}

.tips {
  color: $font-color-placeholder;
  margin-top: 10px;
}

</style>

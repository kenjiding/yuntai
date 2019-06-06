<template>
  <ych-dialog
    v-model="localValue"
    :title="title"
    confirm-button-text="保存"
    :before-close="handleConfirm">

    <div :class="$style['edit-dialog-content']">
      <p>参考值范围：10 ～ 1000</p>
      <p>建议每次设置浮动值：100</p>

      <van-field
        v-model="localInputValue"
        :placeholder="placeholder"
        type="number"
        :error-message="errorMsg">
        <span slot="button">ms</span>
      </van-field>
    </div>
  </ych-dialog>
</template>

<script type="text/javascript">
export default {
  name: 'PulseDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    inputValue: Number,

    title: String,

    placeholder: String,

    // 当修改脉冲间隔时，该值就是脉宽，反之；
    otherValue: Number,
  },

  data () {
    return {
      localInputValue: null,

      errorMsg: null,
    };
  },

  computed: {
    localValue: {
      get () {
        return this.value;
      },

      set (val) {
        this.$emit('input', val);
      },
    },
  },

  watch: {
    inputValue: {
      immediate: true,
      handler (val) {
        this.localInputValue = val ? this.inputValue : null;
      },
    },
  },

  methods: {
    handleConfirm (action, done) {
      if (action === 'cancel') {
        this.localInputValue = '';
        this.errorMsg = null;
        return done();
      }
      if (this.localInputValue <= 0) {
        return done(false);
      }
      if (isNaN(this.localInputValue) || ~this.localInputValue.toString().indexOf('.')) {
        this.errorMsg = '请输入10 - 1000整数';
        return done(false);
      }
      if (Number(this.otherValue) === Number(this.localInputValue)) {
        this.errorMsg = '脉冲间隔 与 脉冲宽度 不能相同';
        return done(false);
      }

      this.errorMsg = null;

      this.$emit('confirm', this.localInputValue);
      this.localInputValue = '';

      return done();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" module>
  @import "@/styles/them.scss";

  .edit-dialog-content {
    font-size: $font-size-primary;
    color: $font-color-regular;
    text-align: center;
    padding: 16px 0;

    .input {
      margin-top: 8px;
    }
  }
</style>

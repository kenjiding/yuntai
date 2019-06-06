<template>
  <van-popup
    v-model="localVisible"
    :class="$style['add-payment__popup']"
    @click-overlay="handlePopupClose"
    >
    <p>新增支付方式</p>
    <p>(新增支付方式只做记账使用)</p>
    <van-field
      ref="inputName"
      v-model="paymentName"
      :error-message="errorInput"
      placeholder="请输入支付方式名称"/>
    <van-button
      type="primary"
      :loading="saving"
      :disabled="!canSave"
      @click="saveClick">保存</van-button>
  </van-popup>
</template>

<script type="text/javascript">
import { Popup } from 'vant';
import Person from '@/api/Person';

export default {
  name: 'AddPayment',

  components: {
    VanPopup: Popup,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      paymentName: '',
      saving: false,
    };
  },

  computed: {
    localVisible: {
      get () {
        return this.visible;
      },

      set (val) {
        this.$emit('update:visible', val);
      },
    },
    canSave () {
      return this.paymentName.length > 0 && this.paymentName.length <= 6;
    },
    errorInput () {
      return this.paymentName.length > 6 ? '支付方式名称不能大于6个字' : '';
    },
  },

  methods: {
    saveClick () {
      this.saving = true;
      Person.addPayment({
        Name: this.paymentName,
        Type: 'Other',
        IsEnable: true,
      }).then(() => {
        this.saving = false;
        this.paymentName = '';
        this.$emit('update:visible', false);
        this.$emit('saved');
      }, () => {
        this.saving = false;
      });
    },

    handlePopupClose () {
      this.paymentName = '';
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.add-payment {
  &__popup {
    width: 70vw;
    padding-top: 25px;
    text-align: center;
    font-size: $font-size-primary;
    border-radius: $border-radius-small;

    > p:nth-child(2) {
      margin-top: 10px;
      font-size: $font-size-special;
      color: $font-color-placeholder;
    }

    .van-field {
      width: calc(70vw - 50px);
      margin: 25px;
      padding: 0;

      &__control {
        padding: 5px;
        border: 1px solid $color-primary;
        border-radius: $border-radius-small;
      }
    }

    .van-button {
      width: 100%;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
</style>

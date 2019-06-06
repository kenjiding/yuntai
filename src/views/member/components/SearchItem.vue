<template>
  <div :class="$style['headers-search']">
    <form action="/">
      <van-search
        v-model="value"
        :placeholder="placeholder"
        :class="$style['search']"
        :style="{backgroundColor: backGround}"
        show-action
        @search="onSearch"
        @clear="clearKey"
        @input="inputChange"
      >
        <van-icon
          v-if="type === 'qrcode'"
          name="qr"
          slot="action"
          :style="{color: fontColor}"
          @click="scanQrCode"/>

          <span
            v-else-if="type === 'text'"
            :style="{color: '#077AFF'}"
            slot="action">搜索</span>
      </van-search>
    </form>
  </div>
</template>

<script>
import { Search, Toast } from 'vant';
import wx from 'weixin-js-sdk';

export default {
  name: '',

  props: {
    fontColor: {
      type: String,
      default: '#FFF',
    },
    type: {
      type: String,
      default: 'qrcode',
    },
    placeholder: {
      type: String,
      default: '请搜索昵称/手机号/会员号',
    },
    backGround: {
      type: String,
      default: 'rgba(0, 0, 0, 0)',
    },
  },

  data () {
    return {
      value: '',
    };
  },

  components: {
    [Search.name]: Search,
  },

  methods: {
    inputChange (val) {
      this.$emit('input', val);
    },
    clearKey () {
      this.$emit('search', this.value);
    },
    scanQrCode () {
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            // 当needResult 为 1 时，扫码返回的结果
            // let result = res.resultStr.indexOf(',') > -1 ? res.resultStr.split(',')[1] : res.resultStr;
            _this.value = res.resultStr;
            _this.$emit('search', _this.value);
          },
          fail: function (res) {
            Toast.fail('摄像头调取失败，请手动输入');
          },
        });
      });
    },
    onSearch () {
      this.$emit('search', this.value);
    },
  },
  created () {},
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.headers-search {
  width: 100%;

  .van-search {
    padding: 10px 0 10px 15px;
  }

  input {
    text-align: left !important;
  }

  .van-cell {
    padding: 5px 0 5px 10px;
    border-radius: $border-radius-bigger;

    .van-icon-search {
      margin-top: -2px;
    }
  }

  .van-icon-qr {
    font-size: $font-size-secondary;
    color: $color-white;
    vertical-align: sub;
  }
}

</style>

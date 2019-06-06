<template>
  <ych-page>
    <page-header
      slot="header"
      title="二维码注册"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>

    <div :class="$style['content']">
      <div :class="$style['code-container']">
        <div :class="$style['code']" @click="onCodeClick">
          <img :src="registerCode" :class="$style['code-image']"/>
        </div>
        <div :class="$style['code-desc']">将二维码对准设备扫码口即可开始注册</div>
      </div>
      <van-button type="primary" :class="$style['bottom-btn']" size="large" @click="scan">扫码注册</van-button>
    </div>

    <ych-dialog
      :value="dialogValue"
      @cancel=" dialogValue = false"
      @confirm="dialogConfirm"
      title="输入设备编码">
      <div :class="$style['dialog-content']">
        <p>请填写设备编码</p>
        <van-field
          v-model="inputGoodsGroupName"
          type="tel" />
      </div>
    </ych-dialog>
  </ych-page>
</template>

<script>
import Device from '@/api/Device';
import PageHeader from '@/components/PageHeader';
import wx from 'weixin-js-sdk';

import { Toast } from 'vant';

export default {
  components: {
    PageHeader,
  },

  data: () => ({
    registerCode: 'http://p6ngidppe.bkt.clouddn.com/code.png',
    isReconnecting: false,
    connection: null,
    timeToConnect: null,
    dialogValue: false,
    inputGoodsGroupName: '',
  }),

  created () {
    console.log(this.$route.query.tenantInfoObj);
    this.getCode();
    this.connectSocket();
  },

  unmounted () {
    console.log('组件卸载，停止socket');
    this.connection && this.connection.stop();
  },

  methods: {
    dialogConfirm () {
      if (!this.inputGoodsGroupName) {
        Toast('请输入设备编码');
      } else {
        this.goToDeviceRrgister(this.inputGoodsGroupName);
        this.dialogValue = false;
        this.inputGoodsGroupName = '';
      }
    },

    scan () {
      console.log('扫码注册');
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var number = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            _this.goToDeviceRrgister(number);
          },
          fail: function (res) {
            _this.dialogValue = true;
          },
        });
      });
    },

    goToDeviceRrgister (number) {
      this.$router.push({
        path: '/device-register',
        query: {
          number,
          ...this.$route.query,
        },
      });
    },

    connectSocket () {
      let _this = this;
      let url = '/LongConnection_DeviceBindHub';
      if (process.env.NODE_ENV === 'development') {
        url = 'http://yuntaidev02.youcaihua.net' + url;
      }
      let connection = new window.signalR.HubConnectionBuilder().withUrl(url, {
        accessTokenFactory: () => this.$store.state.userInfo.Token,
      }).build();

      connection.on('DeviceBind', function (message) {
        console.log('Socket消息', message);
        if (message && message.number) {
          _this.goToDeviceRrgister(message.number);
        }
      });

      connection.start().then(res => {
        console.log('连接成功开启', res);
        if (this.timeToConnect) {
          clearTimeout(this.timeToConnect);
        }
      }).catch(function (err) {
        return console.error(err.toString());
      });

      connection.onclose((err) => {
        console.error('连接被关闭', err);
        this.reconnectSocket();
      });

      this.connection = connection;
    },

    reconnectSocket () {
      this.isReconnecting = true;
      this.connectSocket();
      this.timeToConnect = setTimeout(() => this.reconnectSocket(), 5000);
    },

    getCode () {
      // 加载展示二维码
      Device.registerCode({
        RandomCode: Date.now() + '',
      }).then(res => {
        this.registerCode = res.Src;
      });
    },

    onCodeClick () {
      // 当展示的二维码点击
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .content {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .code-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 100px;

      .code {
        width: 180px;
        height: 180px;
        margin-bottom: 24px;
      }

      .code-image {
        width: 100%;
        height: 100%;
      }

      .code-desc {
        font-size: $font-size-primary;
      }
    }

    .bottom-btn {
      width: 100%;
    }
  }

  .dialog-content {
    width: 75%;
    margin: 0 auto 30px;

    p {
      padding: 20px 0 15px;
      color: $font-color-regular;
    }

    .van-cell {
      background-color: $color-bg-regular;
      border: solid 1px $border-color;
      border-radius: $border-radius-small;

      input {
        background-color: $color-bg-regular;
      }
    }
  }
</style>

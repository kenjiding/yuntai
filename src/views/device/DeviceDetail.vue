<template>
  <ych-page>
    <page-header
      left-arrow
      title="机台管理"
      @click-left="$router.go(-1)"/>

    <div :class="$style['device-info']">
      <div>
        <img
          src="../../assets/img/machine.png"
          :class="$style.icon"/>
      </div>

      <div :class="$style['title-wrap']">
        <div :class="$style['title-wrap--first']">
          <span :class="$style['device-name']">{{ deviceInfo.Name }}</span>
          <signal-tag
            :class="$style['status-tag']"
            :value="deviceInfo.Signal"
            :state="deviceInfo.Status"/>
        </div>
        <p >{{$route.query.deviceNumber}}</p>
      </div>
    </div>

    <van-cell-group
      :class="$style['setting-group']">

      <van-cell
        is-link
        title="通讯方式"
        @click="communicationHandle">
        <van-icon
          name="communication"
          slot="icon"
          :class="$style.icon"/>

        {{deviceInfo.Communication}}
      </van-cell>

      <van-cell
        is-link
        title="单价"
        @click="handlePriceClicked">

        <van-icon
          name="danjia"
          slot="icon"
          :class="$style.icon"/>

        <!-- <span :class="$style.value"> -->
        {{deviceInfo.Price + '币/次'}}
        <!-- </span> -->
      </van-cell>

      <van-cell
        is-link
        title="设备编号"
        @click="editDeviceNum">

        <van-icon
          name="bianhao"
          slot="icon"
          :class="$style.icon"/>
        {{ deviceInfo.Sn }}
      </van-cell>

      <van-cell
        is-link
        title="设备类型">

        <van-icon
          name="device-type"
          slot="icon"
          :class="$style.icon"/>
        {{ deviceTypeStr[deviceInfo.DeviceType] }}
      </van-cell>

      <van-cell
        is-link
        title="礼品设置"
        @click="handleGiftClicked">

        <van-icon
          name="gift"
          slot="icon"
          :class="$style.icon"/>
        {{deviceInfo.GiftInfo.Name}}/库存{{deviceInfo.GiftInfo.Stock | number}}
      </van-cell>

      <van-cell
        is-link
        title="消费二维码"
        @click="showQrcodeDialog = true">

        <van-icon
          name="erweima"
          slot="icon"
          :class="$style.icon"/>
      </van-cell>

      <cell
        cell-type="switch"
        :class="$style['notice-cell']"
        v-model="deviceInfo.IsNotice"
        icon="tuisong"
        @change="handleNoticeChange"
        title="设备离线通知"
        :loading="switchLoading">

        <van-icon
          name="tuisong"
          slot="icon"
          style="margin-right: 8px;"/>
      </cell>

    </van-cell-group>

    <van-cell-group
      :class="$style['setting-group']"
      v-if="!deviceInfo.IsCommunicationJump">
      <!-- <van-cell
        is-link
        v-if="rateSettingEnable"
        title="概率设置"
        @click="$router.push({ path: '/device-rate-setting', query: { deviceId: $route.query.deviceId } })">
        <van-icon
          name="rate-setting"
          slot="icon"
          :class="$style.icon"/>
      </van-cell> -->
      <van-cell
        is-link
        title="游戏机设置"
        @click="$router.push({ path: '/game-device-setting', query: { deviceId: $route.query.deviceId } })">
        <van-icon
          name="game-setting"
          slot="icon"
          :class="$style.icon"/>
      </van-cell>
    </van-cell-group>

    <div
      :class="$style['unbind-btn']"
      @click="showUnbindDialog = true">
      解绑设备
    </div>

    <!-- 修改设备编号的Dialog -->
    <ych-dialog
      v-model="showDeviceDialog"
      title="修改设备编号"
      confirm-button-text="保存"
      :before-close="handleEditDevice">

      <div>
        <van-field
          v-model="DeviceNumber"
          placeholder="请输入设备编号"
          @blur="limitInput">
        </van-field>
      </div>
    </ych-dialog>
    <!-- 修改单价的Dialog -->

    <!-- 修改单价的Dialog -->
    <ych-dialog
      v-model="showEditPriceDialog"
      title="填写单价"
      confirm-button-text="保存"
      :before-close="handlePriceUpdated">

      <div>
        <van-field
          v-model="currentPrice"
          placeholder="请输入当前单价"
          type="number"
          @blur="clickScrollHandler"
          :max="999"
          :error-message="priceErrorMessage">
          <span slot="button">币/次</span>
        </van-field>
      </div>
    </ych-dialog>
    <!-- 修改单价的Dialog -->

    <!-- 展示二维码的Dialog -->
    <ych-dialog
      v-model="showQrcodeDialog"
      :showConfirmButton="false"
      :showCancelButton="false"
      :close-on-click-overlay="true">
      <div :class="$style['qrcode-container']">
        <div :class="$style.header">
          <img
            src="../../assets/img/machine.png"
            :class="$style.icon"/>

          <span :class="$style.title">
            {{deviceInfo.Name}}
          </span>
        </div>
        <div :class="$style.content">
          <van-loading
            v-show="qrcodeLoading"
            :class="$style['img-loading']"
            type="spinner"
            color="white"
          />
          <img
            @load="imgLoaded"
            @click="downloadQRCode"
            :src="deviceInfo.QrcodeUrl"
            :class="$style.img"/>
        </div>
      </div>
    </ych-dialog>
    <!-- 展示二维码的Dialog -->

    <!-- 解绑设备的Dialog -->
    <ych-dialog
      theme="danger"
      title="解绑设备"
      v-model="showUnbindDialog"
      :before-close="beforeUnbindDevice"
      message="即将执行设备解绑操作, 该操作将导致当前经营数据丢失">
    </ych-dialog>
    <!-- 解绑设备的Dialog -->

    <!-- 概率设置 -->
    <ych-dialog
      title="概率设置"
      v-model="showProbabilityDialog"
      :before-close="handleProbability">
      <van-field
        v-model="probabilityTemp"
        type="number"
        :precition="2"
        value-type="precentage"
        placeholder="请输入大于0 - 100"
        :error="errorShow"
        :error-message="errorShow ? '请输入0 - 100的数字' : ''">
        <span slot="button">%</span>
      </van-field>
    </ych-dialog>

  </ych-page>
</template>

<script>
/**
 * 设备详细信息界面
 */
import Device from '@/api/Device';
import PageHeader from '@/components/PageHeader';
import Cell from '@/components/Cell';
import {
  Toast,
} from 'vant';
import SignalTag from './components/SignalTag.vue';
import { setTimeout } from 'timers';

export default {
  name: 'DeviceDetail',

  components: {
    PageHeader,
    Cell,
    SignalTag,
  },

  data: () => ({
    deviceInfo: {
      Price: '',
      IsNotice: true,
      GiftInfo: {},
      Status: null,
      // AgreementType: '',
      // DeviceType: 'Catcher',
    },
    showUnbindDialog: false,
    showQrcodeDialog: false,
    showEditPriceDialog: false,
    showProbabilityDialog: false,
    currentPrice: 0,
    priceErrorMessage: '',

    showDeviceDialog: false,
    DeviceNumber: '',

    probabilityTemp: 0,

    switchLoading: false,

    qrcodeLoading: true,

    deviceTypeStr: {
      'Catcher': '娃娃机',
      'PurePlay': '纯玩机',
      'Lottery': '彩票机',
      'Egg': '扭蛋机',
      'Lipstick': '口红机',
      'FortuneBag': '福袋机',
    },
  }),

  watch: {
    showEditPriceDialog (val) {
      if (val) return;
      document.getElementsByClassName('van-modal')[0].removeEventListener('touchstart', this.clickScrollHandler);
    },
    showDeviceDialog (val) {
      if (val) return;
      document.getElementsByClassName('van-modal')[0].removeEventListener('touchstart', this.clickScrollHandler);
    },
  },

  created () {
    this.asyncGetDeviceInfo();
  },

  mounted () {
    console.log(document.getElementsByTagName('input'), '123');
    console.log(document.getElementsByClassName('ych-dialog__popup'), '456', this.$name);
  },

  computed: {
    deviceStatus () {
      const statusMap = {
        Online: '在线',
        Offline: '离线',
      };
      return statusMap[this.deviceInfo.Status] || null;
    },

    tagStatusOfDevice () {
      const statusMap = {
        Online: 'success',
        Offline: 'danger',
      };
      return statusMap[this.deviceInfo.Status] || null;
    },

    errorShow () {
      if (this.probabilityTemp !== '') {
        return this.probabilityTemp <= 0 || this.probabilityTemp > 1;
      }
    },

    judgeProbabilityTempValue () {
      if (this.probabilityTemp !== '') {
        return this.probabilityTemp <= 0 || this.probabilityTemp > 100;
      }
    },

    rateSettingEnable () {
      return this.deviceInfo.AgreementType === 'Agreement' && this.deviceInfo.DeviceType === 'Catcher';
    },
  },

  methods: {
    clickScrollHandler () {
      document.body.scrollTop = document.body.scrollHeight;
    },

    handlePriceClicked () {
      this.showEditPriceDialog = true;
      this.priceErrorMessage = '';
      this.currentPrice = this.deviceInfo.Price;
      document.getElementsByClassName('van-modal')[0].addEventListener('touchstart', this.clickScrollHandler);
    },

    editDeviceNum () {
      this.showDeviceDialog = true;
      this.DeviceNumber = this.deviceInfo.Sn;
      document.getElementsByClassName('van-modal')[0].addEventListener('touchstart', this.clickScrollHandler);
    },
    limitInput () {
      this.clickScrollHandler();
      if (this.DeviceNumber.length >= 4) {
        this.DeviceNumber = this.DeviceNumber.slice(0, 4);
      }
    },
    handleEditDevice (action, done) {
      if (action === 'cancel') {
        return done();
      }

      //删除空格
      this.DeviceNumber = this.DeviceNumber.trim();

      if (this.DeviceNumber === '' || this.DeviceNumber.indexOf(' ') > -1) {
        Toast('编号不能存在空格，或为空');
        return done(false);
      }

      var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (patrn.exec(this.DeviceNumber)) {
        Toast('编号只能是英文或数字');
        return done(false);
      }

      Device
        .setDeviceSn({
          ID: this.deviceInfo.ID,
          Sn: this.DeviceNumber,
        }).then(() => {
          this.DeviceNumber = '';
          this.asyncGetDeviceInfo();
          return done();
        }, () => {
          return done(false);
        });
    },
    communicationHandle () {
      if (this.deviceInfo.IsCommunicationJump) {
        this.$router.push({
          path: '/device-setting',
          query: {
            deviceId: this.deviceInfo.ID,
            price: this.deviceInfo.Price,
          },
        });
      }
    },
    asyncGetDeviceInfo () {
      this.$toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Device.deviceDetail({
        Number: this.$route.query.deviceNumber,
      }).then(res => {
        this.hideLoadingToast();
        // res.GiftInfo = res.GiftInfo || {};
        this.deviceInfo = Object.assign(
          {},
          this.deviceInfo,
          res,
          { GiftInfo: res.GiftInfo || {} }
        );
      });
    },

    imgLoaded () {
      this.qrcodeLoading = false;
    },

    downloadQRCode () {
      window.location.href = this.deviceInfo.QrcodeUrl;
      // window.open(this.deviceInfo.QrcodeUrl);
    },

    handleNoticeChange (val) {
      this.switchLoading = true;

      const thenFn = () => setTimeout(() => (this.switchLoading = false), 1000);

      Device
        .offlineNotification({
          ID: this.deviceInfo.ID,
          IsNotice: val,
        })
        .then(
          () => {
            thenFn();
            this.$toast.success(`离线通知${val ? '开启' : '关闭'}`);
          },
          () => {
            thenFn();
            this.deviceInfo.IsNotice = !val;
          }
        )
        .catch(() => {
          thenFn();
          this.deviceInfo.IsNotice = !val;
        });
    },

    showProbabilityDialogFn () {
      this.$router.push({
        path: '/device-probability-setting',
        query: {
          ID: this.deviceInfo.ID,
          Probability: this.deviceInfo.Probability,
        },
      });
      // this.showProbabilityDialog = true;
      // this.probabilityTemp = this.deviceInfo.Probability || '';
    },

    handleProbability (action, done) {
      if (action === 'cancel') return done();

      if (this.judgeProbabilityTempValue) return done(false);

      const tempValue = this.probabilityTemp;

      // 修改值与当前值是否一致，若一致不提交请求
      if (tempValue !== this.deviceInfo.Probability) {
        Device
          .setProbability({
            ID: this.deviceInfo.ID,
            Probability: tempValue,
          })
          .then(() => {
            done();
            this.deviceInfo.Probability = tempValue;
          }, () => done(false))
          .catch(() => done(false));
      } else {
        done();
      }
    },

    hideLoadingToast () {
      this.$toast.clear();
    },

    handlePriceUpdated (action, done) {
      if (action === 'cancel') {
        return done();
      }

      let reg = /^\d+$/;
      if (this.currentPrice && reg.test(this.currentPrice) && this.currentPrice < 1000) {
        this.priceErrorMessage = '';
        // this.savePrice(this.currentPrice)
        //   .then(() => done(), () => done(false));
        if (this.currentPrice === this.deviceInfo.Price) return done();

        Device.deviceEdit({
          ID: this.deviceInfo.ID,
          Price: this.currentPrice,
        }).then(res => {
          this.deviceInfo.Price = this.currentPrice;
          // this.hideLoadingToast();
          this.$toast.success('修改成功');
          return done();
        }, () => {
          return done(false);
        });
      } else {
        this.priceErrorMessage = '单价格式输入不正确';
        return done(false);
      }
    },

    savePrice (price) {
      if (price === this.deviceInfo.Price) return true;

      // this.$toast.loading({
      //   message: '加载中...',
      //   duration: 0,
      // });

      return Device.deviceEdit({
        ID: this.deviceInfo.ID,
        Price: price,
      }).then(res => {
        this.deviceInfo.Price = price;
        // this.hideLoadingToast();
        this.$toast.success('修改成功');
        return true;
      });
    },

    beforeUnbindDevice (action, done) {
      if (action === 'cancel') return done();

      Device.deviceUnbind({
        ID: this.deviceInfo.ID,
      }).then(res => {
        this.unbindedDevice();
        done();
      }, () => done());
    },

    unbindedDevice () {
      this.$toast.success('解绑成功');
      setTimeout(() => this.$router.go(-1), 1000);
    },

    handleSettingClicked () {
      this.$router.push({
        path: '/device-setting',
        query: {
          deviceId: this.deviceInfo.ID,
        },
      });
    },

    handleGiftClicked () {
      this.$router.push({
        path: '/gift-setting',
        query: {
          DeviceId: this.deviceInfo.ID,
        },
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .device-info {
    width: 100%;
    height: 60px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    display: flex;
    padding: 0 16px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    background-color: $color-white;

    .icon {
      width: 20px;
      height: auto;
    }

    .title-wrap {
      flex: 1;
      margin: 0 8px;
      font-size: $font-size-secondary;
      color: $color-primary;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        height: 100%;
        float: left;

        &:first-child {
          flex: 1;
        }

        &:last-of-type {
          font-size: $font-size-special;
          color: $font-color-placeholder;
        }
      }
    }
  }

  .title-wrap--first {
    display: flex;
    align-items: center;
  }

  .notice-cell {
    background-color: $color-white;
  }

  .device-name {
    line-height: 1.2;
  }

  .status-tag {
    text-align: center;
    margin-left: 10px;
  }

  .setting-group {
    margin-top: 10px;
    background-color: transparent;

    .van-cell {
      background-color: $color-white;

      .van-icon-bianhao {
        font-size: $font-size-primary;
      }
    }

    .icon {
      font-size: $font-size-secondary;
      margin-right: 8px;
    }

    .van-cell__value {
      @include ellipsis(1);

      // line-height: 1;
      font-size: $font-size-special;
      color: $font-color-secondary;
    }
  }

  .unbind-btn {
    position: relative;
    // bottom: 15px;
    width: 90%;
    height: 40px;
    margin-top: 20px;
    border: 1px solid $color-danger;
    color: $color-danger;
    line-height: 40px;
    text-align: center;
    left: 50%;
    border-radius: $border-radius;
    transition: all .3s;
    transform: translateX(-50%);

    &:active {
      background-color: $color-danger;
      color: $color-white;
    }
  }

  .qrcode-container {
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 16px;

      .icon {
        width: 25px;
        height: auto;
        margin-right: 8px;
        pointer-events: none;
      }

      .title {
        font-size: $font-size-regular;
      }
    }

    .content {
      text-align: center;
      margin: 16px 0;
      position: relative;

      .img-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .van-loading__spinner {
          color: $color-black !important;
        }
      }

      .img {
        width: 220px;
        height: 220px;
      }
    }
  }
</style>

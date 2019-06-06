<template>
  <ych-page>
    <page-header
      left-arrow
      title="礼品设置"
      @click-left="$router.go(-1)"/>

    <div :class="$style['device-info']">
      <div>
        <img
          v-if="giftSetting.DeviceState == 'Online'"
          src="../../assets/img/machine.png"
          :class="$style.icon"/>
        <img
          v-if="giftSetting.DeviceState == 'Offline'"
          src="../../assets/img/machine-disabled.png"
          :class="$style.icon"/>
      </div>

      <div :class="$style['title-wrap']">
        <div :class="$style['title-wrap--first']">
          <span :class="$style['device-name']">{{giftSetting.DeviceName}}</span>
          <van-tag
            :class="$style['status-tag']"
            :type="tagStatusOfDevice">
            {{ deviceStatus }}
          </van-tag>
        </div>
        <p >{{giftSetting.DeviceNumber}}</p>
      </div>
    </div>

    <van-cell-group
      :class="$style['setting-group']">

      <van-cell
        is-link
        title="礼品"
        @click="giftSelectVisiable = true">

        <van-icon
          name="bear"
          slot="icon"
          :class="$style.icon"/>

        {{giftSetting.GiftName}}
      </van-cell>

      <van-cell title="库存">

        <van-icon
          name="danjia"
          slot="icon"
          :class="$style.icon"/>

        <van-field
          :class="$style.stock"
          v-model="giftSetting.Stock"
          placeholder="请输入当前库存"
          type="number"
          @input="stockLimit"
          @focus="clearStock(giftSetting.Stock)"
          :error-message="StockErrorMessage"
          :precision="0">
        </van-field>
      </van-cell>

      <cell
        cell-type="switch"
        :class="$style['notice-cell']"
        v-model="giftSetting.IsEarlyWarning"
        icon="tuisong"
        title="库存预警">

        <van-icon
          name="tuisong"
          slot="icon"/>
      </cell>

      <van-cell v-show="giftSetting.IsEarlyWarning">
        <van-field
          :class="$style['warning-line']"
          v-model="giftSetting.EarlyWarningLine"
          placeholder="请输入预警数量"
          type="number"
          @input="numberLimit"
          @focus="clearEarlyWarningLine(giftSetting.EarlyWarningLine)">
        </van-field>
      </van-cell>

    </van-cell-group>

    <div
      :class="$style.button">
      <p
        :class="$style['button-text']"
        @click="clearGift">清空</p>
      <p
        :class="$style['button-text']"
        @click="saveSetting">保存</p>
    </div>

    <gift-select
      :class="$style['gift-select']"
      :gift-show="giftSelectVisiable"
      @close="giftSelectVisiable = false"
      @cell-click="handleGiftSelectClicked">
    </gift-select>

  </ych-page>
</template>

<script>
/**
 * 礼品设置详细信息界面
 */
import { Toast } from 'vant';
import GiftManagementApi from '@/api/GiftManagement';
import PageHeader from '@/components/PageHeader';
import Cell from '@/components/Cell';
import GiftSelect from './components/GiftSelect';

export default {
  name: 'GiftSetting',

  components: {
    PageHeader,
    Cell,
    GiftSelect,
  },

  data: () => ({
    giftSetting: {},
    showEditStockDialog: false,
    currentStock: 0,
    StockErrorMessage: '',
    warningLineVisiable: false,
    giftSelectVisiable: false,
  }),

  created () {
    this.asyncGetgiftSetting();
  },

  computed: {
    deviceStatus () {
      const statusMap = {
        Online: '在线',
        Offline: '离线',
      };
      return statusMap[this.giftSetting.DeviceState] || null;
    },

    tagStatusOfDevice () {
      const statusMap = {
        Online: 'success',
        Offline: 'danger',
      };

      return statusMap[this.giftSetting.DeviceState] || null;
    },

    deviceId () {
      return this.$route.query.DeviceId;
    },
  },

  methods: {
    clearGift () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要清空礼品信息？',
        theme: 'danger',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            // this.giftSetting.GiftName = '';
            // this.giftSetting.Stock = '';
            // this.giftSetting.EarlyWarningLine = '';
            // this.giftSetting.IsEarlyWarning = false;
            GiftManagementApi.clearDiftData({DeviceID: this.$route.query.DeviceId}).then((res) => {
              done();
              this.$router.back();
            }, (res) => {
              done();
              if (res.ResponseStatus.ErrorCode === '202100031') {
                Toast.fail({
                  duration: 3000,
                  forbidClick: true,
                  message: res.ResponseStatus.Message,
                });
              }
            });
          } else {
            done();
          }
        },
      });
    },
    asyncGetgiftSetting () {
      this.$toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      GiftManagementApi.getGiftSettingByDevice({
        DeviceID: this.$route.query.DeviceId,
      }).then(res => {
        this.hideLoadingToast();
        this.giftSetting = res;
      });
    },

    numberLimit (val) {
      if (val.length > 9) {
        this.giftSetting.EarlyWarningLine = val.slice(0, 9);
      }
    },

    clearEarlyWarningLine (val) {
      if (Number(val) === 0) {
        this.giftSetting.EarlyWarningLine = '';
      }
    },

    stockLimit (val) {
      if (val.length > 9) {
        this.giftSetting.Stock = val.slice(0, 9);
      }
    },

    clearStock (val) {
      if (Number(val) === 0) {
        this.giftSetting.Stock = '';
      }
    },

    hideLoadingToast () {
      this.$toast.clear();
    },

    handleGiftSelectClicked (goodsId, goodsName) {
      this.giftSelectVisiable = false;
      this.giftSetting.GiftID = goodsId;
      this.giftSetting.GiftName = goodsName;
    },

    saveSetting () {
      var formatVal = /^\+?[1-9][0-9]*$/;
      if (!formatVal.test(this.giftSetting.Stock)) {
        this.$toast('库存数量应为大于0的整数');
        return;
      }

      if (this.giftSetting.IsEarlyWarning && !formatVal.test(this.giftSetting.EarlyWarningLine)) {
        this.$toast('预警数量应为大于0的整数');
        return;
      }

      if (this.giftSetting.IsEarlyWarning) {
        if (this.giftSetting.EarlyWarningLine >= this.giftSetting.Stock) {
          this.$toast('库存预警不能大于或等于库存');
          return;
        }
      }

      if (!this.giftSetting.GiftName) {
        this.$toast('请选择礼品');
        return;
      }

      this.$toast.loading({
        message: '加载中...',
        duration: 0,
      });

      GiftManagementApi.editGiftSetting({
        DeviceID: this.deviceId,
        GiftID: this.giftSetting.GiftID,
        Stock: this.giftSetting.Stock,
        IsEarlyWarning: this.giftSetting.IsEarlyWarning,
        EarlyWarningLine: this.giftSetting.EarlyWarningLine || 0,
      }).then(res => {
        this.hideLoadingToast();
        this.$toast.success('保存成功');
        setTimeout(_ => this.$router.go(-1), 1000);
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
    background-color: transparent;
  }

  .stock {
    height: 20px;
    padding: 0;

    .van-field__control {
      height: 100%;
      text-align: right;
      padding: 0 10px;
      background-color: transparent;
      color: $font-color-secondary;
    }
  }

  .warning-line {
    height: 36px;
    border-radius: $border-radius;
    border: 1px solid $border-color;
    padding: 0;

    .van-field__control {
      height: 100%;
      text-align: right;
      padding: 0 10px;
      color: $font-color-secondary;
    }
  }

  .device-name {
    line-height: 1.2;
  }

  .status-tag {
    width: 40px;
    text-align: center;
    margin-left: 10px;
    border-radius: $border-radius;
  }

  .setting-group {
    margin-top: 10px;
    background-color: transparent;
    min-height: 260px;

    .van-cell {
      background-color: transparent;
    }

    .icon {
      font-size: $font-size-regular;
      margin-right: 8px;
    }

    .van-cell__value {
      @include ellipsis(1);

      // line-height: 1;
      font-size: $font-size-special;
      color: $font-color-secondary;
    }
  }

  .gift-select {
    height: 80%;
  }

  .button {
    position: absolute;
    bottom: 15px;
    width: 90%;
    height: 40px;
    color: $color-white;
    line-height: 40px;
    text-align: center;
    left: 50%;
    transition: all .3s;
    transform: translateX(-50%);
    z-index: 2000;

    &-text {
      width: 50%;
      height: 100%;
      float: left;
      background-color: $color-primary;

      &:nth-child(1) {
        /* border-radius: $border-radius; */
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
        background-color: $color-danger;
      }

      &:nth-child(2) {
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }
    }

    &:active {
      background-color: $color-white;
      color: $color-primary;
    }
  }
</style>

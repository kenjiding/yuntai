<template>
  <ych-page :class="$style.page">
    <page-header
      slot="header"
      left-arrow
      title="设备注册"
      @click-left="$router.go(-1)"
      @click-right="beforeDeviceBind">

      <van-icon
        name="save"
        v-if="!deviceInfo.IsBind"
        slot="right"
        :class="$style['header-right']"/>
    </page-header>

    <div
      v-if="deviceInfo.IsBind"
      :class="$style['device-binded']">

      <div :class="$style['device-binded-header']">
        <img
          src="../../assets/img/machine.png"
          :class="$style['device-binded-img']"/>
        <p
          :class="$style['device-binded-desc']">
          设备已经注册
        </p>
        <p
          :class="$style['device-binded-desc']">
          请联系机台所有人进行操作
        </p>
      </div>

      <van-cell-group :class="$style['device-binded-content']">
        <van-cell
          title="设备唯一码">
          <van-icon
            name="ma"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.Number}}
        </van-cell>
        <van-cell
          title="绑定品牌">
          <van-icon
            name="pinpai"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.BindCustomerName}}
        </van-cell>

        <van-cell
          title="投放门店">
          <van-icon
            name="weizhi"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.TenantInfo && deviceInfo.TenantInfo.Name}}
        </van-cell>
      </van-cell-group>
    </div>

    <div
      v-else
      :class="$style['device-unbinded']">
      <van-cell-group :class="$style['device-unbinded-content']">
        <van-cell
          title="设备唯一码">
          <van-icon
            name="ma"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.Number}}
        </van-cell>

        <van-cell
          title="通讯方式">
          <van-icon
            name="danjia"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.Communication}}
        </van-cell>

        <van-cell
          title="设备类型">
          <van-icon
            name="leixing"
            slot="icon"
            :class="$style.icon"/>

          娃娃机台
        </van-cell>

        <van-cell
          is-link
          title="单价"
          @click="handlePriceClicked">
          <van-icon
            name="danjia"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.Price}}币/次
        </van-cell>

        <van-cell
          is-link
          title="门店"
          :class="$style['tenantStyle']"
          @click="showTenantSelect = true">
          <van-icon
            name="weizhi"
            slot="icon"
            :class="$style.icon"/>

          {{deviceInfo.TenantInfo ? deviceInfo.TenantInfo.Name : '请选择门店'}}
        </van-cell>
      </van-cell-group>

      <div :class="$style['device-unbinded--device-sn']">
        <div :class="$style['device-header']">
          <van-icon name="bianhao"/>
          设备编号
        </div>

        <div :class="$style['device-sn-list']">
          <div
            :class="[
              $style['device-sn-list--item'],
              {
                [$style['device-sn-list--item_active']]: deviceSnInfo.IsUse,
                [$style['device-sn-list--item_selected']]: currentSnActice === index
              }
            ]"
            v-for="(deviceSnInfo, index) in deviceSnList"
            :key="index"
            @click="handleSnClicked(deviceSnInfo, index)">
            {{deviceSnInfo.Sn}}
          </div>

          <div
            :class="$style['add-device-sn']"
            @click="addDeviceNum">
            <van-icon
              v-if="!addDeviceSn"
              name="tianjia"/>
            <input
              autofocus
              v-else
              v-model="currentInputSn"
              ref="focusShow"
              :class="$style['add-device-sn--input']"
              :style="{imeMode: 'disabled',}"
              @blur="handleAddDeviceSn"
              @input="limitInput"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改单价的Dialog -->
    <ych-dialog
      v-model="showEditPriceDialog"
      title="填写单价"
      confirm-button-text="保存"
      :beforeClose="handlePriceUpdated"
      @confirm="savePrice">

      <div
        :class="$style['dialog-content']">
        <van-field
          v-model="currentPrice"
          placeholder="请输入当前单价"
          type="number"
          :error-message="priceErrorMessage">
          <span slot="button">币/次</span>
        </van-field>
      </div>
    </ych-dialog>
    <!-- 修改单价的Dialog -->

    <popup
      v-model="showTenantSelect"
      position="right"
      :class="$style['tenant-select-popup']">
      <tenant-select
        @close="showTenantSelect = false"
        @save="handleTenantSelected"
        :default-tenant="deviceInfo.TenantInfo.ID"/>
    </popup>
  </ych-page>
</template>

<script>
import Device from '@/api/Device';
import Tenant from '@/api/Tenant';
import Person from '@/api/Person';
import PageHeader from '@/components/PageHeader';
import TenantSelect from './components/TenantSelect';
import {
  Popup,
  Toast,
} from 'vant';

export default {
  components: {
    PageHeader,
    Popup,
    TenantSelect,
  },

  data: () => ({
    deviceInfo: {
      TenantInfo: {},
    },
    currentPrice: '',
    showEditPriceDialog: false,
    priceErrorMessage: '',
    showTenantSelect: false,
    deviceSnList: [],
    currentSnActice: -1,
    addDeviceSn: false,
    currentInputSn: '',
    aroundRequest: true,
  }),

  created () {
    this.asyncGetDeviceInfo();
  },

  methods: {

    limitInput () {
      if (this.currentInputSn.length >= 4) {
        this.currentInputSn = this.currentInputSn.slice(0, 4);
      }
    },
    addDeviceNum () {
      this.addDeviceSn = true;
      this.$nextTick(() => {
        this.$refs.focusShow.focus();
        // this.$refs.focusShow.select();
      });
    },
    asyncGetDeviceInfo () {
      Toast.loading({
        duration: 0,
        message: '加载中...',
        mask: true,
      });
      Device.deviceDetail({
        Number: this.$route.query.number,
      }).then(res => {
        this.deviceInfo = res;
        this.deviceInfo.Price = res.Price ? res.Price : '';
        this.deviceInfo.TenantInfo = res.TenantInfo || {};
        Toast.clear();

        this.whichStep(res);
      }, (res) => {
        if (res.ResponseStatus.ErrorCode === '2024500014') {
          Toast.fail('设备编号不存在');
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        }
      });
    },

    whichStep (res) {
      //如果扫码的操作是从某门店发起，则需要把绑定门店默认为该门店
      if (this.$route.query.Name) {
        if (!res.IsBind) {
          this.deviceInfo.TenantInfo.ID = this.$route.query.ID;
          this.deviceInfo.TenantInfo.Name = this.$route.query.Name;
          this.deviceInfo.TenantInfo.Address = this.$route.query.Address;
          this.asyncGetDeviceSnList();
        }
      } else {
        //该设备已经绑定门店
        if (res.IsBind) {
          this.asyncGetDeviceSnList();
        } else {
          // 该设备还没绑定门店，则回填默认门店
          this.getDefalutTenant();
        }
      }
    },

    getDefalutTenant () {
      Person.tenantOperation().then((res) => {
        let tenantItem = res.DataList.find((item) => {
          return item.isDefault;
        });
        this.deviceInfo.TenantInfo.ID = tenantItem.ID;
        this.deviceInfo.TenantInfo.Name = tenantItem.tenantName;
        this.deviceInfo.TenantInfo.Address = tenantItem.address;
        this.asyncGetDeviceSnList();
      });
    },

    asyncGetDeviceSnList () {
      this.currentSnActice = -1;
      Tenant.tenantDeviceSnList({
        ID: this.deviceInfo.TenantInfo.ID,
      }).then(res => {
        this.deviceSnList = res.Data;
        Toast.clear();
      });
    },

    handleSnClicked (snInfo, index) {
      if (!snInfo.IsUse) {
        this.currentSnActice = index;
      }
    },

    handlePriceClicked () {
      this.currentPrice = this.deviceInfo.Price;
      this.showEditPriceDialog = true;
    },

    handlePriceUpdated (action, done) {
      if (action === 'cancel') return done();

      let reg = /^\d+$/;
      if (this.currentPrice && reg.test(this.currentPrice)) {
        this.priceErrorMessage = '';
        done();
      } else {
        this.priceErrorMessage = '单价格式输入不正确';
        done(false);
      }
    },

    savePrice () {
      this.deviceInfo.Price = parseInt(this.currentPrice);
    },

    handleTenantSelected (tenantInfo) {
      this.deviceInfo.TenantInfo = tenantInfo;
      this.showTenantSelect = false;
      this.asyncGetDeviceSnList();
    },

    handleAddDeviceSn () {
      //删除空格
      this.currentInputSn = this.currentInputSn.trim();

      if (this.currentInputSn.indexOf(' ') > -1) {
        Toast('编号不能存在空格');
        return;
      }

      var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (patrn.exec(this.currentInputSn)) {
        Toast('编号只能是英文或数字');
        return;
      }

      this.addDeviceSn = false;
      if (!this.currentInputSn) {
        return;
      }
      // let currentInputSn = parseInt(this.currentInputSn);
      let currentInputSn = this.currentInputSn;

      let index = this.deviceSnList.findIndex(item => item.Sn === currentInputSn);
      if (index > -1) {
        if (this.deviceSnList[index].IsUse) {
          Toast('编号已经被使用');
        } else {
          this.currentSnActice = index;
        }
      } else {
        this.deviceSnList.push({
          Sn: currentInputSn,
          IsUse: false,
        });
        this.currentSnActice = this.deviceSnList.length - 1;
      }
    },

    beforeDeviceBind () {
      if (!this.deviceInfo.TenantInfo.ID) {
        Toast('请选择门店');
        return;
      }

      if (!this.deviceInfo.Price) {
        Toast('请输入设备单价');
        return;
      }

      if (this.currentSnActice === -1) {
        Toast('请选择设备编号');
        return;
      }

      this.bindDevice();
    },

    bindDevice () {
      Device.deviceBind({
        Number: this.deviceInfo.Number,
        Price: this.deviceInfo.Price,
        TenantID: this.deviceInfo.TenantInfo.ID,
        Sn: this.deviceSnList[this.currentSnActice].Sn,
      }).then(res => {
        Toast.loading({
          duration: 0,
          forbidClick: true,
          loadingType: 'spinner',
          message: '设备绑定中...',
          mask: true,
        });
        this.checkBindDevice(this.deviceInfo.Number);
      });
    },
    checkBindDevice (number) {
      if (!this.aroundRequest) return;
      Device.isDeviceBind({number}).then((res) => {
        if (res.Success) {
          Toast.clear();
          this.$dialog.alert({
            message: '如需编辑，请前往设备管理界面进行操作。',
            title: '设备绑定成功！',
          }).then(() => {
            this.$router.go(-1);
          });
        } else {
          setTimeout(_ => {
            this.checkBindDevice(number);
          }, 800);
        }
      });
    },
  },
  beforeRouteLeave (to, from, next) {
    this.aroundRequest = false;
    next();
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  // .page {
  //   background-color: $color-white;
  // }

  .tenantStyle {
    .van-cell__title {
      flex: none;
      width: 10%;
    }

    .van-cell__value {
      flex: none;
      width: 78%;

      @include ellipsis(1);
    }
  }

  .header-right {
    font-size: $font-size-secondary;
    margin-top: -3px;
  }

  .device-binded {
    background-color: $color-white;

    &-img {
      margin-top: 50px;
      width: 75px;
      height: auto;
    }

    &-desc {
      font-size: $font-size-primary;
      margin-top: 16px;
      color: $font-color-regular;
    }

    &-header {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    &-content {
      .icon {
        font-size: $font-size-primary;
        margin-right: 8px;
        margin-top: 3px;
      }
    }
  }

  .device-unbinded {
    &-content {
      .icon {
        font-size: $font-size-primary;
        margin-right: 8px;
        margin-top: 3px;
      }

      .van-cell {
        background-color: $color-bg-primary;
      }
    }

    &--device-sn {
      padding: 0 16px;
      box-sizing: border-box;
      margin-top: 16px;
      color: $font-color-regular;

      .device-sn-list {
        margin-top: 16px;
        display: flex;
        flex-flow: row wrap;

        &--item {
          width: 60px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin: 5px 3px;
          border-radius: $border-radius-small;
          border: 1px solid $color-primary;
          color: $color-primary;

          &_active {
            border: 1px solid $border-color;
            background-color: $border-color;
            color: $font-color-regular;
          }

          &_selected {
            background-color: $color-primary;
            color: $color-white;
          }
        }

        .add-device-sn {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid $color-primary;
          border-radius: $border-radius-small;
          margin-top: 5px;
          color: $color-primary;

          &--input {
            text-align: center;
            height: 40px;
            line-height: 40px;
            padding: 0;
            border: none;
            color: $color-primary;
            background-color: $color-bg-primary;
          }
        }
      }
    }
  }

  .dialog-content {
    padding: 16px 0;
  }

  .tenant-select-popup {
    width: 100%;
    height: 100%;
  }
</style>

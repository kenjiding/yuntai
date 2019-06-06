<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      title="设备管理"
      @click-left="$router.go(-1)"/>

    <div :class="$style['tenant-info']">
      <van-icon name="mendian" :class="$style.icon"/>

      <div :class="$style['title-wrap']">
        <p :class="$style.title">{{tenantInfo.Name}}</p>
        <p :class="$style.subtitle">{{tenantInfo.Address}}</p>
      </div>
      <!-- <div :class="$style.value">
        离线{{tenantInfo.OfflineDeviceCount}}台
      </div> -->
    </div>

    <tabs type="card" :class="$style.tabs">
      <tab
        v-for="(item, index) in stateGroup"
        :key="index"
        :title="item.name + item.num">

        <device-list
          :class="$style['device-list']"
          :type="item.val"
          :device-list="tenantInfo.DeviceList"
          @click="handleDeviceInfoClicked"/>
      </tab>
    </tabs>

    <div :class="$style['add-device-btn']" @click="scanQrCode">
      <van-icon name="tianjia"/>
    </div>
    <ych-dialog
      :value="dialogValue"
      @cancel=" dialogValue =false"
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
/**
 * 门店详情界面
 */
import Tenant from '@/api/Tenant';
import PageHeader from '@/components/PageHeader';
import DeviceList from './components/DeviceList';
import {
  Toast,
  Tabs,
  Tab,
} from 'vant';

export default {
  components: {
    PageHeader,
    Tabs,
    Tab,
    DeviceList,
  },

  data: () => ({
    tenantInfo: {},
    // stateGroup: {
    //   all: '全部',
    //   on: '在线',
    //   off: '离线',
    // },
    dialogValue: false,
    inputGoodsGroupName: '',
    tenantInfoObj: {},
  }),

  created () {
    this.asyncGetTenantInfo();
    // this.beforeConfigWechat();
  },
  computed: {
    stateGroup () {
      let online = 0;
      let offline = 0;
      if (this.tenantInfo.DeviceList) {
        this.tenantInfo.DeviceList.forEach((item) => {
          if (item.State === 'Online') {
            online++;
          } else if (item.State === 'Offline') {
            offline++;
          }
        });
        return [
          {
            name: '全部',
            val: 'all',
            num: this.tenantInfo.DeviceList.length,
          }, {
            name: '在线',
            val: 'on',
            num: online,
          }, {
            name: '离线',
            val: 'off',
            num: offline,
          },
        ];
      }
    },
  },

  methods: {
    dialogConfirm () {
      this.deviceRegister(this.inputGoodsGroupName);
    },
    asyncGetTenantInfo () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
      });

      Tenant.tenantDetail({
        ID: this.$route.query.tenantId,
        SearchKey: this.$route.query.searchKey,
      }).then(res => {
        this.hideLoadingTaost();
        this.tenantInfo = res;
        this.tenantInfoObj.ID = res.ID;
        this.tenantInfoObj.Name = res.Name;
        this.tenantInfoObj.Address = res.Address;
      });
    },

    hideLoadingTaost () {
      Toast.clear();
    },

    handleDeviceInfoClicked (query) {
      this.$router.push({
        path: '/device-detail',
        query,
      });
    },

    scanQrCode () {
      this.$router.push({
        path: '/device-register-code',
        query: {
          ...this.tenantInfoObj,
        },
      });
    },

    deviceRegister (number) {
      this.$router.push({
        path: '/device-register',
        query: {
          number,
          tenantInfoObj: this.tenantInfoObj,
        },
      });
    },
  },
  mounted: function () {
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .dialog-content {
    width: 75%;
    margin: 0 auto 30px;

    p {
      padding: 20px 0 15px;
      color: $font-color-regular;
    }

    .van-cell {
      background-color: $color-white;
      border: solid 1px $border-color;
      border-radius: $border-radius-small;

      input {
        background-color: $color-bg-regular;
      }
    }
  }

  .ych-page__content {
    overflow-y: hidden;
  }

  .tenant-info {
    width: 100%;
    height: 80px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    display: flex;
    padding: 0 16px;
    padding-top: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    background-color: $color-white;

    .icon {
      font-size: $font-size-secondary;
      color: $color-primary;
    }

    .title-wrap {
      flex: 1;
      margin: 0 8px;
      font-size: $font-size-secondary;

      .title {
        @include ellipsis(1);

        width: 240px;
      }

      .subtitle {
        width: 300px;
        font-size: $font-size-special;
        color: $font-color-secondary;
        padding-top: 8px;

        @include ellipsis(1);
      }
    }

    .value {
      color: $color-danger;
      font-size: $font-size-special;
    }
  }

  .tabs {
    position: absolute;
    top: 135px;
    bottom: 0;
    width: 100%;
    background-color: $color-white;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .van-tabs__nav--card {
      border-color: $color-primary;
    }

    .van-tab {
      color: $color-primary;
      border-color: $color-primary;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: normal;
    }

    .van-tab__pane {
      height: 500px;
      overflow-y: auto;
    }

    .van-tab--active {
      background-color: $color-primary !important;
    }

    .device-list {
      margin-top: 8px;
      background-color: $color-bg-primary;

      .van-cell {
        background-color: $color-white;
      }

      .van-hairline::after {
        content: none;
      }
    }
  }

  .add-device-btn {
    width: 50px;
    height: 50px;
    background-color: $color-primary;
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-size: $font-size-secondary;
    color: $color-white;
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;

    .van-icon-tianjia {
      margin-bottom: 5px;
    }
  }

</style>

<template>
  <ych-page>
    <page-header
      slot="header"
      title="客诉处理"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>
    <div :class="$style.main">
      <div :class="$style.img">
          <img
            src="../../assets/img/machine.png"
          />
      </div>
      <div>
        <van-field center v-model="searchValue" placeholder="请输入设备编号" @click-icon="onClickFieldIcon"
          :class="$style['search-field']">
          <van-icon slot="icon" :name="searchValue.length <= 0?'xiala':'close'" :class="$style['search-icon']" />
        </van-field>
        <!--
          customer-appeal__next-step--enabled-3o7rX
          van-button--disabled van-button--unclickable
         -->
        <van-button
          type="default"
          bottom-action
          :disabled="this.searchValue.length <= 0"
          :loading="loading"
          :class="{
            [$style['next-step']]: true,
            [$style['next-step--enabled']]: this.searchValue.length > 0
          }"
          @click="onClickNext">下一步</van-button>
      </div>
    </div>
      <tenant-list
        :list-show="tenantListShow"
        @cell-click="handleTenantClicked"
        @close="tenantListShow = false">
      </tenant-list>

      <device-list
        ref="deviceList"
        :list-show="deviceListShow"
        :tenantID="selectedTenantID"
        :tenantName="selectedTenantName"
        @cell-click="handleDeviceClicked"
        @close="deviceListShow = false">
      </device-list>
  </ych-page>
</template>

<script>
import CustomerAppeal from '@/api/CustomerAppeal';
import PageHeader from '@/components/PageHeader';
import TenantList from './components/TenantList';
import DeviceList from './components/DeviceList';
import { Toast } from 'vant';

export default {
  name: 'CustomerAppeal',
  components: {
    PageHeader,
    TenantList,
    DeviceList,
  },
  methods: {
    onClickFieldIcon: function () {
      if (this.searchValue.length > 0) {
        this.searchValue = '';
      } else {
        this.tenantListShow = true;
      }
    },
    onClickNext: function () {
      this.loading = true;
      CustomerAppeal.getDeviceByNumber({
        DeviceNumber: this.searchValue,
      })
        .then(res => {
          this.loading = false;
          if (res.Data.length === 0) {
            Toast('不存在此编号的设备');
          }
          if (res.Data.length === 1) {
            this.$router.push({
              path: '/device-logs',
              query: {
                deviceName: res.Data[0].Name,
                deviceNum: res.Data[0].Number,
                deviceID: res.Data[0].ID,
                deviceState: res.Data[0].State,
              },
            });
          } else {
            this.deviceListShow = true;
            this.selectedTenantName = '请选择机台';
            this.$nextTick(() => (this.$refs.deviceList.onBindSearchResult(res.Data)));
          }
        }, () => (this.loading = false))
        .catch(() => (this.loading = false));
    },
    handleTenantClicked (tenantId, tenantName) {
      this.tenantListShow = false;
      this.deviceListShow = true;
      this.selectedTenantID = tenantId;
      this.selectedTenantName = tenantName;
      this.$nextTick(() => (this.$refs.deviceList.onLoad(true)));
    },
    handleDeviceClicked (deviceName, deviceNum, deviceId, state) {
      // this.searchValue = deviceName + '';
      this.deviceListShow = false;
      this.$nextTick(() => (
        this.$router.push({
          path: '/device-logs',
          query: {
            deviceName: deviceName,
            deviceNum: deviceNum,
            deviceID: deviceId,
            deviceState: state,
          },
        })
      ));
    },
  },
  data: () => ({
    searchValue: '',
    selectedTenantID: '',
    selectedTenantName: '',
    tenantListShow: false,
    deviceListShow: false,
    loading: false,
  }),
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .main {
    height: 100%;
    background-color: $color-bg-primary;
  }

  .search-field {
    width: 335px;
    height: 50px;
    border: 1px solid;
    border-color: $border-color;
    border-radius: $border-radius;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 80px;
    font-size: $font-size-primary;

    .van-cell__value {
      display: flex;
    }
  }

  .search-icon {
    margin-top: -5px;
    font-size: 20px;
    color: $font-color-secondary;
  }

  .next-step {
    position: fixed;
    bottom: 0;
    color: $color-white;
    font-size: $font-size-regular;

    // &--enabled {
    //   color: $color-primary;
    //   background-color: $color-white;
    // }
  }

  .img {
    width: 100%;
    padding-top: 50px;
    margin-bottom: 20px;
    text-align: center;
  }
</style>

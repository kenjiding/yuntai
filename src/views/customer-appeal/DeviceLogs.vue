<template>
  <ych-page>
      <div slot="header">
        <page-header
          left-arrow
          title="机台详情"
          @click-left="$router.go(-1)"/>

        <div :class="$style['device-info']">
          <img src="@/assets/img/machine.png" v-if="device.State=='Online'"/>
          <img src="@/assets/img/machine-disabled.png" v-else />
          <div :class="$style.left">{{device.Name}}</div>
          <van-tag
            :class="$style['status-tag']"
            :type="tagStatusOfDevice">
            {{ deviceStatus }}
          </van-tag>
          <div :class="$style.right">{{device.Number}}</div>
        </div>
      </div>

      <coinin-log :device="device"></coinin-log>
  </ych-page>
</template>
<script>
/**
 * 设备投币记录/补币记录
 */
import PageHeader from '@/components/PageHeader';
import CoininLog from './components/CoininLog';

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
    CoininLog,
  },

  data: () => ({
    device: {
      Name: '',
      ID: '',
      Number: '',
      State: '',
    },
  }),

  computed: {
    deviceStatus () {
      const statusMap = {
        Online: '在线',
        Offline: '离线',
      };
      return statusMap[this.device.State] || null;
    },
    tagStatusOfDevice () {
      const statusMap = {
        Online: 'success',
        Offline: 'danger',
      };
      return statusMap[this.device.State] || null;
    },
  },

  created () {
    this.asyncGetTenantInfo();
  },

  methods: {
    asyncGetTenantInfo () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
      });

      this.device.Name = this.$route.query.deviceName;
      this.device.Number = this.$route.query.deviceNum;
      this.device.ID = this.$route.query.deviceID;
      this.device.State = this.$route.query.deviceState;

      this.hideLoadingToast();
    },

    hideLoadingToast () {
      Toast.clear();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  // .main {
  //   height: 100%;
  //   background-color: $color-bg-primary;
  // }

  .device-info {
    width: 100%;
    height: 60px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    display: flex;
    padding: 20px 16px;
    margin-bottom: 4px;
    box-sizing: border-box;
    background-color: $color-bg-primary;
    justify-content: flex-start;
    align-items: center;

    .left {
      color: $color-primary;
      font-size: 30px;
    }

    .right {
      position: absolute;
      right: 20px;
      color: $font-color-regular;
      font-size: $font-size-primary;
    }
  }

  .device-info img {
    width: 20px;
    height: 28px;
    margin-right: 9px;
  }

  .status-tag {
    width: 50px;
    text-align: center;
    margin-left: 10px;
  }

</style>

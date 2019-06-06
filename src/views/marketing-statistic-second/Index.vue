<template>
  <ych-page>
    <van-tabs v-model="active" color="#007AFF" sticky v-if="$store.getters.getPremissions.includes('marketing-statistic')">
      <van-tab title="营收">
        <business-data :tab-active="tabActive" />
      </van-tab>
      <van-tab title="商品">
        <goods-data :tab-active="tabActive" />
      </van-tab>
      <van-tab title="设备">
        <device-data :tab-active="tabActive" />
      </van-tab>
      <van-tab title="顾客">
        <customer-data :tab-active="tabActive" />
      </van-tab>
    </van-tabs>

    <div v-else :class="$style['placeholder-container']">
      <img src="@/assets/img/no_permission.png" />
      <div :class="$style['placeholder-text']">没有权限</div>
    </div>
  </ych-page>
</template>

<script>
import BusinessData from './components/BusinessData';
import DeviceData from './components/DeviceData';
import GoodsData from './components/GoodsData';
import CustomerData from './components/CustomerData';

export default {
  components: {
    BusinessData,
    DeviceData,
    CustomerData,
    GoodsData,
  },

  props: {
    tabActive: Boolean,
  },

  data: () => ({
    active: 0,
  }),

  created () {
    this.selectedTenantName = '全部门店' + (this.$route.query.tenantCount ? '(' + this.$route.query.tenantCount + '家)' : '');
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .content {
    padding-bottom: 80px;
    box-sizing: border-box;
    padding-top: 130px;
  }

  .placeholder-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80%;

    img {
      width: 210px;
      height: auto;
    }

    .placeholder-text {
      margin-top: 25px;
      color: $font-color-secondary;
    }
  }
</style>

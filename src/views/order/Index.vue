<template>
  <ych-page>
   <div slot="header" :class="$style['header-search']">
      <van-search
        placeholder="订单号/手机号/会员码/会员卡号"
        v-model="searchValue"
        :class="$style['header-search-condition']"
        :show-action="true"
        @click=" showSearchPage = true"
        @cancel="onCancelSearch">
        <div slot="action">
          <van-icon name="qr" @click="scanQrCode"/>
          <van-icon name="shaixuanxuanzhong" @click="tenantSelectClick"/>
        </div>
      </van-search>

      <van-tabs
        :class="$style['header-search-tabs']"
        v-model="orderType"
        @change="handleTpyeTabChange">
        <van-tab title="兑换单"></van-tab>
        <van-tab title="售卖单"></van-tab>
        <van-tab title="自助单"></van-tab>
      </van-tabs>
    </div>

    <div :class="$style.main">
      <order-list
        ref="orderList"
        :order-type="currentOrderType"
        :search-key="searchValue"
        :tenant-id="currentTenant"
        @cell-click="handleClickCell"></order-list>
    </div>

    <search-page
      :visible.sync="showSearchPage"
      search-placeholder="订单号/手机号/会员码/会员卡号"
      @search="handleSearch"/>

    <tenant-select
      :tenant.sync="currentTenant"
      :visible="tenantSelectVisible"
      @close="tenantSelectVisible = false"
      @click="handleTenantSelected"
    />

    </ych-page>
</template>
<script>
import PageHeader from '@/components/PageHeader';
import SearchPage from '@/components/SearchPage';
import OrderList from './components/OrderList';
import {Search, Icon, Toast} from 'vant';
import refreshEvent from '@/events/order-list-refresh';
import wx from 'weixin-js-sdk';
import TenantSelect from './components/TenantSelect.vue';

export default {
  name: 'Order',

  components: {
    PageHeader,
    SearchPage,
    OrderList,
    [Search.name]: Search,
    [Icon.name]: Icon,
    TenantSelect,
  },

  data: () => ({
    searchValue: '',
    showSearchPage: false,
    orderType: 1,
    tenantSelectVisible: false,
    currentTenant: '',
  }),

  computed: {
    currentOrderType () {
      const eumnType = {
        0: 'OrderExchange',
        1: 'OrderSale',
        2: 'OrderOnline',
      };
      return eumnType[this.orderType];
    },
  },

  methods: {
    scanQrCode () {
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            // 当needResult 为 1 时，扫码返回的结果
            let result = res.resultStr.indexOf(',') > -1 ? res.resultStr.split(',')[1] : res.resultStr;

            _this.searchValue = result;
            _this.$nextTick(() => (refreshEvent.emit()));
          },
          fail: function (res) {
            Toast.fail('摄像头调取失败，请手动输入');
          },
        });
      });
    },
    handleClickCell: function (order) {
      this.$router.push({
        path: '/order-detail',
        query: {
          orderID: order.ID,
        },
      });
    },
    handleSearch (value) {
      this.searchValue = value;
      this.currentTenant = '';
      this.$nextTick(() => (refreshEvent.emit()));
    },
    onCancelSearch () {
      this.$nextTick(() => (refreshEvent.emit()));
    },
    handleTpyeTabChange (index) {
      const searchType = {
        0: 'OrderExchange',
        1: 'OrderSale',
        2: 'OrderOnline',
      };
      this.$refs.orderList.onChangeRefresh(searchType[index]);
    },
    tenantSelectClick () {
      this.tenantSelectVisible = true;
    },
    handleTenantSelected (id, name) {
      this.searchValue = '';
      this.tenantSelectVisible = false;
      this.$nextTick(() => (refreshEvent.emit()));
    },
  },

};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .main {
    height: 100%;
    background-color: $color-bg-primary;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .header-search {
    background-image: linear-gradient(135deg, #077aff, #11b2ff);// stylelint-disable-line

    &-condition {
      padding: 14px 12px 14px 20px;
      background-color: rgba(255, 255, 255, 0) !important;

      .van-field {
        height: 36px;
        border-radius: $border-radius-bigger;
        background-color: rgba(255, 255, 255, .4);
        padding: 5px 0 5px 10px;

        .van-field__icon {
          display: none;
        }
      }

      .van-search__action {
        height: 36px;

        i {
          margin: 2px 0;
          color: $color-white;
        }

        i:first-child {
          font-size: 24px;
          margin-right: 10px;
        }

        i:last-child {
          font-size: 23px;
        }

        &:active {
          background-color: rgba(255, 255, 255, 0);
        }
      }

      input {
        padding-top: 2px;
      }

      input::-webkit-input-placeholder {
        color: $color-white;
      }

      .van-icon {
        color: $color-white;
      }
    }

    &-tabs {
      .van-tabs__nav {
        background-color: rgba(255, 255, 255, 0);
      }

      .van-hairline--top-bottom::after {
        border-width: 0;
      }

      .van-tabs__line {
        background-color: $color-warning;
      }

      .van-tab {
        color: $color-white;
        font-size: $font-size-special;
        background-color: rgba(255, 255, 255, 0) !important;

        &--active {
          color: $color-warning;
        }
      }
    }
  }

</style>

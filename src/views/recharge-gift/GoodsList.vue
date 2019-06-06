<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['search-wrap']">
        <div :class="$style['search-bar']" @click="searchVisible = true">
          <van-icon name="search" color="#999999" size="14px"/>
          <div :class="$style['text']" v-if="searchKey">{{ searchKey }}</div>
          <div :class="$style['placeholder']" v-else>可搜索商品名称/商品编号</div>
        </div>
        <van-icon name="qr" size="22px" @click="scan"/>
      </div>

      <div :class="$style['list-wrap']">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          @load="loadData">

          <div
            :class="$style['goods-item']"
            v-for="goodsItem in goodsList"
            :key="goodsItem.ID"
            @click="() => onGoodsItemClick(goodsItem)">
            <img :class="$style['goods-image']" :src="goodsItem.ImgUrl"/>
            <div :class="$style['goods-title-wrap']">
              <div :class="$style['title']">{{ goodsItem.Name }}</div>
              <div :class="$style['subtitle']">成本：¥{{ goodsItem.Cost | number('0,0.00') }}</div>
            </div>
            <van-icon name="arrow" size="14px" color="#999999" />
          </div>

        </van-list>
      </div>
      <div :class="$style['btns-wrap']">
        <van-button type="primary" @click="createGoods">新增商品</van-button>
      </div>
    </div>

    <search-page
      :visible.sync="searchVisible"
      searchPlaceholder="可搜索商品名称/商品编号"
      @search="onSearch">
    </search-page>
  </ych-page>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import { List, Toast } from 'vant';
import SearchPage from '@/components/SearchPage';
import wx from 'weixin-js-sdk';

export default {
  components: {
    [List.name]: List,
    SearchPage,
  },

  data: () => ({
    isLoading: false,
    isFinished: false,
    goodsList: [],
    pageIndex: 1,
    searchVisible: false,
    searchKey: '',
  }),

  methods: {
    loadData () {
      this.isLoading = true;
      RechargeGift.goodsList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
        SearchKey: this.searchKey,
      }).then(res => {
        console.log(res);
        this.isLoading = false;
        if (!res.HasMore) {
          this.isFinished = true;
        }

        this.goodsList = this.goodsList.concat(res.Data);
      });
    },

    onGoodsItemClick (item) {
      this.$store.commit('setLinkBackData', item);
      this.$router.back();
    },

    onSearch (value) {
      this.searchKey = value;
      this.pageIndex = 1;
      this.goodsList = [];
      this.loadData();
    },

    createGoods () {
      this.$router.replace({
        path: '/goods-add',
        query: {
          isEdit: false,
          needLinkBack: true,
        },
      });
    },

    scan () {
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var number = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            _this.onSearch(number);
          },
          fail: function (res) {
            Toast('扫描二维码失败');
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .list-wrap {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .search-wrap {
    width: 100%;
    height: 50px;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .search-bar {
      height: 30px;
      flex: 1;
      background-color: $color-white;
      border-radius: 15px; // stylelint-disable
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;

      .text {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        color: $font-color-primary;
      }

      .placeholder {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        color: $font-color-secondary;
      }
    }
  }

  .btns-wrap {
    height: 50px;
    padding: 5px 16px;
    box-sizing: border-box;
    width: 100%;

    .van-button {
      width: 100%;
      height: 40px;
    }
  }
}

.goods-item {
  height: 65px;
  background-color: $color-white;
  margin: 0 15px;
  margin-top: 10px;
  border-radius: $border-radius-small;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  .goods-image {
    width: 40px;
    height: 40px;
    border-radius: $border-radius-small;
  }

  .goods-title-wrap {
    flex: 1;
    margin-left: 10px;
    font-size: 14px;

    .title {
      color: $font-color-primary;
    }

    .subtitle {
      color: $font-color-secondary;
      margin-top: 5px;
    }
  }
}
</style>

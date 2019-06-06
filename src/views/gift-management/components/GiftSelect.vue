<template>
  <van-popup
    :value="giftShow"
    :class="$style.wrap"
    position="right">
    <page-header
      title="礼品列表"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
    />

    <searchItem
      font-color="#999999"
      back-ground="#f6f6f6"
      placeholder="可搜索商品名称/商品编码"
      @search="searchHandle"/>

        <van-list
          v-model="loading"
          :finished="finished"
          :offset=20
          :class="$style['popup-list']"
          @load="onLoad">
            <van-cell
              v-for="gift in giftList"
              :key="gift.GoodsID"
              @click="$emit('cell-click', gift.GoodsID, gift.GoodsName)">
            <template slot="title">
              <img :src="gift.Img" :class="$style.img"/>
              <span :class="$style.leftText">{{ gift.GoodsName }}</span>
            </template>
            <p slot="right-icon" :class="$style.rightText">成本：{{gift.Price | number('0,0.00')}}元</p>
            </van-cell>
            <van-cell :class="$style.cellItem"></van-cell>
        </van-list>

        <div
          v-show="isShow"
          :class="$style['add-device-btn']"
          @click="goToAddPage">
          新增礼品
        </div>
  </van-popup>

</template>
<script>
import GiftManagementApi from '@/api/GiftManagement';
import {List, Popup} from 'vant';
import PageHeader from '@/components/PageHeader';
import searchItem from '@/views/member/components/SearchItem';

export default {
  components: {
    PageHeader,
    [List.name]: List,
    [Popup.name]: Popup,
    searchItem,
  },

  props: {
    giftShow: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    finished: false,
    giftList: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    searchKey: '',
  }),
  computed: {
    isShow () {
      return this.$store.state.userInfo.IsMain;
    },
  },

  watch: {
    giftShow (val) {
      val && this.reload();
    },
  },

  methods: {
    reload () {
      this.pageIndex = 0;
      this.giftList = [];
      this.finished = false;
      this.onLoad();
    },
    searchHandle (val) {
      this.searchKey = val;
      this.reload();
    },
    goToAddPage () {
      this.$router.push({
        path: '/goods-add',
      });
    },
    onLoad () {
      this.pageIndex++;
      GiftManagementApi.getGiftListFromGoods({
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        SearchKey: this.searchKey,
      }).then(res => {
        this.loading = false;

        this.giftList = this.giftList.concat(res.Data);

        if (this.giftList.length >= res.Total) {
          this.finished = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .leftText {
    font-size: $font-size-special;
    width: 180px;
    vertical-align: middle;

    @include ellipsis(1);
  }

  .rightText {
    line-height: 40px;
    color: $font-color-secondary;
    font-size: $font-size-special;
    width: 110px;
    text-align: right;

    @include ellipsis(1);
  }

  .img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
    border-radius: $border-radius;
    margin-right: 10px;
  }

  .wrap {
    width: 100%;
    height: 100% !important;
  }

  .add-device-btn {
    border-radius: $border-radius;
    width: 90%;
    height: 45px;
    line-height: 45px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -45%;
    text-align: center;
    color: $color-white;
    background-color: $color-primary;
  }

  .popup-list {
    width: 100%;
    position: absolute;
    top: 105px;
    bottom: 50px;
    overflow: scroll;
  }

  .cellItem {
    height: 50px;
  }

  .popup-title {
    //margin-top: 5px;
    font-size: $font-size-regular;
    height: 60px;

    .van-cell__title {
      line-height: 40px;
    }

    .van-icon {
      line-height: 40px;
    }
  }
</style>

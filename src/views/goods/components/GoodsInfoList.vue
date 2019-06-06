<template>
    <div :class="$style.goodsInfoWrap">
      <van-nav-bar
        v-if="hasPremission"
        :class="$style.goodsWrapNavBar"
        title="商品管理"
        right-text="新增"
        left-arrow
        @click-left="goBack"
        @click-right="$emit('toAddPage')"
      />
      <div :class="$style.goodsInfoContent">
        <van-search
          :style="{marginBottom: 15 + 'px'}"
          placeholder="请输入商品名称"
          v-model="searchValue"
          @focus="showVisible = true" />
        <search
          :visible.sync="showVisible"></search>
        <div
          :class="$style.goodsInfoStyle"
          v-for="(item, index) in goodsDataList"
          :key="index"
          @click="goToEditPage">
          <van-row>
            <van-col :span="4"><van-icon name="cart" /></van-col>
            <van-col :span="20">
              <div><span>{{item.goodsName}}</span></div>
              <p :class="$style.infoTitleText">库存：{{item.goodsStock}}</p>
            </van-col>
          </van-row>
          <van-row :class="$style.infoBottom">
            <van-col :span="8">
              <p>售价</p>
              <p :class="$style.pText">￥{{item.price}}</p>
            </van-col>
            <van-col :span="8">
              <p>兑换价格</p>
              <p>
                <span :class="$style.spanText">{{item.points}}</span>
                <span>积分</span>
              </p>
            </van-col>
            <van-col :span="8">
              <p>回收价格</p>
              <p>
                <span :class="$style.spanText">{{item.recoveryPoints}}</span>
                <span>积分</span>
              </p>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
</template>

<script>
import { Dialog, Icon, Toast, Search } from 'vant';
import search from '@/components/SearchPage';
import Goods from '@/api/GoodsList';

export default {
  name: 'goodsInfoPage',
  data () {
    return {
      goodsDataList: [],
      searchValue: '',
      showVisible: false,
    };
  },

  computed: {
    userPremissions () {
      return this.$store.getters.getPremissions;
    },
    hasPremission () {
      return this.userPremissions.findIndex(name => name === 'goods-edit') > -1;
    },
  },

  components: {
    Dialog,
    [Icon.name]: Icon,
    [Search.name]: Search,
    search,
  },
  methods: {
    goToEditPage () {
      this.$emit('toEditPage');
    },
    goBack () {
      window.history.go(-1);
    },
    getGoodsInfoData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      Goods.goodsInfoList().then((res) => {
        Toast.clear();
        this.goodsDataList = res.goodsList;
        this.goodsDataList = this.goodsDataList.concat(res.goodsList);
      });
    },
  },
  created: function () {
    this.getGoodsInfoData();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.goodsInfoWrap {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: $color-bg-regular;

  .goodsInfoContent {
    width: 90%;
    height: auto;
    margin: 30px auto;
    background-color: $color-bg-regular;
    position: relative;
    top: 30px;

    .goodsInfoStyle {
      box-shadow: 0 1px 4px rgba(0, 0, 0, .3);
      margin-bottom: 20px;

      &:last-of-type {
        margin-bottom: 90px;
      }

      .infoBottom {
        background-color: $color-bg-regular;

        .van-col--8 {
          text-align: left;

          .pText {
            font-size: $font-size-primary;
            margin-top: 3px;
            color: $font-color-regular;

            @include ellipsis();
          }

          p {
            padding: 0;
            font-size: 14px;
            color: $font-color-placeholder;

            &:last-of-type {
              .spanText {
                font-size: $font-size-primary;
                padding-right: 3px;
                margin-top: 3px;
                color: $font-color-regular;

                @include ellipsis();
              }
            }
          }
        }
      }

      .van-row {
        padding: 8px 20px;

        &:first-of-type {
          background-color: $color-white;
        }

        .van-col--4 {
          height: 40px;
          text-align: left;

          .van-icon-cart {
            font-size: 27px;
            color: $color-primary;
            margin-top: 6px;
          }
        }

        .van-col--20 {
          span {
            font-size: $font-size-regular;
            font-weight: normal;
            font-stretch: normal;
            color: $font-color-primary;
          }

          .infoTitleText {
            font-size: 14px;
            color: $font-color-placeholder;
            padding-top: 6px;
          }
        }
      }
    }
  }

  .goodsWrapNavBar {
    background-color: $color-primary;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;

    .van-icon {
      color: $color-white;
      font-size: $font-size-regular;
    }

    .van-nav-bar__title {
      color: $color-white;
    }

    .van-nav-bar__text {
      color: $color-white;
    }
  }
}
</style>

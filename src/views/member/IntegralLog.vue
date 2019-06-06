<template>
  <ych-page>
    <van-list
      v-model="loading"
      v-if="nothingShow"
      :finished="finished"
      finished-text="没有更多了"
      :class="$style['list-wrap']"
      @load="getDataList">
      <van-cell-group
        v-for="item in list"
        :key="item.ID"
        :class="$style.wrap">
        <van-cell
          :class="$style['item-title']"
          :value="(item.Symbol === 'Plus' ? '+  ' : '-  ') + item.Count + '  积分'">
          <template slot="title">
            <van-checkbox
              :class="{[$style['checkbox-color']]: item.Symbol !== 'Plus'}"
              v-model="checked"
              disabled>
              {{item.MethodName}}
            </van-checkbox>
          </template>
        </van-cell>

        <van-cell
          :class="$style.item"
          :title="item.Method === 'Transfer' ? '转移会员' : '商品'" :value="item.Description.Value" />
        <van-cell
          :class="$style.item"
          title="时间" :value="item.Time | date" />
      </van-cell-group>

    </van-list>

    <Nothing v-else/>
  </ych-page>
</template>

<script>
import { List } from 'vant';
import LeaguerManage from '@/api/LeaguerManage';
import Nothing from './components/Nothing';

export default {
  name: '',

  components: {
    [List.name]: List,
    Nothing,
  },

  data () {
    return {
      checked: true,
      list: [],
      pageIndex: 0,
      loading: false,
      finished: false,
      nothingShow: true,
    };
  },

  methods: {
    integralMethod (val) {
      let obj = {
        RechargeGifts: '充值赠送',
        BuyGifts: '购买赠送',
        ActivityGifts: '活动赠送',
        GoodsExchange: '商品兑换',
        GiftRecycle: '礼品回收',
        CancelRecharge: '取消充值',
        CancelBuy: '取消购买',
        CancelExchange: '取消兑换',
        CancelRecycle: '取消回收',
        Transfer: '储值转移',
      };

      return obj[val];
    },
    getDataList () {
      this.loading = true;
      this.pageIndex++;
      LeaguerManage.integralRecord({
        PageIndex: this.pageIndex,
        PageSize: 10,
        LeaguerID: this.$route.query.leaguerID,
      }).then((res) => {
        this.loading = false;
        this.list = this.list.concat(res.Data);
        this.nothingShow = this.list.length > 0;

        if (!res.HasMore) {
          this.finished = true;
        }
      }, _ => {
        this.loading = false;
      });
    },
  },

  beforeRouteEnter (to, from, next) {
    document.title = '积分记录';
    next();
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.list-wrap {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: $color-bg-primary;

  .van-hairline--top-bottom {
    &::after {
      content: none !important;
    }
  }
}

.wrap {
  margin: 10px 15px 0;
  border-radius: $border-radius;

  .van-hairline {
    &::after {
      content: none !important;
    }
  }
}

.item-title {
  width: 100%;
  padding: 10px 8px;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  border-bottom: 1px solid $border-color;

  .van-checkbox__label {
    color: $color-primary;
    font-size: $font-size-primary;
  }

  .van-checkbox--checked {
    background-color: $color-primary;
  }
}

.item {
  padding: 7px 8px 7px 35px;
  border-radius: $border-radius;
  color: $font-color-secondary;

  &:not(:last-child)::after {
    content: none;
  }
}

.checkbox-color {
  .van-checkbox--checked {
    background-color: $font-color-special !important;
    border: none;
  }

  span {
    color: $font-color-special !important;
  }
}

</style>

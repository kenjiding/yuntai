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
          :value="(item.Symbol === 'Plus' ? '+  ' : '-  ') + item.Count + '  币'">
          <template slot="title">
            <van-checkbox
              :class="{[$style['checkbox-color']]: item.Symbol !== 'Plus'}"
              v-model="checked"
              disabled>{{integralMethod(item.Method)}}</van-checkbox>
          </template>
        </van-cell>

        <van-cell
          :class="$style.item"
          :title="filterTitle(item.Method)"
          :value="item.Description.Value" />
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
      firstTitle: '',
      secondTitle: '',
    };
  },

  methods: {
    filterTitle (val) {
      let obj = {
        BuyInto: '商品',
        PlayDeduction: '设备',
        ActivityGift: '活动',
        LevelGift: '方式',
        BirthdayGift: '方式',
        CurrencyOverdue: '方式',
        CancelBuy: '商品',
        CancelPlay: '设备',
        SystemCurrency: '方式',
        StoreTransfer: '转移会员',
        CancelRechargeGive: '方式',
        Exchange: '商品',
        ExchangeRecharge: '方式',
        CancelExchange: '商品',
        ConsumptionSend: '商品',
      };
      return obj[val];
    },
    integralMethod (val) {
      let obj = {
        BuyInto: '购买充入',
        PlayDeduction: '游玩扣费',
        ActivityGift: '活动赠送',
        LevelGift: '等级送币',
        BirthdayGift: '生日送币',
        CurrencyOverdue: '游戏币过期',
        CancelBuy: '取消购买',
        CancelPlay: '取消游玩',
        SystemCurrency: '系统补币',
        StoreTransfer: '储值转移',
        CancelRechargeGive: '取消赠送',
        Exchange: '商品兑换',
        ExchangeRecharge: '兑换充入',
        CancelExchange: '取消兑换',
        ConsumptionSend: '消费满送',
      };

      return obj[val];
    },
    getDataList () {
      this.loading = true;
      this.pageIndex++;
      LeaguerManage.currencyRecord({
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
    document.title = '游戏币记录';
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

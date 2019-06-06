<template>
  <ych-page>
    <ConsumptionCircle
      ref="consumptionCircle"
      :value="consumeInfo.CodeConsumeCount"
      :total="consumeInfo.CodeTotalCount"/>
    <div v-if="currentType === 'Things'">
      <template v-for="(item,index) in goodsConsumeList" >
        <div :key="index" :class="$style['consumption-gift-item']">
          <span>【{{ item.Name }}】</span>
          <span>消耗：{{ item.ConsumeCount }}/{{ item.TotalCount }}</span>
        </div>
      </template>
    </div>
    <div
      v-else
      :class="$style['consumption-cash-collect']">
      <div>
        <p>红包消耗</p>
        <p>{{consumeInfo.RedPacketConsumeCount}}/{{consumeInfo.RedPacketTotalCount}}</p>
      </div>
      <div v-if="currentType === 'Cash'">
        <p>金额消耗</p>
        <p>￥{{consumeInfo.MoneyConsumeCount | number}}/￥{{consumeInfo.MoneyTotalCount| number}}</p>
      </div>
      <div v-else-if="currentType === 'Currency'">
        <p>游戏币消耗消耗</p>
        <p>{{consumeInfo.CurrencyConsumeCount}}/{{consumeInfo.CurrencyTotalCount}}</p>
      </div>
      <div
        v-if="currentType === 'Cash' && currentState === 'Ended' && currentRefund > 0"
        :class="$style['consumption-cash-collect__special']">
        <p>已退剩余金额</p>
        <p>￥{{currentRefund | number}}</p>
      </div>
    </div>
    <div :class="$style['consumption-list-total']">
      中奖人员：{{listTotal}}人
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList">

        <template
          v-for="item in consumeList"
          :class="$style['item']"
          @click="selectGoods(item)">
          <ConsumptionListItem
            :key="item.ID"
            :info="item"
            :current-type="currentType"/>
        </template>
      </van-list>
  </ych-page>
</template>

<script>
import { Toast, List } from 'vant';
import GoodyBag from '@/api/GoodyBag';
import ConsumptionCircle from './components/ConsumptionCircle.vue';
import ConsumptionListItem from './components/ConsumptionListItem.vue';

export default {
  name: 'consumptionQuery',

  components: {
    [List.name]: List,
    ConsumptionCircle,
    ConsumptionListItem,
  },

  data () {
    return {
      currentId: '',
      typeEnum: {
        ItemMail: 'Things',
        ItemInvite: 'Things',
        CashFixed: 'Cash',
        CashRandom: 'Cash',
        CurrencyFixed: 'Currency',
        CurrencyRandom: 'Currency',
      },
      currentType: '',
      currentState: '',
      currentRefund: 0,
      consumeInfo: {
        CodeTotalCount: 0,
        CodeConsumeCount: 0,
        RedPacketTotalCount: 0,
        RedPacketConsumeCount: 0,
        MoneyTotalCount: 0,
        MoneyConsumeCount: 0,
        CurrencyTotalCount: 0,
        CurrencyConsumeCount: 0,
      },
      goodsConsumeList: [],
      pageIndex: 0,
      pageSize: 10,
      loading: false,
      finished: false,
      consumeList: [],
      listTotal: 0,
    };
  },

  created () {
    this.currentId = this.$route.query.id;
    this.currentType = this.typeEnum[this.$route.query.type];
    this.currentState = this.$route.query.state;
    this.currentRefund = Number(this.$route.query.refund);
    this.asyncGetGoodsConsumeList();
  },

  methods: {
    asyncGetGoodsConsumeList () {
      Toast.loading({
        message: '加载中',
        mask: true,
        duration: 0,
      });

      GoodyBag.consumeInfo({
        ID: this.currentId,
        ActivityType: this.currentType,
      }).then((res) => {
        this.consumeInfo = res;
        this.goodsConsumeList = res.ConsumeList;
        Toast.clear();
        this.$nextTick(() => {
          this.$refs.consumptionCircle.calculate();
        });
      });
    },

    getList () {
      this.loading = true;
      this.pageIndex++;

      GoodyBag.consumeList({
        ID: this.currentId,
        ActivityType: this.currentType,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then((res) => {
        this.consumeList = this.consumeList.concat(res.Data);
        this.listTotal = res.TotalCount;
        this.loading = false;

        if (this.consumeList.length >= res.TotalCount) {
          this.finished = true;
        }
      }, () => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .consumption-gift-item {
    padding: 0 20px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    z-index: 20;
    border-top: .5px solid $color-white !important;
    background-color: $color-primary;
    color: $color-white;
    font-size: $font-size-special;
    line-height: 42px;

    > span {
      width: 50%;

      @include ellipsis(1);

      &:last-child {
        text-align: right;
      }
    }
  }

  .consumption-cash-collect {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    > div {
      width: 50%;
      height: 60px;
      padding: 8px;
      line-height: 22px;
      box-sizing: border-box;
      border-top: 1px solid $color-white;
      background-color: $color-primary;
      color: $color-white;
      font-size: $font-size-special;
      text-align: center;

      > p:first-child {
        font-size: $font-size-special;
        color: rgba(255, 255, 255, .7);
      }
    }

    > div:first-child {
      border-right: 1px solid $color-white;
    }

    &__special {
      width: 100% !important;
      border: 0 !important;
      background-color: $color-danger !important;
    }
  }

  .consumption-list-total {
    height: 44px;
    line-height: 44px;
    padding-left: 20px;
    font-size: $font-size-primary;
    color: $font-color-primary;
    background-color: $color-bg-primary;
  }
</style>

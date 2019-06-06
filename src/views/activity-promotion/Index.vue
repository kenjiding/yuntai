<template>
  <ych-page>
    <div :class="$style['content']">
      <div :class="$style['cell-item']" @click="$router.push('/activity-game-currency')">
        <img src="@/assets/img/currency-game.png" :class="$style['icon']" />
        <div :class="$style['title']">游戏币红包</div>
        <van-icon name='arrow' :class="$style['right-icon']" color="#cccccc"/>
      </div>

      <div :class="$style['divide']"></div>

      <div :class="$style['cell-item']" @click="$router.push('/goody-bag')">
        <img src="@/assets/img/goody-bag.png" :class="$style['icon']" />
        <div :class="$style['title']">福袋抽奖</div>
        <van-icon name='arrow' :class="$style['right-icon']" color="#cccccc"/>
      </div>

      <div :class="$style['divide']"></div>

      <div :class="$style['cell-item']" @click="$router.push('/member-probability')">
        <img src="@/assets/img/probability.png" :class="$style['icon']" />
        <div :class="$style['title']">会员概率</div>
        <div :class="$style['value']">限免</div>
        <van-icon name='arrow' :class="$style['right-icon']" color="#cccccc"/>
      </div>

      <div :class="$style['divide']"></div>

      <div :class="$style['cell-item']" @click="$router.push('/recharge-gift')">
        <img src="@/assets/img/recharge-gift.png" :class="$style['icon']" />
        <div :class="$style['title']">充值送商品</div>
        <van-icon name='arrow' :class="$style['right-icon']" color="#cccccc"/>
      </div>

      <div :class="$style['divide']"></div>

      <div :class="$style['cell-item']" @click="$router.push('/activity-ranking')">
        <img src="@/assets/img/ranking.png" :class="$style['icon']" />
        <div :class="$style['title']">活动排行</div>
        <div :class="$style['value']">限免</div>
        <van-icon name='arrow' :class="$style['right-icon']" color="#cccccc"/>
      </div>

    </div>
  </ych-page>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import PageHeader from '@/components/PageHeader';

export default {
  name: '',

  data () {
    return {
      PromotionData: {},
      timeTest: 0,
      timer: null,
    };
  },

  components: {
    PageHeader,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
  },
};
</script>

<style lang='scss' module>
  @import "@/styles/them.scss";

  .content {
    padding: 16px 0; // stylelint-disable
  }

  .divide {
    width: 100%;
    height: 1px;
    background-color: #f6f6f6;
    border-left: 16px solid $color-white;
    border-right: 16px solid $color-white;
    box-sizing: border-box;
  }

  .cell-test {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
  }

  .cell-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    background-color: $color-white;

    .icon {
      width: 25px;
      height: 25px;
    }

    .title {
      flex: 1;
      font-size: 16px;
      color: $font-color-primary;
      margin-left: 10px;
    }

    .value {
      font-size: 14px;
      color: #ee494a;
      margin-right: 10px;
    }
  }
</style>

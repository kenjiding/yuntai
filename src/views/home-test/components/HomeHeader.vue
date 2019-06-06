<template>
  <div>
    <div v-if="isCashier" :class="$style['home-header-logo']">
      <van-icon name='yuntaixinlingshoulogo' size="70px"/>
    </div>
    <div v-else :class="$style['home-header']">
      <div :class="$style['home-header-top']">
        <div>
          <p :class="$style['pText']">今日收入</p>
          <div :class="$style['total-money']">
            <span :class="$style['total-money-span']">{{allMoney | number('0, 0.00')}}</span>
            <span>元</span>
          </div>
        </div>
      </div>
      <van-row :class="$style['home-header-bottom']">
        <van-col :span="12" :class="$style['home-header-bottom-line']">
          <p>交易</p>
          <p>
            <span :class="$style['limit-width']">{{allNum | number}}</span>
            <span  :class="$style['bottom-span']">笔</span>
          </p>
        </van-col>
        <van-col :span="12" :class="$style['home-header-bottom-line']">
          <p>顾客</p>
          <p>
            <span :class="$style['limit-width']">{{allCustomer | number}}</span>
            <span  :class="$style['bottom-span']">人</span>
          </p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: '',

  data () {
    return {
    };
  },
  props: {
    allMoney: Number,
    allNum: Number,
    allCustomer: Number,
  },

  computed: {
    ...mapState({
      roleNames: (state) => state.userInfo.RoleNames,
    }),

    isCashier () {
      return this.roleNames ? ~this.roleNames.indexOf('Employee') : false;
    },
  },
  methods: {},
  created () {
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.limit-width {
  display: inline-block;
  max-width: 75% !important;

  @include ellipsis(1);
}

.total-money-span {
  display: inline-block;
  max-width: 80% !important;
}

.home-header-bottom {
  height: 40%;

  .van-col--12 {
    color: rgba(255, 255, 255, .5);
    font-size: $font-size-special;

    p {
      &:last-of-type {
        padding: 10px 0;
        color: $color-white;
        font-size: $font-size-secondary;
      }
    }
  }

  .bottom-span {
    font-size: $font-size-special;
    color: $color-white;
    margin-left: 10px;
  }
}

.pText {
  font-size: $font-size-special;
  color: rgba(255, 255, 255, .5);
}

.home-header-zhanghao {
  height: 0;
  text-align: right;

  .van-icon-zhanghao {
    font-size: $font-size-bigger;
    color: $color-white;
    position: relative;
    right: 20px;
    top: -25px;
  }
}

.home-header-logo {
  color: $color-white;
  background-color: $color-primary;
  font-size: 70px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}

.home-header {
  flex: 1;
  width: 100%;
  height: 140px;
  background-color: $color-primary;
  padding: 15px 20px;
  box-sizing: border-box;
}

.home-header-top {
  width: 100%;
  height: 60%;

  div {
    &:first-of-type {
      width: 100%;

      .total-money {
        width: 100%;
        padding: 10px 0;
        text-align: left;

        span {
          color: $color-white;
        }

        &-span {
          font-size: $font-size-bigger;
          color: $color-white;
          margin-right: 10px;

          @include ellipsis(1);
        }
      }
    }

    &:nth-child(2) {
      width: 20%;
      float: left;
      text-align: right;
    }
  }
}
</style>

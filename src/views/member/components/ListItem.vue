<template>
  <div :class="$style.card">
    <div :class="$style['card-top']">
      <img
        v-if ="splitLevelName === 'L0'"
        src="../../../assets/img/level-default.png"
        :class="$style['card-top__icon']"/>
      <img
        v-else
        :src="leaguerInfo.HeadImgUrl"
        :class="$style['card-top__icon']"/>
      <div :class="$style['card-top__title']">
        <p :class="$style['card-top__name']">
          {{ splitLevelName === 'L0' ? '会员卡' : leaguerInfo.NickName}}
          <van-icon
            :name="sexName(leaguerInfo.Sex).name"
            :style="{backgroundColor: sexName(leaguerInfo.Sex).bgcolor}"
            :class="$style.iconBgcolor"
            v-if="sexName(leaguerInfo.Sex).name || splitLevelName === 'L0'"/>
            <img
              :class="$style['card-top__levelicon']"
              v-if ="splitLevelName === 'L1'"
              src="../../../assets/img/V1.png"/>
            <img
              :class="$style['card-top__levelicon']"
              v-else-if ="splitLevelName === 'L2'"
              src="../../../assets/img/V2.png"/>
            <img
              :class="$style['card-top__levelicon']"
              v-else-if ="splitLevelName === 'L3'"
              src="../../../assets/img/V3.png"/>
            <img
              :class="$style['card-top__levelicon']"
              v-else-if ="splitLevelName === 'L4'"
              src="../../../assets/img/V4.png"/>
            <img
              :class="$style['card-top__levelicon']"
              v-else-if ="splitLevelName === 'L5'"
              src="../../../assets/img/V5.png"/>
        </p>
        <p :class="$style['card-top__phone']">
          {{ splitLevelName === 'L0' ? ('卡号：'  + leaguerInfo.CardNumber || '') : ('手机号:' + leaguerInfo.Telephone || '')}}
        </p>
      </div>

      <div :class="$style['card-top__link']">
        <div :class="$style['link-left']">
          <slot name="right"></slot>
          <!-- <p>消费5笔</p>
          <p>共120.00元</p> -->
        </div>
        <div :class="$style['link-right']">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div :class="$style['leaguer-level']" v-if="showLeaguerLevel">
      {{leaguerInfo.LevelIndex}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leaguerInfo: Object,
    showLeaguerLevel: Boolean,
  },

  computed: {
    splitLevelName () {
      let str = this.leaguerInfo.LevelName || this.leaguerInfo.LevelIndex || '';
      return str.split('.')[0];
    },
  },

  methods: {
    sexName (val) {
      let className = {
        Man: {name: 'xingbienanxianxing', bgcolor: '#077AFF'},
        Woman: {name: 'xingbienvxianxing', bgcolor: 'red'},
        Unknown: {name: '', bgcolor: ''},
      };
      return className[val];
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .link-left {
    float: left;
    width: 80%;
    text-align: right;

    p {
      font-size: $font-size-mini;
      padding-right: 3px;
      color: #fba145; // stylelint-disable-line
      display: block !important;

      @include ellipsis(1);

      &:nth-child(1) {
        margin-bottom: 10px;
        color: $font-color-secondary;
      }
    }
  }

  .link-right {
    float: left;
    width: 20%;

    .van-icon-arrow {
      display: inline-block;
      margin-top: 10px;
      font-size: $font-size-special;
      color: $font-color-placeholder;
    }
  }

  .iconBgcolor {
    width: 23px;
    height: 15px;
    text-align: center;
    border-radius: $border-radius-small;
    font-size: $font-size-mini;
    color: $color-white;
  }

  .card {
    position: relative;
    background-color: $color-white;
    border-bottom: 1px solid $border-color;
  }

  .card-top {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px 5px 15px;

    &__levelicon {
      width: 45px;
      height: 17px;
      vertical-align: middle;
      margin-left: 5px;
    }

    &__link {
      flex: 3;
    }

    &__icon {
      width: 50px;
      height: 50px;
      border-radius: $border-radius-circle;
    }

    &__title {
      flex: 7;
      margin-left: 10px;
    }

    &__name {
      font-size: $font-size-special;
      color: $font-color-primary;
    }

    &__phone {
      margin-top: 8px;
      color: $font-color-placeholder;
      font-size: $font-size-mini;
    }
  }

  .card-bottom {
    height: 40px;
    background-color: $color-bg-regular;
    display: flex;
    align-items: center;
    padding-left: 10px;

    &__balance {
      text-align: center;
      color: $font-color-placeholder;
      font-size: $font-size-special;
    }

    &__value {
      color: $font-color-primary;
      font-size: $font-size-primary;
      margin-left: 5px;
    }
  }

  .leaguer-level {
    position: absolute;
    top: 10px;
    right: 0;
    width: 60px;
    height: 20px;
    background-color: #e0c48f; // stylelint-disable-line
    color: $color-white;
    font-size: $font-size-mini;
    text-align: center;
    line-height: 20px;
  }
</style>

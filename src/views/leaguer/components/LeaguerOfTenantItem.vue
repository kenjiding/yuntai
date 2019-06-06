<template>
  <div :class="$style['item-container']">
    <div :class="$style.card">
      <div :class="$style['card-top']">
        <img :src="leaguerInfo.HeadImageUrl" :class="$style['card-top__icon']"/>
        <div :class="$style['card-top__title']">
          <p :class="$style['card-top__name']">
            {{leaguerInfo.LeaguerName}}
            <van-icon
              :name="sexName(leaguerInfo.Sex).name"
              :style="{backgroundColor: sexName(leaguerInfo.Sex).bgcolor}"
              :class="$style.iconBgcolor" />
          </p>
          <p :class="$style['card-top__phone']">手机号: {{leaguerInfo.Telephone}}</p>
        </div>
      </div>
      <div :class="$style['leaguer-level']" v-if="showLeaguerLevel">
        {{leaguerInfo.LevelName}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leaguerInfo: Object,
    showLeaguerLevel: Boolean,
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

  .iconBgcolor {
    width: 23px;
    height: 15px;
    text-align: center;
    border-radius: $border-radius-small;
    font-size: $font-size-mini;
    color: $color-white;
  }

  .item-container {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
  }

  .card {
    position: relative;
    background-color: $color-white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
  }

  .card-top {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: $border-radius-circle;
    }

    &__title {
      flex: 1;
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

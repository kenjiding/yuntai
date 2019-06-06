<template>
  <div
    :class="$style.item">
    <div @click="$emit('click-item')">
      <p :class="$style['item-title']">{{ activityInfo.Name }}</p>
      <div :class="$style['item-info']">
        <div>
          <p>显示名次：前 {{ activityInfo.FrequencyNum }} 名</p>
          <p>名次奖励：{{ activityInfo.RankingReward }}位</p>
        </div>
        <div>
          <van-icon name="arrow" />
        </div>
      </div>
      <p>有效期：{{ activityInfo.ValidityPeriod }}</p>
      <p :style="{marginBottom: '10px'}">由【{{ activityInfo.CustomerName }}】于 【{{ activityInfo.CreateTime }}】 创建</p>
    </div>
    <p :class="$style.ranking" @click="$emit('click-ranking')" v-if="activityInfo.Status !== 'NotStart'">排行榜</p>

    <van-icon
      name="yiguanbi"
      :class="$style.iconfont"
      v-if="icon"/>
  </div>
</template>

<script>

export default {
  name: '',

  props: {
    activityInfo: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {

    };
  },
  created () {},

  methods: {

  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.ranking {
  height: 40px;
  color: $color-primary !important;
  line-height: 40px !important;
  text-align: center;
  border-top: 1px solid $border-color;
}

.iconfont {
  position: absolute;
  left: 230px;
  top: 15px;
  font-size: 70px;
  color: $font-color-placeholder;
}

.item {
  width: 100%;
  padding: 10px 15px 0;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: $color-white;
  position: relative;
  border-bottom: 1px solid $border-color;

  &:nth-of-type(1) {
    margin-top: 10px;
  }

  p {
    padding: 5px 0;
    color: $font-color-secondary;
    font-size: $font-size-special;
    line-height: 15px;
  }

  &-title {
    font-size: $font-size-primary !important;
    color: $color-black !important;
    font-weight: 500;
    margin-bottom: 10px;
  }

  &-info {
    overflow: hidden;

    div {
      float: left;

      &:nth-child(1) {
        width: 90%;
      }

      &:nth-child(2) {
        width: 10%;

        .van-icon-arrow {
          font-size: $font-size-secondary;
          color: $font-color-secondary;
          margin-top: 10px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>

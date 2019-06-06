<template>
  <div :class="$style.item">
    <div>
      <img src="@/assets/img/pakage.png" width="100%" height="100%" />
    </div>
    <div>
      <p :class="$style.name">{{goodsInfo.currency}}币</p>
      <p :class="$style.info" v-if="goodsInfo.points">兑换价格：{{goodsInfo.points}}积分</p>
    </div>
    <div>
      ￥<span>{{goodsInfo.price}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    goodsInfo: Object,
  },

  data () {
    return {
    };
  },
  created () {},

  methods: {},
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.item {
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  padding: 10px 15px;
  display: flex;
  border-bottom: 1px solid $border-color;
  background-color: $color-white;

  div {
    &:nth-child(1) {
      width: 50px;
    }

    &:nth-child(2) {
      flex: 7;
      padding-left: 10px;
    }

    &:nth-child(3) {
      flex: 3;
      line-height: 30px;
      color: $font-color-secondary;
      text-align: right;

      span {
        color: $color-warning;
      }
    }
  }
}

.name {
  font-size: $font-size-primary;
  color: $font-color-primary;
  height: 50%;
  line-height: 25px;
}

.info {
  font-size: $font-size-mini;
  color: $font-color-disable;
  height: 50%;
  line-height: 25px;
}
</style>

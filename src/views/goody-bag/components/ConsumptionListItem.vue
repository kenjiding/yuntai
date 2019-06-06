<template>
  <div :class="$style['consume-list-item']">
    <img
      v-if="info.AvatorUrl"
      :src="info.AvatorUrl"
      :class="$style.avator">
      <div>
        <div :class="$style['item-content']">
          <span>{{ info.Name }}</span>
          <van-icon
            :class="$style[info.Sex === 'Man' ?'van-icon-man':'van-icon-female']"
            :name="info.Sex === 'Man' ? 'xingbienanxianxing' : 'xingbienvxianxing'" />
            <img src="@/assets/img/V1.png" :class="$style['level-icon']" v-if="info.Level === 1">
            <img src="@/assets/img/V2.png" :class="$style['level-icon']" v-else-if="info.Level === 2">
            <img src="@/assets/img/V3.png" :class="$style['level-icon']" v-else-if="info.Level === 3">
            <img src="@/assets/img/V4.png" :class="$style['level-icon']" v-else-if="info.Level === 4">
            <img src="@/assets/img/V5.png" :class="$style['level-icon']" v-else-if="info.Level === 5">
        </div>
        <div :class="$style.phone">手机号码：{{ info.Phone}}</div>
      </div>
      <div v-if="currentType === 'Things'" :class="$style['item-gift']">{{ info.GiftName }}</div>
      <div v-else-if="currentType === 'Cash'" :class="$style['item-gift']">￥{{ info.GiftName | number}}</div>
      <div v-else :class="$style['item-gift']">{{ info.GiftName | number('0')}} 币</div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'consumeListItem',

  props: {
    info: {
      type: Object,
      default: () => ({}),
    },

    currentType: {
      type: String,
      default: 'Things',
    },

  },

  components: {
    [Icon.name]: Icon,
  },

};
</script>

<style lang='scss' module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .consume-list-item {
    // width: 100%;
    height: 80px;
    padding: 0 15px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    background-color: $color-white;
    $four-px: 4px;

    .avator {
      width: 55px;
      height: 55px;
      border-radius: $border-radius-circle;
    }

    > div:nth-child(2) {
      min-width: 100px;
      height: 60px;
      line-height: 26px;
      padding: 10px;
      flex: 2;

      .item-content {
        > span {
          max-width: calc(100% - 78px);
          line-height: 16px;
          font-size: $font-size-primary;
          color: $font-color-primary;

          @include ellipsis(1);
        }
      }

      .phone {
        font-size: $font-size-special;
        color: $font-color-secondary;
      }

      .van-icon {
        font-size: $font-size-secondary + $four-px;
        transform: rotate(45deg);

        &-man {
          color: $color-primary;
        }

        &-female {
          color: $font-color-special;
        }
      }
    }

    .level-icon {
      width: 45px;
      height: 17px;
    }

    .item-gift {
      width: 90px;
      max-height: 36px;
      line-height: 18px;
      word-break: break-all;
      font-size: $font-size-special;
      text-align: center;

      @include ellipsis(2);
    }
  }
</style>

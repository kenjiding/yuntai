<template>
  <nav-bar
    v-bind="$attrs"
    v-on="$listeners"
    :class="$style['page-header']">
    <slot name="right" slot="right"/>
  </nav-bar>
</template>

<script>
import { NavBar } from 'vant';
export default {
  name: 'YchPageHeader',
  components: { NavBar },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .page-header {
    &.van-nav-bar {
      background-color: $color-primary;
      color: $color-white;

      .van-nav-bar__text {
        color: $color-white;
      }

      .van-icon {
        color: $color-white;
        font-size: $font-size-primary;
      }

      .van-nav-bar__right {
        .van-icon {
          font-size: $font-size-secondary !important;
          margin-top: -6px;
        }
      }
    }

    [class*=van-hairline]::after {
      content: none;
    }
  }

</style>

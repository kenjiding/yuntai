<template>
    <div :class="$style.playWrap">
      <van-nav-bar
        :class="$style.playWrapNavBar"
        title="游玩套餐"
        right-text="新增"
        left-arrow
        @click-left="goBack"
        @click-right="$emit('goToAdd')"
      />
      <div :class="$style.playContent">
        <van-cell-group
          v-for="(item,index) in packgeList"
          :key="index"
          @click.native="$emit('toEditPlay', item.id)">
          <van-cell :title="item.currency + '游戏币'" :class="$style.topTitleStyle"/>
          <van-cell
            :title="'售价: ' + item.price"
            :value="'兑换积分: ' + item.points"
            :class="$style.topValueStyle" />
        </van-cell-group>
      </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import PackgeApi from '@/api/Packge';

export default {
  name: 'packgePlayPage',
  data () {
    return {
      packgeList: [],
    };
  },
  computed: {},

  components: {},
  methods: {
    goBack () {
      window.history.back(-1);
    },
    getInfoData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      PackgeApi.packgeInfo().then(res => {
        Toast.clear();
        this.packgeList = res.Data;
      });
    },
  },
  created: function () {
    this.getInfoData();
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.playWrap {
  height: 90%;
  width: 100%;
  background-color: $color-bg-regular;

  .playContent {
    width: 90%;
    height: auto;
    margin: 30px auto;
    border: 1px solid $border-color;
    position: relative;
    top: 50px;

    .van-cell-group {
      margin-bottom: 20px;

      .topValueStyle {
        span {
          color: $font-color-secondary;
        }
      }
    }

    .topTitleStyle {
      background-color: $color-danger;

      .van-cell__title {
        font-size: $font-size-primary;
      }
    }

    [class*="van-hairline"]::after {
      content: none;
    }
  }

  .playWrapNavBar {
    background-color: $color-primary;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;

    .van-icon {
      color: $color-white;
      font-size: $font-size-regular;
    }

    .van-nav-bar__title {
      color: $color-white;
    }

    .van-nav-bar__text {
      color: $color-white;
    }
  }
}
</style>

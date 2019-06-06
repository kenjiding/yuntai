<template>
  <ych-page
    @scroll="topNavScroll"
    :class="$style['ych-pagecontent-wrap']">
    <div ref="header" :class="$style['login-header']">
      <div :class="$style['header-logo']">
        <van-icon name="yuntaixinlingshoulogo" />
      </div>
    </div>
    <div :class="{[$style['ych-content-View']] : isActive }">
      <router-view></router-view>
    </div>
  </ych-page>
</template>

<script>
import { Toast } from 'vant';

export default {
  name: 'loginPage',
  components: {
  },
  data () {
    return {
      isActive: false,
    };
  },
  //注册组件，调用注册接口后，在路由离开的时候清除loading
  beforeRouteLeave: (to, from, next) => {
    next(() => Toast.clear());
  },
  methods: {
    topNavScroll () {
      const topbanner = this.$refs.header;
      const topbannerCliengt = topbanner.getBoundingClientRect();
      if (topbannerCliengt.bottom < 30) {
        this.isActive = true;
      } else if (topbannerCliengt.bottom > 40) {
        this.isActive = false;
      }
    },
  },
  mounted: function () {
  },
};
</script>

<style lang="scss" module>
// stylelint-disable
@import "@/styles/them.scss";

.ych-content-View {
  .van-tabs__wrap {
    position: fixed;
    top: 0;
    left: 0;
    background-image: linear-gradient(320deg, #3f25d9 0%, #52a0fd 100%);
  }
}

.ych-pagecontent-wrap {
  .ych-page__content {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
}

.login-header {
  width: 100%;
  height: 170px;
  background: $color-primary;
  background-image: linear-gradient(320deg, #3f25d9 0%, #52a0fd 100%);

  .header-logo {
    height: 100%;
    text-align: center;

    .van-icon-yuntaixinlingshoulogo {
      margin-top: 40px;
      font-size: 70px;
      color: $color-white;
    }
  }
}
</style>

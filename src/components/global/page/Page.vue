<template>
  <div
    class="ych-page">
    <slot name="header"/>
    <div
      v-bind="$attrs"
      v-on="$listeners"
      class="ych-page__content">
      <slot name="default"/>
    </div>
    <slot name="footer"/>
  </div>
</template>

<script type="text/javascript">
// import { mapState } from 'vuex';
// import WechatConfig from '@/config/wechat-config';

export default {
  name: 'YchPage',

  mounted () {
    // 路由配置openJsSdk为 true 的才调SDK验证
    // this.openJsSdk && WechatConfig();
  },

  computed: {
    // ...mapState({
    //   openJsSdk (state) {
    //     const { openJsSdk = false } = state.route.meta;
    //     return openJsSdk;
    //   },
    // }),
  },
};
</script>

<style lang="scss">
@import "@/styles/them.scss";

.ych-page {
  height: 100vh;
  background-color: $color-white;
  display: flex;
  flex-direction: column;
}

.ych-page__content {
  flex: 1;
  overflow-y: auto;
  background-color: $color-bg-primary;
}

</style>

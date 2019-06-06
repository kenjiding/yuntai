<template>
  <ych-page>
    <page-header
      left-arrow
      title="礼品设置"
      @click-left="$router.go(-1)"/>

    <van-cell-group :class="$style['gift-cell-group']">
      <van-cell
        is-link
        title="礼品"
        @click="handleGiftClicked">
        <van-icon name="gift" slot="icon" :class="$style.icon"/>

        {{giftInfo.Name}}
      </van-cell>

      <van-cell
        title="现有库存">
        <van-icon name="box" slot="icon" :class="$style.icon"/>

        <span>
          {{giftInfo.Stock | number}}
        </span>
      </van-cell>
    </van-cell-group>
  </ych-page>
</template>

<script>
/**
 * 设备礼品设置界面
 */
import PageHeader from '@/components/PageHeader';

export default {
  components: {
    PageHeader,
  },

  data: () => ({
    giftInfo: {},
  }),

  created () {
    this.giftInfo = JSON.parse(this.$route.query.deviceGiftInfo);
  },

  methods: {
    handleGiftClicked () {
      this.$router.push({
        path: '/device-gift-select',
        query: {
          deviceId: this.$route.query.deviceId,
        },
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .gift-cell-group {
    margin: 16px 20px 0;

    .icon {
      font-size: $font-size-regular;
      margin-right: 8px;
    }
  }
</style>

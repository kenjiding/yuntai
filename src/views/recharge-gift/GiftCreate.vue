<template>
  <div :class="$style['container']">
    <cell-group no-padding>
      <cell
        title="商品名称："
        cell-type="input"
        required
        v-model="giftData.Name"/>

      <cell
        title="商品图片："
        cell-type="uploader"
        v-model="giftData.Key" />
    </cell-group>

    <div :class="$style['option-btn-wrap']">
      <van-button type="primary" @click="confirm">
        确定
      </van-button>
    </div>
  </div>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';

export default {
  components: {
    CellGroup,
    Cell,
  },

  data: () => ({
    giftData: {
      Name: '',
      Key: '',
    },
  }),

  methods: {
    confirm () {
      console.log('创建奖品');
      RechargeGift.createGift(this.giftData).then(res => {
        this.$store.commit('setLinkBackData', {
          ID: res.ID,
          Name: this.giftData.Name,
        });

        this.$router.back();
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $color-bg-primary;
  overflow: hidden;
}

.option-btn-wrap {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;

  .van-button {
    width: 345px;
    margin-left: 15px;
  }
}
</style>

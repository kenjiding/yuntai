<template>
  <ych-page>
    <van-list
      v-model="isLoading"
      :finished="isFinished"
      @load="loadList">
      <div
        :class="$style['coin-item']"
        v-for="coinItem in coinList"
        :key="coinItem.ID"
        @click="() => { onItemClick(coinItem) }">
        <img :src="coinItem.ImgUrl" :class="$style['coin-item-image']"/>
        <div :class="$style['coin-item-title-wrap']">
          <div :class="$style['title']">{{ coinItem.Name }}</div>
          <div :class="$style['subtitle']">售价：¥{{ coinItem.Price | number('0,0.00') }}</div>
        </div>
        <van-icon name="arrow" size="14px" colo="#999999" />
      </div>
    </van-list>
  </ych-page>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import { List } from 'vant';

export default {
  components: {
    [List.name]: List,
  },

  data: () => ({
    coinList: [],
    isLoading: false,
    isFinished: false,
    pageIndex: 1,
  }),

  methods: {
    loadList () {
      this.isLoading = true;

      RechargeGift.coinList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        this.isLoading = false;
        if (!res.HasMore) {
          this.isFinished = true;
        }

        this.coinList = this.coinList.concat(res.Data);
      });
    },

    onItemClick (item) {
      this.$store.commit('setLinkBackData', item);
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.coin-item {
  height: 65px;
  background-color: $color-white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  margin-top: 10px;
  border-radius: $border-radius-small;
  padding: 10px;
  box-sizing: border-box;

  &-image {
    width: 40px;
    height: 40px;
    border-radius: $border-radius-small;
    margin-right: 10px;
  }

  &-title-wrap {
    flex: 1;
    font-size: 14px;

    .title {
      color: $font-color-primary;
    }

    .subtitle {
      color: $font-color-secondary;
      margin-top: 8px;
    }
  }
}
</style>

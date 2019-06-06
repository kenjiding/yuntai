<template>
  <ych-page>
    <div :class="$style['list-container']">
      <div v-if="totalCount" :class="$style['count']">
        已领取 {{ totalCount }} / 已核销 {{ writeOffCount }}
      </div>

      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="loadData">
        <div
          :class="$style['list-item']"
          v-for="data in list"
          :key="data.ID">
          <img :src="data.UserImgUrl" :class="$style['image']" v-if="data.UserImgUrl">
          <img src="@/assets/img/level-default.png" :class="$style['image']" v-else>

          <div :class="$style['title-wrap']">
            <div :class="$style['title']">
              {{ data.Name || '会员卡' }}
              <van-icon :name="genderName(data).name" :class="$style['gender']" :style="{ backgroundColor: genderName(data).color }" v-if="data.Gender !== 'Unknown'"/>
              <img src="@/assets/img/V1.png" :class="$style['level']" v-if="data.LevelNumber === 0 && !data.IsInterim">
              <img src="@/assets/img/V2.png" :class="$style['level']" v-else-if="data.LevelNumber === 1 && !data.IsInterim">
              <img src="@/assets/img/V3.png" :class="$style['level']" v-else-if="data.LevelNumber === 2 && !data.IsInterim">
              <img src="@/assets/img/V4.png" :class="$style['level']" v-else-if="data.LevelNumber === 3 && !data.IsInterim">
              <img src="@/assets/img/V5.png" :class="$style['level']" v-else-if="data.LevelNumber === 4 && !data.IsInterim">
            </div>
            <div :class="$style['subtitle']">{{ data.IsInterim ? '卡号' : '手机号' }}：{{ data.IsInterim ? data.InterimCardNumber : data.PhoneNumber }}</div>
          </div>
          <div :class="$style['item-state']">
            <div :class="$style['state']">{{ localWriteOffState[data.WriteOffState] }}</div>
            <div :class="$style['number']">{{ data.CardNumber }}</div>
          </div>
        </div>
      </van-list>
    </div>
  </ych-page>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import { EnumWriteOffState } from './config/enum';
import { List } from 'vant';

export default {
  components: {
    [List.name]: List,
  },

  data: () => ({
    pageIndex: 1,
    isLoading: false,
    isFinished: false,
    list: [],
    localWriteOffState: EnumWriteOffState,
    totalCount: null,
    writeOffCount: null,
  }),

  methods: {
    loadData () {
      this.isLoading = true;
      RechargeGift.receiveRecord({
        PageIndex: this.pageIndex++,
        PageSize: 20,
        ID: this.$route.query.id,
      }).then(res => {
        console.log(res);
        this.isLoading = false;
        if (!res.HasMore) {
          this.isFinished = true;
        }

        this.list = this.list.concat(res.Data);
        this.totalCount = res.TotalCount;
        this.writeOffCount = res.WriteOffCount;
      });
    },

    genderName (data) {
      let gender = {
        Man: {name: 'xingbienanxianxing', color: '#3296fa'},
        Woman: {name: 'xingbienvxianxing', color: '#ef5e76'},
        Unknown: {name: '', color: ''},
      };
      return gender[data.Gender];
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.list-container {
  padding: 0 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: $color-white;
  box-sizing: border-box;

  .count {
    margin-bottom: 10px;
    font-size: 14px;
    color: $font-color-secondary;
  }

  .list-item {
    height: 80px;
    padding: 10px 0;
    box-sizing: border-box;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: center;
    align-items: center;

    .image {
      width: 60px;
      height: 60px;
      border-radius: $border-radius-circle;
    }

    .title-wrap {
      flex: 1;
      margin-left: 10px;

      .title {
        font-size: 16px;
        color: $font-color-primary;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .level {
          width: 45px;
          height: auto;
          margin-left: 5px;
        }

        .gender {
          width: 23px;
          height: 15px;
          text-align: center;
          border-radius: $border-radius-small;
          font-size: $font-size-mini;
          color: $color-white;
          margin-left: 5px;
        }
      }

      .subtitle {
        color: $font-color-secondary;
        font-size: 14px;
        margin-top: 10px;
      }
    }

    .item-state {
      font-size: 12px;
      color: $font-color-secondary;
      text-align: center;

      .number {
        margin-top: 10px;
      }
    }
  }

  & .list-item:last-child {
    border-width: 0;
  }
}
</style>

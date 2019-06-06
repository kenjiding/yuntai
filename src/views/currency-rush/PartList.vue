<template>
  <ych-page>
    <div :class="$style['list-container']">
      <div v-if="personLimit" :class="$style['count']">
        限 {{ personLimit }} 人/ 参与 {{ partCount }} 人
      </div>

      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="loadData"
        v-if="list.length > 0">
        <div
          :class="$style['list-item']"
          v-for="data in list"
          :key="data.ID">
          <img :src="data.UserAvatar" :class="$style['image']" v-if="data.UserAvatar">
          <img src="@/assets/img/level-default.png" :class="$style['image']" v-else>

          <div :class="$style['title-wrap']">
            <div :class="$style['title']">
              {{ data.UserName }}
              <van-icon :name="genderName(data).name" :class="$style['gender']" :style="{ backgroundColor: genderName(data).color }" v-if="data.UserGender !== 'Unknown'"/>
              <img src="@/assets/img/V1.png" :class="$style['level']" v-if="data.UserLevel === 1 ">
              <img src="@/assets/img/V2.png" :class="$style['level']" v-else-if="data.UserLevel === 2 ">
              <img src="@/assets/img/V3.png" :class="$style['level']" v-else-if="data.UserLevel === 3 ">
              <img src="@/assets/img/V4.png" :class="$style['level']" v-else-if="data.UserLevel === 4 ">
              <img src="@/assets/img/V5.png" :class="$style['level']" v-else-if="data.UserLevel === 5 ">
            </div>
            <div :class="$style['subtitle']">手机号：{{ data.UserPhone }}</div>
          </div>
        </div>
      </van-list>

      <div v-else :class="$style['empty-page']">
        <img src="@/assets/img/empty-rg-page.png" :class="$style['icon']"/>
        <div :class="$style['text']">暂无参与</div>
      </div>
    </div>
  </ych-page>
</template>

<script>
import CurrencyRush from '@/api/CurrencyRush';
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
    personLimit: null,
    partCount: null,
  }),

  created () {
    this.loadData();
  },

  methods: {
    loadData () {
      this.isLoading = true;
      CurrencyRush.partList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
        ID: this.$route.query.id,
      }).then(res => {
        this.isLoading = false;
        if (!res.HasMore) {
          this.isFinished = true;
        }

        this.list = this.list.concat(res.Data);
        this.personLimit = res.PersonLimit;
        this.partCount = res.PartCount;
      });
    },

    genderName (data) {
      let gender = {
        Man: {name: 'xingbienanxianxing', color: '#3296fa'},
        Woman: {name: 'xingbienvxianxing', color: '#ef5e76'},
        Unknown: {name: '', color: ''},
      };
      return gender[data.UserGender];
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

.empty-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 150px;

  .icon {
    width: 200px;
    height: 180px;
  }

  .text {
    font-size: 14px;
    color: $font-color-secondary;
    text-align: center;
    margin-top: 16px;
    line-height: 20px;
  }
}
</style>

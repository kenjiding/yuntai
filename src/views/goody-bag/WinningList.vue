<template>
  <ych-page>
    <header :class="$style.header">
      <div :class="$style['search-bar']" @click="$router.push({ path: '/goody-bag-search' })">
        <van-icon name="search"/>
        手机号/姓名/快递号/微信昵称/活动/中奖订单号
      </div>
    </header>

    <van-tabs v-model="active" color="#FF9b52" sticky :class="$style['tab-container']">
      <van-tab
        v-for="tab in tabs"
        :title="tab.value === 'Waiting' ? tab.title + (winningWaitingCount > 0 ? '(' + winningWaitingCount +  ')' : '') : tab.title"
        :key="tab.title">
        <van-list
          v-if="list[tab.value].length > 0"
          v-model="isLoading[tab.value]"
          :finished="isFinished[tab.value]"
          @load="onListLoad"
          :offset="50">
            <div
              v-for="data in list[tab.value]"
              :key="data.ID"
              :class="$style['list-item']">
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">收货人：</div>
                <div :class="$style['list-item__item-value']">{{ data.Consignee }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">手机号：</div>
                <div :class="$style['list-item__item-value']">{{ data.Telephone }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">收货地址：</div>
                <div :class="$style['list-item__item-value']">{{ data.Address }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">中奖时间：</div>
                <div :class="$style['list-item__item-value']">{{ data.Time | date }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">中奖奖品：</div>
                <div :class="$style['list-item__item-value']">{{ data.GiftName }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">活动名称：</div>
                <div :class="$style['list-item__item-value']">{{ data.ActivityName }}</div>
              </div>
              <div :class="$style['list-item__item']">
                <div :class="$style['list-item__item-title']">微信昵称：</div>
                <div :class="$style['list-item__item-value']">{{ data.WechatName }}</div>
              </div>

              <van-button
                v-if="tab.value === 'Waiting'"
                plain
                type="warning"
                :class="$style['send-button']"
                @click="$router.push({ path: '/goody-bag-delivery', query: { data: JSON.stringify(data) } })">
                发货
              </van-button>
            </div>
        </van-list>

        <div v-else :class="$style['empty-page']">
          <img src="@/assets/img/empty-page.png" :class="$style['icon']"/>
          <div :class="$style['text']">当前暂无{{ tab.title }}订单</div>
        </div>
      </van-tab>
    </van-tabs>
  </ych-page>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { Toast, List } from 'vant';

export default {
  components: {
    [List.name]: List,
  },

  data: () => ({
    active: 0,
    tabs: [{
      title: '待发货',
      value: 'Waiting',
    }, {
      title: '已发货',
      value: 'Success',
    }],
    size: {
      Waiting: 0,
      Success: 0,
    },
    isLoading: {
      Waiting: false,
      Success: false,
    },
    isFinished: {
      Waiting: false,
      Success: false,
    },
    list: {
      Waiting: [],
      Success: [],
    },
    pageIndex: {
      Waiting: 1,
      Success: 1,
    },
    winningWaitingCount: 0,
  }),

  watch: {
    active (newVal) {
      console.log(newVal);
      let activeName = this.tabs[newVal].value;
      if (this.list[activeName].length === 0) {
        this.firstLoad();
      }
    },
  },

  created () {
    this.firstLoad();
    this.loadWinningListSize();
  },

  methods: {
    loadWinningListSize () {
      GoodyBag.winningWaitingCount().then(res => {
        this.winningWaitingCount = res.Count;
      });
    },

    firstLoad () {
      Toast.loading({
        mask: true,
        message: '正在加载中...',
      });

      let activeName = this.tabs[this.active].value;
      this.isLoading[activeName] = true;
      this.onListLoad();
    },

    onListLoad () {
      let activeName = this.tabs[this.active].value;
      console.log('执行列表加载', this.isLoading[this.tabs[this.active].value]);
      GoodyBag.winningList({
        State: activeName,
        PageIndex: this.pageIndex[activeName],
        PageSize: 20,
        LoadSize: this.list[activeName].length === 0,
      }).then(res => {
        Toast.clear();
        console.log(res);
        this.isLoading[activeName] = false;
        if (this.list[activeName].length === 0) {
          this.size.Waiting = res['WaitingSize'];
          this.size.Success = res['SuccessSize'];
        }

        // 返回的数据列表为0，则取消该列表的Load事件
        if (res.Data.length > 0) {
          this.pageIndex[activeName] += 1;
          this.list[activeName] = this.list[activeName].concat(res.Data);
          this.isFinished[activeName] = false;
        } else {
          this.isFinished[activeName] = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .header {
    width: 100%;
    height: 60px;
    background-color: $color-primary;
    display: flex;
    justify-content: center;
    align-items: center;

    .search-bar {
      width: 345px;
      height: 32px;
      border-radius: 32px; // stylelint-disable
      background-color: #6fcdfd;
      font-size: 12px;
      color: #caebff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;

      .van-icon {
        margin-top: -2px;
        margin-right: 5px;
      }
    }
  }

  .tab-container {
    .van-tabs__nav {
      background-color: $color-primary;

      .van-tab {
        background-color: $color-primary;
        color: $color-white;
      }
    }

    [class*=van-hairline]:after {
      border: none;
    }
  }

  .list-item {
    position: relative;
    width: 343px;
    background-color: $color-white;
    margin-left: 16px;
    margin-top: 10px;
    border-radius: $border-radius-small;
    padding: 15px;
    box-sizing: border-box;

    &__item {
      display: flex;
      font-size: 14px;
      margin-bottom: 10px;

      &-title {
        color: $font-color-secondary;
        width: 75px;
        line-height: 18px;
      }

      &-value {
        color: $font-color-primary;
        flex: 1;
        line-height: 18px;
      }
    }

    .send-button {
      position: absolute;
      right: 16px;
      bottom: 20px;
      width: 58px;
      height: 30px;
      line-height: 30px;
      padding: 0;
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

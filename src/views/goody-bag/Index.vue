<template>
  <ych-page>
    <div :class="$style['goody-bag-content']">
      <div :class="$style['goody-bag-tabs']">
        <van-tabs v-model="active" color="#007AFF" sticky>
          <van-tab
            v-for="tab in tabs"
            :title="tab.title + (size[tab.value] > 0 ? '(' + size[tab.value] +  ')' : '')"
            :key="tab.title">
            <van-list
              v-if="list[tab.value].length > 0"
              v-model="isLoading[tab.value]"
              :finished="isFinished[tab.value]"
              @load="onListLoad"
              :offset="50">
              <activity-list-item
                v-for="data in list[tab.value]"
                :key="data.ID"
                :data="data"
                :tabs="tabs"
                :active="active"
                @click="onItemClick"/>
            </van-list>

            <div v-else :class="$style['empty-page']">
              <img src="@/assets/img/empty-page.png" :class="$style['icon']"/>
              <div :class="$style['text']">当前暂无活动，<br>点击此按钮，马上添加吧</div>
              <img src="@/assets/img/point.png" :class="$style['point']"/>
            </div>
          </van-tab>
        </van-tabs>
      </div>

      <div :class="$style['bottom-line']">
        <van-button plain type="primary" @click="writeOff">兑奖核销</van-button>
        <van-button plain type="primary" @click="$router.push({ path: 'goody-bag-winning-list' })">
          <div :class="[$style['badge'], winningWaitingCount > 10 && $style['padding']]" v-if="winningWaitingCount > 0">
            <span v-if="winningWaitingCount < 100">{{ winningWaitingCount }}</span>
            <span v-else>99+</span>
          </div>
          中奖订单
        </van-button>
        <van-button type="primary" @click="showAddDialog = true">添加活动</van-button>

        <div :class="$style['float-button']" @click="$router.push({ path: '/goody-bag-intro' })">
          玩法<br>介绍
        </div>
      </div>

      <van-dialog
        v-model="showAddDialog"
        :show-confirm-button="false"
        close-on-click-overlay>
        <div :class="$style['dialog-content']">
          <div :class="$style['dialog-content__title']">请选择活动类型</div>
          <div :class="$style['dialog-content__item']" @click="() => createActivity('item')">
            <div :class="$style['dialog-content__item-title']"><van-icon name='item' color='#FFFFFF' size='18px'/> 实物礼品福袋</div>
            <div :class="$style['dialog-content__item-content']">创建实物礼品抽奖活动</div>
          </div>
          <div :class="$style['dialog-content__item']" @click="() => createActivity('cash')">
            <div :class="$style['dialog-content__item-title']"><van-icon name='cash' color='#FFFFFF' size='18px'/> 微信现金红包福袋</div>
            <div :class="$style['dialog-content__item-content']">创建微信现金红包抽奖活动</div>
          </div>
          <div :class="$style['dialog-content__item']" @click="() => createActivity('currency')">
            <div :class="$style['dialog-content__item-title']"><van-icon name='youxibihongbao' color='#FFFFFF' size='18px'/> 游戏币红包福袋</div>
            <div :class="$style['dialog-content__item-content']">创建游戏币红包抽奖活动</div>
          </div>
        </div>
      </van-dialog>
    </div>
  </ych-page>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { List, Toast, Badge, BadgeGroup } from 'vant';
import ActivityListItem from './components/ActivityListItem';

export default {
  components: {
    [List.name]: List,
    [Badge.name]: Badge,
    [BadgeGroup.name]: BadgeGroup,
    ActivityListItem,
  },

  data: () => ({
    active: 1,
    isLoading: {
      NotStart: false,
      OnGoing: false,
      Ended: false,
    },
    isFinished: {
      NotStart: false,
      OnGoing: false,
      Ended: false,
    },
    size: {
      NotStart: 0,
      OnGoing: 0,
      Ended: 0,
    },
    list: {
      NotStart: [],
      OnGoing: [],
      Ended: [],
    },
    pageIndex: {
      NotStart: 1,
      OnGoing: 1,
      Ended: 1,
    },
    tabs: [{
      title: '未开始',
      value: 'NotStart',
    }, {
      title: '进行中',
      value: 'OnGoing',
    }, {
      title: '已结束',
      value: 'Ended',
    }],
    showAddDialog: false,
    winningWaitingCount: 0,
  }),

  created () {
    this.firstLoad();
    this.loadWinningWaitingCount();
  },

  watch: {
    active (newVal) {
      console.log(newVal);
      let activeName = this.tabs[newVal].value;
      if (this.list[activeName].length === 0) {
        this.firstLoad();
      }
    },
  },

  methods: {
    loadWinningWaitingCount () {
      GoodyBag.winningWaitingCount().then(res => {
        this.winningWaitingCount = res.Count;
      });
    },

    onItemClick ({id, type}) {
      // 修改活动
      if (type.startsWith('Currency')) {
        this.$router.push({
          path: '/goody-bag-currency-detail',
          query: {
            action: 'currency',
            id,
          },
        });
      } else {
        this.$router.push({
          path: '/goody-bag-activity-create',
          query: {
            action: type.startsWith('Item') ? 'item' : 'cash',
            id,
          },
        });
      }
    },

    writeOff () {
      // 这里需要先打开微信的二维码界面采集二维码接着使用Code执行核销
      let _this = this;
      this.$_wx.ready(() => {
        this.$_wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            // 当needResult 为 1 时，扫码返回的结果
            let code = res.resultStr.indexOf(',') > -1 ? res.resultStr.split(',')[1] : res.resultStr;
            _this.$router.push({
              path: '/goody-bag-write-off',
              query: {
                code,
              },
            });
          },
          fail: function (res) {
            Toast('摄像头调取失败，微信验证存在问题');
          },
        });
      });
    },

    createActivity (action) {
      // 创建活动
      if (action === 'currency') {
        this.$router.push({
          path: '/goody-bag-currency-detail',
          query: {
            action,
          },
        });
      } else {
        this.$router.push({
          path: '/goody-bag-activity-create',
          query: {
            action,
          },
        });
      }
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
      GoodyBag.activityList({
        State: activeName,
        PageIndex: this.pageIndex[activeName],
        PageSize: 6,
        LoadSize: this.list[activeName].length === 0,
      }).then(res => {
        Toast.clear();
        console.log(res);
        this.isLoading[activeName] = false;
        if (this.list[activeName].length === 0) {
          this.size.NotStart = res['NotStartSize'];
          this.size.OnGoing = res['OnGoingSize'];
          this.size.Ended = res['EndedSize'];
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

  .goody-bag-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .goody-bag-tabs {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .van-tabs--line {
        padding-top: 0;
      }

      .van-tab__pane {
        padding-top: 50px;
      }
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

    .point {
      width: 50px;
      height: 100px;
      margin-left: 80px;
      margin-top: 50px;
    }
  }

  .bottom-line {
    position: relative;
    // height: 67px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 22px 16px 5px;

    .van-button {
      width: 105px;
      height: 40px;
      line-height: 40px;
      border-radius: $border-radius-small;
      font-size: $font-size-primary;

      .badge {
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        top: -10px;
        right: -10px;
        height: 20px;
        min-width: 20px;
        border-radius: 10px; // stylelint-disable
        background-color: $color-danger;
        color: $color-white;
        line-height: 20px;
        text-align: center;

        &.padding {
          padding: 0 10px;
        }
      }
    }

    .float-button {
      position: absolute;
      top: -80px;
      right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      background-color: $color-white;
      box-shadow: rgba(80, 79, 79, .44) 3px 3px 5px;
      border-radius: $border-radius-circle;
      font-size: 12px;
      color: $font-color-secondary;
    }
  }

  .dialog-content {
    padding: 16px 32px;

    &__title {
      font-size: 17px;
      color: $font-color-primary;
      margin-bottom: 30px;
      text-align: center;
    }

    &__item {
      width: 100%;
      height: 90px;
      background-color: $color-primary;
      color: $color-white;
      border-radius: $border-radius-small;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 16px;
      box-sizing: border-box;

      &-title {
        font-size: 16px;
        margin-bottom: 10px;
      }

      &-content {
        color: #85beff;
        font-size: 14px;
        text-align: center;
        line-height: 18px;
      }
    }
  }
</style>

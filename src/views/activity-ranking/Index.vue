<template>
  <ych-page :class="$style.page">
    <van-tabs v-model="active" color="#077AFF" @change="tabChange">
      <van-tab :title="`进行中(${processingTotal})`">

        <van-list
          v-model="processingLoading"
          :finished="processingFinished"
          finished-text="没有更多了"
          @load="getProcessingList">
          <ListItem
            v-for="item in processingList"
            :key="item.ID"
            :activity-info="item"
            :icon="false"
            @click-item="goToActivityInfo(item)"
            @click-ranking="clickRanking(item.ID)" />
        </van-list>

      </van-tab>

      <van-tab :title="`已关闭(${closeTotal})`">
        <van-list
          v-model="closeLoading"
          :finished="closeFinished"
          finished-text="没有更多了"
          @load="getCloseList">
          <ListItem
            v-for="item in closeList"
            :key="item.ID"
            :activity-info="item"
            @click-item="goToActivityInfo(item)"
            @click-ranking="clickRanking(item.ID)" />
        </van-list>
      </van-tab>

      <p
        :class="$style.rule">
        规则说明：
        <van-icon
          name="shuoming"
          @click="popupShow = true" />
      </p>
    </van-tabs>

    <description
      :show.sync="popupShow"
      title="温馨提示"
      determine="知道了">
      <p>1.进行中的活动只允许有一个；</p>
      <p>2. 新建后会在C端显示一个活动排行的入口</p>
      <p>3.统计活动有效期内的会员中奖记录并按由高到低排序</p>
      <p>4.如何在电视端显示排行</p>
      <span>(1)联系客服下载并安装电视端APP</span>
      <span>(2)打开电视端APP进入扫码登录界面</span>
      <span>(3)在B端活动排行功能下，点击扫码登录即可</span>
    </description>

    <div
      :class="$style.button">
      <div>
        <van-button
          type="primary"
          size="small"
          @click="scanQrCode">连接大屏</van-button>
      </div>

      <div>
        <van-button
        size="small"
        type="primary"
        :disabled="buttonDisabled"
        @click="$router.push('/add-activity')">新建</van-button>
      </div>

    </div>
  </ych-page>
</template>

<script>
import { Tab, Tabs, List, Toast } from 'vant';
import wx from 'weixin-js-sdk';
import description from '@/views/member/components/Description';
import ListItem from './components/ListItem';
import ActivityRanking from '@/api/ActivityRanking';

export default {
  name: '',

  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [List.name]: List,
    description,
    ListItem,
  },

  data () {
    return {
      active: '',
      popupShow: false,
      processingList: [],
      closeList: [],
      processingFinished: false,
      processingLoading: false,
      pageIndex: 0,

      closeLoading: false,
      closeFinished: false,
      processingTotal: 0,
      closeTotal: 0,
    };
  },

  computed: {
    buttonDisabled () {
      return this.processingTotal > 0;
    },
  },

  created () {
    this.getProcessingList();
    this.getCloseList();
  },

  methods: {
    clickRanking (id) {
      this.$router.push({
        path: '/activity-sort',
        query: {
          ID: id,
        },
      });
    },
    scanQrCode () {
      // let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let result = res.resultStr.split(':')[1] || '';
            ActivityRanking.postQrCodeInfo({
              QrCodeStr: result,
            }).then((res) => {
              Toast('扫码成功');
            });
          },
          fail: function (res) {
            Toast.fail('摄像头调取失败，请重新扫描');
          },
        });
      });
    },
    goToActivityInfo (data) {
      let path;
      if (data.Status === 'NotStart') {
        path = '/edit-activity';
      } else {
        path = '/activity-info';
      }
      this.$router.push({
        path: path,
        query: {
          ID: data.ID,
        },
      });
    },
    tabChange (index) {
      this.pageIndex = 0;

      if (index === 1) {
        this.closeList = [];
        this.closeFinished = false;

        this.getCloseList();
      } else if (index === 0) {
        this.processingList = [];
        this.processingFinished = false;

        this.getProcessingList();
      }
    },

    getProcessingList (index) {
      this.processingLoading = true;
      this.pageIndex++;
      ActivityRanking.getRankingList({
        PageIndex: this.pageIndex,
        PageSize: 10,
        IsProcessing: true,
      }).then((res) => {
        this.processingLoading = false;

        this.processingTotal = res.Total;

        this.processingList = this.processingList.concat(res.Data);

        if (!res.IsHasData) {
          this.processingFinished = true;
        }
      }, () => {
        this.processingLoading = false;
      });
    },

    getCloseList (index) {
      this.closeLoading = true;
      this.pageIndex++;
      ActivityRanking.getRankingList({
        PageIndex: this.pageIndex,
        PageSize: 10,
        IsProcessing: false,
      }).then((res) => {
        this.closeLoading = false;
        this.closeTotal = res.Total;

        this.closeList = this.closeList.concat(res.Data);

        if (!res.IsHasData) {
          this.closeFinished = true;
        }
      }, () => {
        this.closeLoading = false;
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.button {
  position: fixed;
  bottom: 10px;
  display: flex;
  width: 100%;

  .van-button {
    width: 100%;
    height: 40px;
    font-size: $font-size-special;
  }

  div {
    margin: 0 5px;

    &:nth-child(1) {
      flex: 3;
    }

    &:nth-child(2) {
      flex: 6;
    }
  }
}

.page {
  .van-tabs__content {
    background-color: $color-bg-secondary;
  }

  .van-tabs__wrap {
    position: fixed;
    margin-bottom: 10px;
  }
}

.rule {
  padding: 15px;
  color: $font-color-secondary;
  margin-bottom: 90px;

  .van-icon-shuoming {
    color: $color-warning;
  }
}

</style>

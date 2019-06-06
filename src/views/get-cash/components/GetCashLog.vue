<template>
  <div :class="$style.getCashLogWrap">
    <van-nav-bar
        title="提现记录"
        left-arrow
        :class="$style.cashWrapNavBar"
        @click-left="$emit('closeLogPage')" />
    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(item,index) in logsListData"
        :key="index"
        :title="item.date"
        :name="index">
        <van-list
          v-model="loading"
          v-for="(logListItem, listIndex) in item.logList"
          :key="listIndex"
          :finished="finished"
        >
          <van-row :title="logListItem.getCashTime" >
            <van-col :span="12">{{logListItem.money}}</van-col>
            <van-col :span="12">{{logListItem.getCashTime}}</van-col>
          </van-row>
        </van-list>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem, List } from 'vant';
import getCashApi from '@/api/GetCash';
export default {
  name: 'getCashLogPage',
  data () {
    return {
      activeNames: ['2'],
      logsListData: [],
      loading: false,
      finished: true,
    };
  },

  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
    'van-list': List,
  },

  methods: {},

  created: function () {
    getCashApi.getCashLog({'UserID': 123, 'TenantName': 456}).then((res) => {
      this.logsListData = res.logs;
    });
  },

  mounted: function () {
    // if (/Android/.test(navigator.appVersion)) {
    //   window.addEventListener('resize', function () {
    //     if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
    //       document.activeElement.scrollIntoView();
    //     }
    //   });
    // }
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.getCashLogWrap {
  width: 100%;
  height: 100%;

  .van-collapse {
    position: relative;
    top: 76px;

    .van-collapse-item {
      .van-cell__value {
        color: $color-primary;
        font-size: 16px;
        font-weight: 550;
      }

      .van-collapse-item__content {
        padding: 0;

        .van-list {
          padding: 10px 17px;
        }
      }

      .van-row {
        .van-col {
          font-size: 13px;
          color: $font-color-secondary;

          &:last-of-type {
            text-align: right;
          }
        }
      }
    }
  }

  .cashWrapNavBar {
    background-color: $color-primary;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;

    .van-icon {
      color: $color-white;
      font-size: $font-size-regular;
    }

    .van-nav-bar__title {
      color: $color-white;
    }

    .van-nav-bar__text {
      color: $color-white;
    }
  }
}
</style>

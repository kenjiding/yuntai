<template>
    <van-list
      v-model="loading"
      :finished="finished"
      :offset=550
      @load="onLoad">
        <div :class="$style['template-content']">
          <template v-for="log in logList">
            <div
            :key="log.ID"
            :class="$style['template-cell']">
              <div :class="$style['log-top']">
                <div>
                  <p :class="$style.time">{{log.LogTime}}</p>
                  <p :class="$style.name">操作人：{{log.Operator}}</p>
                </div>
              </div>
              <div :class="$style['log-bottom']">
                <div :class="$style.Amount">
                  <p>•补币数量：{{log.CompensateAmount}}币</p>
                </div>
              </div>
            </div>
          </template>
        </div>
    </van-list>
</template>
<script>
import CustomerAppeal from '@/api/CustomerAppeal';
import {List} from 'vant';

export default {
  components: {
    [List.name]: List,
  },

  props: {
    deviceID: {
      type: String,
    },
  },

  data: () => ({
    loading: false,
    finished: false,
    logList: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  }),

  created () {
    this.onLoad();
  },

  methods: {
    onLoad: function () {
      this.pageSize++;
      CustomerAppeal.getCompensateLogs({
        DeviceID: this.deviceID,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.logList.push({
            ID: item.ID,
            LogTime: item.LogTime,
            Operator: item.Operator,
            CompensateAmount: item.CompensateAmount,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.TotalCount) {
          this.finished = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .template-content {
    width: 100%;
    //height: 426px;
    overflow: scroll;
  }

  .template-cell {
    width: 335px;
    margin: 0 auto 20px;
    border: solid 1px $color-info;
  }

  .log-top {
    flex: 1;
    margin: 6px 20px 0;
    font-size: $font-size-special;
    height: 40px;

    div {
      width: 100%;
      float: left;
    }

    .time {
      @include ellipsis(1);

      width: 240px;
      font-size: $font-size-special;
    }

    .name {
      @include ellipsis(1);

      width: 240px;
      margin-top: 5px;
      color: $font-color-secondary;
      font-size: $font-size-special;
    }
  }

  .log-bottom {
    font-size: $font-size-primary;
    color: $font-color-regular;
    background-color: rgb(98%, 98%, 98%);

    .Amount {
      padding-top: 10px;
      height: 36px;

      p {
        width: 140px;
        float: left;
        margin: 8px 0 8px 20px;
        font-size: $font-size-primary;
        color: $font-color-regular;
      }
    }
  }
</style>

<template>
  <div :class="$style.main">
    <van-list
      v-model="loading"
      :finished="finished"
      :offset=550
      @load="onLoad">
        <div :class="$style['template-content']">
          <template
            v-for="log in logList">
            <div
            :key="log.ID"
            :class="$style['template-cell']">
              <div
              :class="$style['log-top']"
              @click="$emit('cell-click',log.ID)">
                <div>
                  <p :class="$style.time">{{log.LogTime|date}}</p>
                  <p :class="$style.name">{{log.CustomerName}}</p>
                </div>
                <div :class="{
                  [$style.tip]: true,
                  [$style['tip--complete']]: log.State=='Completed'
                  }">
                  {{getStateChs(log.State)}}</div>
              </div>
              <div :class="$style['log-bottom']">
                <div :class="$style.Amount">
                  <p>•交易数：{{log.CoinInAmount}}</p>
                  <p v-show="log.CompensateAmount>0">•已补：{{log.CompensateAmount}}</p>
                </div>
                <div v-show="log.State!='Cancel'" :class="$style.action">
                  <van-button
                  type="default"
                  size="small"
                  :class="$style.compensate"
                  @click="onClickCompensate(1,log)">补币给会员</van-button>
                  <van-button
                  type="default"
                  size="small"
                  v-if="device.State=='Online'"
                  :class="$style.compensate"
                  @click="onClickCompensate(2,log)">补币到设备</van-button>
                </div>
              </div>
            </div>
          </template>
        </div>
    </van-list>

    <ych-dialog
      v-model="showCompensate"
      :title="compensateType == 1?'补币给会员':'补币到设备'"
      message='请输入补币数量后确认补币'
      show-confirm-button
      show-cancel-button
      :before-close="compensateAction"
      :class="$style.compensateDialog"
    >
    <p :class="$style['dialog-content']">请输入补币数量后确认补币</p>
      <van-field
        v-model="compensateAmount"
        type="number"
        :precision="0">
        <p slot="icon">币</p>
      </van-field>
    </ych-dialog>
  </div>
</template>
<script>
import CustomerAppeal from '@/api/CustomerAppeal';
import {List, Toast} from 'vant';

export default {
  components: {
    [List.name]: List,
  },

  props: {
    device: Object,
  },

  data: () => ({
    loading: false,
    finished: false,
    logList: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    showCompensate: false,
    compensateType: 1,
    selectedLog: [],
    compensateAmount: '',
    competed: false,
    loopCount: 1,
  }),

  computed: {

  },

  created () {
    this.onLoad();
  },

  methods: {
    onLoad: function () {
      this.pageIndex++;
      this.loading = true;
      CustomerAppeal.getCoinInLogs({
        DeviceID: this.device.ID,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.logList.push({
            ID: item.ID,
            LogTime: item.LogTime,
            CustomerName: item.CustomerName,
            CoinInAmount: item.CoinInAmount,
            CompensateAmount: item.CompensateAmount,
            State: item.State,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },
    numberLimit (val) {
      if (val.length > 9) {
        this.compensateAmount = val.slice(0, 9);
      }
    },
    getStateChs (state) {
      switch (state) {
      case 'Completed':
        return '已完成';
      case 'Returning':
        return '退款中';
      case 'Returned':
        return '已退款';
      }
    },
    onClickCompensate: function (type, log) {
      this.compensateType = type;
      this.showCompensate = true;
      this.selectedLog = log;
      this.compensateAmount = log.CoinInAmount;
    },
    compensateAction: function (action, done) {
      if (action === 'confirm') {
        if (this.compensateType === 1) {
          CustomerAppeal.compensateToLeaguer({
            ID: this.selectedLog.ID,
            CompensateAmount: this.compensateAmount,
          }).then(res => {
            if (res.IsSuccess) {
              this.selectedLog.CompensateAmount += Number(this.compensateAmount);
              Toast('远程补币成功');
            } else {
              Toast('远程补币失败');
            }
          });
          done();
          this.showCompensate = false;
        } else if (this.compensateType === 2) {
          CustomerAppeal.compensateToDevice({
            ID: this.selectedLog.ID,
            CompensateAmount: this.compensateAmount,
          }).then(res => {
            if (res.IsSuccess) {
              // this.selectedLog.CompensateAmount += Number(this.compensateAmount);
              // Toast('远程补币成功');
              this.startCyclicQuery(res.ID);
            } else {
              Toast('远程补币失败');
            }
          });
          done();
          this.showCompensate = false;
        }
      } else {
        done();
        this.showCompensate = false;
      }
    },

    startCyclicQuery (id) {
      Toast.loading({
        mask: true,
        message: '启动中...',
        duration: 0,
      });
      this.competed = false;
      this.loopCount = 1;
      this.cyclicQueryPayResult(id);
    },

    cyclicQueryPayResult (id) {
      if (!this.competed && this.loopCount <= 5) {
        this.loopCount++;
        this.timeouter = setTimeout(() => {
          this.queryPayResult(id);
        }, 2000);
      } else if (this.loopCount > 5) {
        this.competed = true;
        Toast.fail({
          message: '启动超时',
          duration: 1000,
          mask: true,
        });
      }
    },

    queryPayResult (id) {
      CustomerAppeal.getCompensateResult({
        ID: id,
      }).then(res => {
        if (res.State === 'Success') {
          this.competed = true;
          this.selectedLog.CompensateAmount += Number(this.compensateAmount);
          Toast.success({message: '启动成功', mask: true});
        } else if (res.State === 'Fail') {
          this.competed = true;
          Toast.fail({
            message: '启动失败：' + res.UnSuccessMsg,
            mask: true,
            duration: 1000});
        }
        this.cyclicQueryPayResult(id);
      }).catch(ex => {
        this.competed = true;
        //this.cyclicQueryPayResult(id);
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .main {
    height: 100%;
    background-color: $color-bg-primary;
  }

  .template-content {
    width: 100%;
    padding-top: 18px;
    overflow: scroll;
    background-color: $color-bg-primary;
  }

  .template-cell {
    width: 335px;
    margin: 0 auto 18px;
    border: solid 1px $color-info;
  }

  .log-top {
    flex: 1;
    padding: 6px 20px 0;
    font-size: $font-size-special;
    height: 40px;
    background-color: $color-white;

    div {
      width: 50%;
      float: left;
    }

    .tip {
      width: 60px;
      height: 16px;
      font-size: $font-size-special;
      color: $font-color-secondary;
      background-color: $color-info;
      border-radius: $border-radius;
      float: right;
      padding-top: 6px;
      text-align: center;

      &--complete {
        background-color: $color-success;
        color: $color-white;
      }
    }
  }

  .time {
    @include ellipsis(1);

    width: 140px;
    height: 14px;
    //font-size: $font-size-special;
  }

  .name {
    @include ellipsis(1);

    width: 140px;
    margin-top: 5px;
    color: $font-color-secondary;
    height: 14px;
    //font-size: $font-size-special;
  }

  .log-bottom {
    font-size: $font-size-primary;
    color: $font-color-regular;
    background-color: rgb(98%, 98%, 98%);

    .action {
      height: 40px;

      .compensate {
        border-color: $color-primary;
        color: $color-primary;
      }
    }

    .action .van-button {
      width: 150px;
      margin-left: 12px;
      border-radius: $border-radius;
      font-size: $font-size-primary;
    }

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

  .cancelDialog {
    border-radius: $border-radius;
    border: 2px solid $color-danger;

    .van-dialog__header {
      padding: 16px 0;
      border: 1px solid $color-info;
    }

    .van-dialog__content {
      font-size: $font-size-primary;
      color: $color-info;
    }

    .van-dialog__cancel {
      background-color: $color-info;
    }

    .van-dialog__confirm {
      background-color: $color-danger;
      color: $color-white;
    }
  }

  .compensateDialog {
    text-align: center;

    .dialog-content {
      font-size: $font-size-primary;
      color: $font-color-regular;
      margin-top: 20px;
    }

    .van-field {
      width: 220px;
      height: 52px;
      border: 1px solid;
      border-color: $border-color;
      border-radius: $border-radius;
      margin: 20px auto 30px;
      font-size: $font-size-primary;
      background-color: $color-bg-regular;

      .van-field__icon {
        padding: 0;
      }

      input {
        background-color: $color-bg-regular;
        line-height: 30px;
      }

      p {
        color: $font-color-secondary;
      }
    }
  }
</style>

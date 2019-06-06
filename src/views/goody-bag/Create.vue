<template>
  <ych-page :class="$style['container']">
    <cell-group header="基本信息" noPadding>
      <cell
        title="活动名称"
        cell-type="input"
        v-model="detail.Name"
        :disabled="isEdit && detail.EditState === 'Not'"/>

      <cell
        title="开始时间"
        cell-type="datetime"
        :value="detail.StartTime"
        @dateConfirm="value => setTime(value, 'StartTime')"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="结束时间"
        cell-type="datetime"
        :value="detail.EndTime"
        @dateConfirm="value => setTime(value, 'EndTime')"
        :disabled="isEdit && detail.EditState === 'Not'"/>

      <van-cell
        title="活动介绍"
        :class="$style['introduction-cell']"
        :value="introduction || '请输入'"
        @click="introductionShow = true"
        is-link
        :disabled="isEdit && detail.EditState === 'Not'"/>
    </cell-group>

    <cell-group header="奖品信息" noPadding>
      <cell
        :title="currentAction === 'item' ? '兑奖方式' : '红包模式'"
        cell-type="radio-group"
        :subtitle="radioDesc"
        v-model="detail.ActivityType"
        :radios="radios"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash' && detail.ActivityType === 'CashFixed'"
        title="单个红包金额"
        cell-type="number"
        placeholder="可输入1元-200元"
        v-model="detail.FixedAmount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash' && detail.ActivityType === 'CashRandom'"
        title="单个红包金额"
        cell-type="range"
        :value="[this.detail.MinAmount, this.detail.MaxAmount]"
        placeholder="可输入1元-200元"
        @change="onAmountChange"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash'"
        title="红包数量"
        cell-type="number"
        v-model="detail.TotalCount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash' && detail.ActivityType === 'CashRandom'"
        title="红包总金额"
        cell-type="number"
        v-model="detail.TotalAmount"
        placeholder="请输入红包总金额，单位为元"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash'"
        title="福袋码总数量"
        subtitle="代表商家需要的抽奖二维码总数量"
        cell-type="number"
        v-model="detail.TotalCodeCount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        v-if="currentAction === 'cash'"
        title="商家名称"
        cell-type="input"
        v-model="detail.CustomerName"
        :disabled="isEdit && detail.EditState === 'Not'"/>

      <cell
        v-if="currentAction === 'cash'"
        title="红包祝福语"
        cell-type="input"
        v-model="detail.BlessStatements"
        :disabled="isEdit && detail.EditState === 'Not'"/>

      <cell
        v-if="currentAction === 'cash'"
        title="客服电话"
        subtitle="手机号或固定电话，固话需携带分隔符“-”"
        cell-type="input"
        v-model="detail.CustomerServicePhone"
        :disabled="isEdit && detail.EditState !== 'All'"/>
    </cell-group>

    <cell-group
      noPadding
      :expand="index > 0 ? 'remove-circle' : 'no-icon'"
      v-for="(gift, index) in detail.GiftList"
      :key="'gift_key_' + index"
      @onExpandClick="() => {removeCurrentGift(index)}">
      <cell
        :title="'奖品' + (index + 1)"
        cell-type="input"
        v-model="gift.Name"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="奖品数量"
        cell-type="number"
        v-model="gift.Amount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="上传奖品图片"
        cell-type="uploader"
        v-model="gift.Key"
        :disabled="isEdit && detail.EditState !== 'All'"/>
    </cell-group>

    <cell-group
      v-if="currentAction === 'item'"
      noPadding
      expand="add-circle"
      @click.native='onAddGiftClick'>
      <cell
        title="添加奖品"
        cell-type="button"
        :disabled="isEdit && detail.EditState !== 'All'"/>
    </cell-group>

    <cell-group
      v-if="currentAction === 'item'"
      noPadding>
      <cell
        title="福袋码总数量"
        subtitle="代表商家需要的抽奖二维码总数量"
        cell-type="number"
        v-model="detail.TotalCodeCount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="客服电话"
        subtitle="手机号或固定电话，固话需携带分隔符“-”"
        cell-type="input"
        v-model="detail.CustomerServicePhone"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="兑奖地址"
        cell-type="text"
        v-if="detail.ActivityType === 'ItemInvite'"
        v-model="detail.GavingAddress"
        placeholder="请输入兑奖地址"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        title="电子邮箱地址"
        subtitle="用于接受用户中奖地址邮件"
        cell-type="input"
        v-if="detail.ActivityType === 'ItemMail'"
        v-model="detail.EmailAddress"
        :disabled="isEdit && detail.EditState !== 'All'"/>
    </cell-group>

    <div :class="$style['item-tips']">
      <span v-if="disableSubmit">请先完善表单中具体信息</span>
      <span v-else>您将会获得{{ detail.TotalCodeCount }}个福袋二维码，其中{{ giftCount }}个是{{ currentAction === 'item' ? '礼品奖品' : '现金红包' }}</span>
    </div>

    <!-- 红包订单的订单明细界面 -->
    <div :class="$style['order-detail']" v-if="currentAction === 'cash'">
      <div :class="$style.header">订单明细</div>
      <div :class="$style.item">
        <div :class="$style.title">红包充值金额</div>
        <div :class="$style.value">{{ orderMoney | number('0,0.00') }}</div>
      </div>

      <div :class="$style.item">
        <div :class="$style.title">微信支付服务费(红包充值金额0.6%)</div>
        <div :class="$style.value">{{ orderFee | number('0,0.00') }}</div>
      </div>

      <div :class="$style.item">
        <div :class="$style.title">合计</div>
        <div :class="$style.value">{{ totalMoney | number('0,0.00') }}</div>
      </div>

      <div :class="[$style.item, $style['red-tips']]" v-if="currentAction === 'cash' && detail.EditState === 'Not' && Number(detail.RefundAmount) > 0">
        <div :class="$style.title">退款</div>
        <div :class="$style.value">{{ detail.RefundAmount | number('0,0.00') }}</div>
      </div>

      <div :class="$style.link" @click="showDescDialog = true">了解一下微信支付服务费</div>
    </div>
    <!-- 红包订单的订单明细界面 -->

    <div :class="$style['submit-container']"  v-if="currentAction === 'cash' && (!isEdit || detail.PaymentState === 'Waiting') && detail.EditState !== 'Not'">
      <div :class="$style['count-money']">
        合计：{{ totalMoney | number('0,0.00') }}
      </div>
      <van-button type="primary" plain @click="activityCancel" v-if="currentAction === 'cash' && isEdit && detail.PaymentState === 'Waiting'">
        取消活动
      </van-button>
      <van-button type="primary" :disabled="disableSubmit" @click="submit">
        {{ detail.PaymentState === 'Waiting' ? '充值' : '充值并创建活动' }}
      </van-button>
    </div>

    <van-button
      type="primary"
      v-if="currentAction === 'item' && !isEdit"
      :class="$style.submitButton"
      :disabled="disableSubmit"
      @click="submit">
      完成
    </van-button>

    <div :class="$style['button-wrap']" v-if="(isEdit && detail.PaymentState !== 'Waiting') || detail.EditState === 'Not'">
      <van-button
        type="primary"
        plain
        :class="$style.submitButton"
        v-if="detail.EditState !== 'Not'"
        :disabled="disableSubmit"
        @click="() => acticityUpdate()">
        完成修改
      </van-button>

      <van-button
        type="primary"
        :class="[
          $style.submitButton,
          currentAction === 'cash' && detail.EditState !== 'All' && $style['disabled']
        ]"
        v-if="detail.EditState !== 'Not'"
        @click="() => activityCancel()">
        {{ detail.EditState === 'All' ? '取消活动' : '结束活动' }}
      </van-button>

      <van-button
        type="primary"
        :class="$style.submitButton"
        v-if="detail.EditState === 'Not'"
        @click="$router.back()">
        返回
      </van-button>
    </div>

    <!-- <cell-group
      noPadding>
      <cell
        title="GUID"
        cell-type="text"
        v-model="testID"/>
    </cell-group>

    <van-button type="primary" @click="pay">
        支付
    </van-button> -->

    <van-dialog
      v-model="showDescDialog"
      :show-confirm-button="false"
      close-on-click-overlay
      :class="$style['dialog-content']">
      <div :class="$style['dialog-content__title']">微信支付服务费说明</div>
      <div :class="$style['dialog-content__subtitle']">本服务费为微信支付服务费，由微信官方收取，费率为0.6%。如果发生退款，对应退款金额的服务费也会原路退回。</div>

      <van-button type="primary" @click="showDescDialog = false">关闭</van-button>
    </van-dialog>

    <van-popup
      v-model="introductionShow"
      :class="$style['introduction-popup']"
      position="right">
      <Introduction
        @close="closeIntroduction"
        :placeholder="defualtIntroduction"
        placeholder-defualt
        :introduction-show="introductionShow"
        :value="introduction"/>
    </van-popup>

  </ych-page>
</template>

<script>
import { Toast, Popup } from 'vant';
import _ from 'lodash';
import GoodyBag from '@/api/GoodyBag';
import Dialog from '@/components/global/dialog';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Introduction from '@/components/Introduction';
import { checkFormat, checkEmpty } from './utils/Check';

export default {
  components: {
    [Popup.name]: Popup,
    CellGroup,
    Cell,
    Introduction,
  },

  created () {
    this.currentAction = this.$route.query.action;
    this.radios = this[this.currentAction + 'Radios'];
    this.currentID = this.$route.query.id;
    if (this.currentID) {
      this.isEdit = true;
      this.asyncGetDetail();
    } else {
      this.detail = this[this.currentAction + 'Detail'];
    }
  },

  data: () => ({
    showDescDialog: false,
    currentAction: '',
    currentID: '',
    isEdit: false,
    currentOrderId: '',
    orderMoney: '', // 微信支付总价
    orderFee: '', // 微信支付手续费
    detail: {},
    itemDetail: {
      Name: undefined,
      StartTime: undefined,
      EndTime: undefined,
      // Description: undefined,
      ActivityType: 'ItemInvite',
      GiftList: [{
        Name: '',
        Amount: '',
        Key: '',
      }],
      TotalCodeCount: undefined,
      GavingAddress: undefined,
      EmailAddress: undefined,
      CustomerServicePhone: undefined,
    },
    cashDetail: {
      Name: undefined,
      StartTime: undefined,
      EndTime: undefined,
      // Description: undefined,
      ActivityType: 'CashFixed',
      FixedAmount: undefined,
      MinAmount: undefined,
      MaxAmount: undefined,
      TotalCount: undefined, // 红包总数量
      TotalAmount: undefined, // 红包总金额
      TotalCodeCount: undefined,
      CustomerName: undefined, // 商家姓名
      BlessStatements: undefined, // 祝福语句
      CustomerServicePhone: undefined,
    },
    radios: [],
    itemRadios: [{
      name: '到店兑奖',
      value: 'ItemInvite',
      desc: '中奖者到店兑奖, 由商家进行核销。',
    }, {
      name: '实物邮寄',
      value: 'ItemMail',
      desc: '中奖者填写地址, 由商家进行邮寄。',
    }],
    cashRadios: [{
      name: '固定金额',
      value: 'CashFixed',
    }, {
      name: '随机金额',
      value: 'CashRandom',
    }],
    introductionShow: false,
    defualtIntroduction: `1.活动对象：所有消费者\n2.活动规则：\na.每个福袋码（二维码）的奖品一经领取，不做退换。\r\nb.获得的奖品不提供发票。\r\nc.通过恶意破解等方式获取的奖品，商家有权利不予以兑奖。\r\n3.活动所有解析权归商家所有。`,
    introduction: '',
  }),

  computed: {
    radioDesc () {
      if (this.currentAction === 'cash') {
        return '';
      } else {
        let radioInfo = this.radios.find(item => item.value === this.detail.ActivityType);
        return radioInfo && radioInfo.desc;
      }
    },

    totalMoney () {
      return this.orderMoney ? this.orderMoney + this.orderFee : '-';
    },

    disableSubmit () {
      return checkEmpty(this.detail, this.currentAction);
    },

    giftCount () {
      if (this.currentAction === 'item') {
        return _.sumBy(this.detail.GiftList, item => item.Amount);
      } else {
        return this.detail.TotalCount;
      }
    },
  },

  watch: {
    'detail.FixedAmount': function (newVal) {
      this.countOrderMoney(newVal);
    },
    'detail.TotalAmount': function (newVal) {
      this.countOrderMoney(newVal);
    },
    'detail.TotalCount': function (newVal) {
      this.countOrderMoney(newVal);
    },
    'detail.ActivityType': function (newVal) {
      this.countOrderMoney(newVal);
    },
  },

  methods: {
    acticityUpdate (orderId) {
      // 活动修改
      if (checkFormat(this.detail, this.currentAction)) {
        if (this.introduction) {
          this.detail.Description = this.introduction;
        } else {
          this.detail.Description = this.defualtIntroduction;
        }

        Toast.loading({
          message: '正在修改活动',
          duration: 0,
          mask: true,
        });

        if (this.currentAction === 'item') {
          // 这里需要把图片中的 Key 的 url 去除
          this.removeUrlFromKey();

          GoodyBag.itemUpdate({
            ID: this.currentID,
            ItemDetail: this.detail,
          }).then(res => {
            Toast.success('修改成功');
            this.$router.back();
          });
        } else {
          GoodyBag.cashUpdate({
            ID: this.currentID,
            CashDetail: this.detail,
          }).then(res => {
            Toast.success('修改成功');
            if (orderId) {
              this.pay(orderId);
            } else {
              this.$router.back();
            }
          });
        }
      }
    },

    removeUrlFromKey () {
      this.detail.GiftList = this.detail.GiftList.map(item => {
        console.log(item);
        if (item.Key && item.Key.includes('http')) {
          item.Key = item.Key.substring(item.Key.lastIndexOf('/') + 1, item.Key.indexOf('?') > -1 ? item.Key.indexOf('?') : undefined);
        }
        return item;
      });
    },

    activityCancel () {
      if (this.currentAction === 'cash' && this.detail.EditState !== 'All') {
        Toast('当前活动不可取消');
        return;
      }

      // 活动取消
      Dialog.alert({
        title: '提示',
        theme: 'primary',
        message: '活动取消后无法恢复，确定需要取消活动吗？',
        showCancelButton: true,
      }).then(() => {
        Toast.loading({
          duration: 0,
          message: '正在取消活动',
          mask: true,
        });

        GoodyBag.cancel({
          ID: this.currentID,
          Type: this.detail.ActivityType,
        }).then(res => {
          Toast.success('活动取消成功');
          this.$router.back();
        });
      });
    },

    submit () {
      if (checkFormat(this.detail, this.currentAction)) {
        if (this.introduction) {
          this.detail.Description = this.introduction;
        } else {
          this.detail.Description = this.defualtIntroduction;
        }

        if (this.currentAction === 'item') {
          Toast.loading({
            message: '正在创建活动',
            duration: 0,
            mask: true,
          });
          GoodyBag.itemCreate({
            ItemDetail: this.detail,
          }).then(res => {
            Toast.success('创建成功');
            this.$router.back();
          });
        } else {
          if (this.currentOrderId) {
            this.acticityUpdate(this.currentOrderId);
          } else {
            Toast.loading({
              message: '正在创建活动',
              duration: 0,
              mask: true,
            });
            GoodyBag.cashCreate({
              CashDetail: this.detail,
            }).then(res => {
              this.currentOrderId = res.ID;
              this.currentID = res.ID;
              this.pay(res.ID);
            });
          }
        }
      }
    },

    pay (ID) {
      Toast.loading({
        message: '支付中',
        duration: 0,
        mask: true,
      });

      let _this = this;
      GoodyBag.pay({
        ID,
      }).then(res => {
        window.$_wx.ready(() => {
          window.$_wx.chooseWXPay({
            timestamp: res.TimeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.NonceStr, // 支付签名随机串，不长于 32 位
            package: res.Package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.PaySign, // 支付签名
            success: (payResult) => {
              // 查询支付结果
              _this.searchPayResult(res.OrderID);
            },
            cancel: () => {
              Toast.fail('支付取消');
            },
            fail: (err) => {
              console.error(err);
              Toast.fail('支付失败');
            },
          });
        });
      });
    },

    searchPayResult (orderId) {
      GoodyBag.payResult({
        OrderID: orderId,
      }).then(res => {
        console.log(res);
        if (res.State === 'Waiting') {
          this.searchPayResult(orderId);
        } else if (res.State === 'Success') {
          Toast.success('支付成功');
          this.$router.back();
        } else {
          Toast.fail('支付失败');
        }
      });
    },

    // 计算当前红包活动需要的总价格
    countOrderMoney () {
      if (this.currentAction === 'cash') {
        if (this.detail.ActivityType === 'CashFixed') {
          // 固定红包
          if (this.detail.FixedAmount && this.detail.TotalCount) {
            this.orderMoney = this.detail.FixedAmount * this.detail.TotalCount;
            this.orderFee = this.orderMoney * 6 / 1000;
          }
        } else {
          // 随机红包
          if (this.detail.TotalAmount) {
            this.orderMoney = this.detail.TotalAmount;
            this.orderFee = this.orderMoney * 6 / 1000;
          }
        }
      }
    },

    setTime (value, field) {
      this.detail[field] = new Date(value).getTime();
      console.log(this.detail[field]);
    },

    // 当前模式为红包随机，并且金额发生变化
    onAmountChange ({min, max}) {
      this.detail.MinAmount = min;
      this.detail.MaxAmount = max;
    },

    // 添加奖品的按钮点击
    onAddGiftClick () {
      if (this.isEdit && this.detail.EditState !== 'All') {
        Toast('当前活动已经开始或结束，不能添加商品');
        return;
      }

      this.detail.GiftList.push({
        Name: '',
        Amount: '',
        Key: '',
      });
    },

    // 删除当前的礼物行
    removeCurrentGift (index) {
      console.log(index);
      this.detail.GiftList.splice(index, 1);
    },

    asyncGetDetail () {
      Toast.loading({
        message: '加载中',
        mask: true,
        duration: 0,
      });

      if (this.currentAction === 'item') {
        GoodyBag.itemDetail({
          ID: this.currentID,
        }).then(res => {
          Toast.clear();
          this.detail = res.ItemDetail;
          this.introduction = res.ItemDetail.Description;
        });
      } else {
        GoodyBag.cashDetail({
          ID: this.currentID,
        }).then(res => {
          Toast.clear();
          this.detail = res.CashDetail;
          this.currentOrderId = this.currentID;
          this.introduction = res.CashDetail.Description;
          this.countOrderMoney();
        });
      }
    },

    closeIntroduction (val) {
      this.introductionShow = false;
      if (val) {
        this.introduction = val;
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .container {
    -webkit-overflow-scrolling: touch;
  }

  .submitButton {
    width: 100%;
    border-radius: 0;

    &.disabled {
      background-color: $font-color-secondary;
      border-color: $font-color-secondary;
    }
  }

  .submit-container {
    display: flex;
    justify-content: space-between;

    .count-money {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $color-white;
      color: $color-primary;
      text-align: center;
    }

    .van-button {
      flex: 1;
      border-radius: 0;
    }
  }

  .item-tips {
    width: 100%;
    color: $font-color-secondary;
    text-align: center;
    margin: 50px 0 10px;
    font-size: 12px;
  }

  .order-detail {
    background-color: $color-white;
    margin-bottom: 10px;
    color: $font-color-secondary;
    padding: 16px;
    font-size: 16px;

    .header {
      margin-bottom: 20px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      font-size: 12px;

      &.red-tips {
        color: #ee494a; // stylelint-disable
      }

      .value {
        color: $font-color-primary;
      }
    }

    .link {
      text-decoration: underline;
      color: #ee494a;
      font-size: 12px;
      margin-top: 15px;
    }
  }

  .button-wrap {
    display: flex;
  }

  .dialog-content {
    width: 70%;

    &__title {
      text-align: center;
      font-size: 16px;
      color: $font-color-primary;
      padding-top: 16px;
    }

    &__subtitle {
      font-size: 14px;
      color: $font-color-secondary;
      margin-top: 15px;
      line-height: 20px;
      text-align: center;
      padding: 0 16px 10px 16px;
    }

    .van-button {
      width: 100%;
    }
  }

  .introduction {
    &-popup {
      width: 100%;
      height: 100%;
    }
    &-cell {
      > .van-cell__value {
        width: 50px;
        @include ellipsis(1);
      }
    }
  }
</style>

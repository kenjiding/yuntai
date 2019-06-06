<template>
  <ych-page>
    <page-header
      left-arrow
      title="POS机支付方式"
      @click-left="$router.go(-1)" />
    <div :class="$style['payment-manage']">
      <van-loading
        v-show="loading"
        :class="$style['payment-manage-loading']"
      />
      <div>
        <van-cell
          v-for="(item, index) in paymentList"
          :class="{
            [$style['payment-manage-item']]: true,
            [$style['payment-manage-item__enable']]: item.IsEnable
          }"
          :key="index"
          :title="item.Name"
          :value="item.IsEnable ? '● 已开通': '● 停用中'">
          <!-- @click.native="goPaymentInfoPage(item.ID)"> -->
            <van-icon
              :name="typeIcon[item.Type]"
              slot="icon"
              :class="{
                [$style['payment-manage-icon']]: true,
                [$style[`payment-manage-icon--${typeIcon[item.Type]}`]]: true
              }"/>
        </van-cell>
      </div>
      <div>
        <van-cell
          v-for="(item) in otherList"
          :class="{
            [$style['payment-manage-item']]: true,
            [$style['payment-manage-item__enable']]: item.IsEnable
          }"
          :key="item.ID"
          :title="item.Name"
          :value="item.IsEnable ? '● 已开通': '● 停用中'"
          @click.native="goPaymentInfoPage(item)">
            <van-icon
              name="otherpayment"
              slot="icon"
              :class="{
                [$style['payment-manage-icon']]: true,
                [$style['payment-manage-icon--otherpayment']]: true
              }"/>
        </van-cell>
      </div>
      <div
        v-show="!loading"
        :class="$style['payment-manage-add']"
        @click="addPaymentVisible = true">
        <van-icon
          name="add-circle"
        ></van-icon>
        新增支付方式
      </div>
    </div>
    <add-payment
      :visible.sync="addPaymentVisible"
      @saved="onLoad"/>
  </ych-page>
</template>

<script>
import Person from '@/api/Person';
import PageHeader from '@/components/PageHeader';
import AddPayment from '../personal-center/components/AddPayment.vue';

export default {
  name: 'paymentManage',

  components: {
    AddPayment,
    PageHeader,
  },

  data () {
    return {
      loading: false,
      paymentList: [],
      otherList: [],
      typeIcon: {
        WeChat: 'wechat',
        Alipay: 'alipay',
        Cash: 'cashpayment',
        Other: 'otherpayment',
      },
      addPaymentVisible: false,
    };
  },

  mounted () {
    this.onLoad();
  },

  methods: {
    onLoad () {
      this.loading = true;
      this.paymentList = [];
      this.otherList = [];
      Person.getPaymentList().then((res) => {
        if (res.DataList.length > 0) {
          res.DataList.forEach(item => {
            if (item.Type === 'Other') {
              this.otherList.push(item);
            } else {
              this.paymentList.push(item);
            }
          });
        }
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    },
    goPaymentInfoPage (item) {
      this.$router.push({
        path: '/edit-payment',
        query: {
          ID: item.ID,
          Name: item.Name,
          Type: item.Type,
          IsEnable: Boolean(item.IsEnable),
        },
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.payment-manage {
  $four-px: 4px;

  &-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > div {
    margin-bottom: 10px;
  }

  &-item {
    padding: 10px 15px;

    .van-cell__title {
      color: $font-color-primary;
      font-size: $font-size-primary;
    }

    .van-cell__value {
      color: $color-danger;
      font-size: $font-size-special;
    }

    &__enable {
      .van-cell__value {
        color: $color-success !important;
      }
    }
  }

  .van-cell:not(:last-child)::after {
    left: 0;
  }

  &-icon {
    width: 24px;
    height: 24px;
    font-size: $font-size-secondary + $four-px;
    margin-right: 5px;
    position: relative;
    top: -2px;

    &--wechat {
      color: $color-success;
    }

    &--alipay {
      /* stylelint-disable-next-line */
      color: #5a9ef7;
    }

    &--cashpayment {
      /* stylelint-disable-next-line */
      color: #eb7d48;
    }

    &--otherpayment {
      color: $color-primary;
    }
  }

  &-add {
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    background-color: $color-white;
    color: $color-primary;
    font-size: $font-size-primary;

    .van-icon {
      position: relative;
      top: 2px;
      font-size: $font-size-secondary;
    }
  }
}
</style>

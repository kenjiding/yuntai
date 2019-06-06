<template>
  <ych-page>
    <div :class="$style['edit-payment']">
      <van-field
        v-model="info.Name"
        clearable
        label="支付名称"
        :error-message="errorInput"
        placeholder="请输入支付方式名称"
      />
      <van-cell title="支付类型">
        <div @click="typeSelectShow = true">{{ typeChs[info.Type] }}</div>

      </van-cell>
      <van-cell title="支付状态">
        <div @click="stateSelectShow = true">{{ info.IsEnable? '开通':'停用' }}</div>
      </van-cell>

      <div :class="$style['edit-payment-footer']">
        <van-button
          plain
          type="primary"
          :class="$style['delete-button']"
          @click="deletePayment">删除</van-button>

        <van-button
          type="primary"
          :loading="saving"
          :disabled="!canSave"
          :class="$style['save-button']"
          @click="savePayment">保存</van-button>
      </div>

      <van-popup
        v-model="typeSelectShow"
        position="bottom">
        <van-cell
          v-for="(item) in paymentTypes"
          :key="item.value"
          :title="item.name"
          @click="onTypeSelect(item)" />
      </van-popup>

      <van-popup
        v-model="stateSelectShow"
        position="bottom">
        <van-cell
          v-for="(item) in paymentState"
          :key="item.value"
          :title="item.name"
          @click="onStateSelect(item)" />
      </van-popup>
    </div>
  </ych-page>
</template>

<script>
import Person from '@/api/Person';
import { Toast, Popup, Dialog } from 'vant';

export default {
  name: 'EditPayment',

  components: {
    VanPopup: Popup,
    [Dialog.name]: Dialog,
  },

  data () {
    return {
      info: {},
      saving: false,
      typeSelectShow: false,
      paymentTypes: [
        // {
        //   name: '微信',
        //   value: 'WeChat',
        // },
        // {
        //   name: '其他',
        //   value: 'Alipay',
        // },
        // {
        //   name: '其他',
        //   value: 'Cash',
        // },
        {
          name: '其他',
          value: 'Other',
        },
      ],
      typeChs: {
        Other: '其他',
      },
      stateSelectShow: false,
      paymentState: [
        {
          name: '开通',
          value: true,
        },
        {
          name: '停用',
          value: false,
        },
      ],
    };
  },

  computed: {
    canSave () {
      if (!this.info.Name) return false;
      return this.info.Name.length > 0 && this.info.Name.length <= 6;
    },
    errorInput () {
      if (!this.info.Name) return '';
      return this.info.Name.length > 6 ? '支付方式名称不能大于6个字' : '';
    },
  },

  mounted () {
    const queryItem = this.$route.query;
    this.info = {
      ID: queryItem.ID,
      Name: queryItem.Name,
      Type: queryItem.Type,
      IsEnable: Boolean(queryItem.IsEnable),
    };
  },

  methods: {
    onTypeSelect (item) {
      this.info.Type = item.value;
      this.typeSelectShow = false;
    },
    onStateSelect (item) {
      this.info.IsEnable = item.value;
      this.stateSelectShow = false;
    },
    savePayment () {
      this.saving = true;
      Person.editPayment({
        ...this.info,
      }).then(() => {
        this.saving = false;
        this.paymentName = '';
        this.$router.go(-1);
      }, () => {
        this.saving = false;
      });
    },
    deletePayment () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此支付方式？',
        theme: 'danger',
      }).then(() => {
        Toast.loading({
          forbidClick: true,
          message: '删除中',
        });
        Person.deletePayment({ID: this.info.ID}).then((res) => {
          Toast.clear();
          Toast.success('删除成功');
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }).catch(() => {});
      }).catch(() => {});
    },
  },

};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.edit-payment {
  .van-field__control {
    text-align: right;
  }

  .van-field__error-message {
    text-align: right;
  }

  .van-cell:not(:last-child)::after {
    left: 0;
  }

  &-footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 5px 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;

    .delete-button {
      width: 45%;
      border-radius: $border-radius-small;
    }

    .save-button {
      width: 45%;
      border-radius: $border-radius-small;

      &--full {
        width: 95%;
      }
    }
  }
}
</style>

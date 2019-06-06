<template>
  <van-popup v-model="popupShow" position="bottom" @click-overlay="$emit('close')">
    <van-cell title="请选择账号" :border="false" :class="$style['popup-title']">
      <van-icon slot="right-icon" name="close" @click="$emit('close')"/>
    </van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      :offset="20"
      :class="$style['popup-list']"
      @load="onLoad">
        <van-cell
          v-for="(account, index) in accountList"
          :key="index"
          :title="account.DisplayName"
          :value="account.Phone"
          @click="$emit('click', account.ID, account.AccountName)"/>
    </van-list>
  </van-popup>
</template>
<script>
import User from '@/api/User';
import {List, Popup} from 'vant';

export default {
  components: {
    [List.name]: List,
    [Popup.name]: Popup,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    loading: false,
    finished: false,
    accountList: [],
  }),

  computed: {
    popupShow: {
      get: function () {
        return this.visible;
      },
      set: function (v) {
        return v;
      },
    },
  },

  methods: {
    onLoad: function () {
      this.loading = true;
      User.getAccountDataList().then(res => {
        this.finished = true;
        this.loading = false;
        this.accountList.push({
          AccountName: '线上销售',
          DisplayName: '线上销售',
          ID: '00000000-0000-0000-0000-000000000000',
        });

        res.Data.forEach(account => {
          account.DisplayName = `${account.AccountName} (${account.IsMain ? '主账号' : '子账号'})`;
          this.accountList.push(account);
        });
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .popup-list {
    height: 244px;
    overflow: scroll;

    .van-cell {
      background-color: $color-white;
    }
  }

  .popup-title {
    //margin-top: 5px;
    font-size: 20px;
    height: 56px;
    padding-top: 15px;
    padding-right: auto;
    padding-left: auto;
  }
</style>

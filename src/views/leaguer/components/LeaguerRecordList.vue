<template>
  <list
    @load="asyncGetData"
    :finished="finished"
    :loading="loading">

    <record-item
      :always-show-expand="action === 'startRecord'"
      v-for="(recordInfo, index) in listData"
      :key="index"
      :cardInfo="getCardInfo(recordInfo)"
      :cardExpand="getCardExpand(recordInfo)"/>
  </list>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import RecordItem from './RecordItem';
import Enum from '../config/Enum';
import {
  List,
} from 'vant';

export default {
  components: {
    List,
    RecordItem,
  },

  props: {
    action: String,
  },

  data: () => ({
    listData: [],
    pageIndex: 1,
    finished: false,
    loading: true,
    localEnum: Enum,
  }),

  created () {
    this.asyncGetData();
  },

  methods: {
    asyncGetData () {
      this.loading = true;

      Leaguer[this.action]({
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        this.loading = false;
        if (res.Data.length === 0) {
          this.finished = true;
        } else {
          this.listData = this.listData.concat(res.Data);
        }
      });
    },

    getCardInfo (recordInfo) {
      let info = {};
      let { action } = this;
      if (action === 'consumptionRecord') {
        info.title = recordInfo.OrderNumber;
        info.subtitle = recordInfo.OrderTime;
        info.value = recordInfo.Price;
        info.valuePrefix = '¥';
        info.valueFormatter = '0,0.00';
      } else if (action === 'exchangeRecord') {
        info.title = recordInfo.OrderNumber;
        info.subtitle = recordInfo.OrderTime;
        info.value = recordInfo.Price;
        info.subvalue = '积分';
        info.valuePrefix = '-';
        info.valueFormatter = '0,0';
      } else {
        info.title = `${recordInfo.Sn}(${recordInfo.Number})`;
        info.subtitle = recordInfo.OrderTime;
        info.value = recordInfo.Price;
        info.subvalue = '币';
        info.valuePrefix = '-';
        info.valueFormatter = '0,0';
      }
      return info;
    },

    getCardExpand (recordInfo) {
      let expand = [];
      let { action, localEnum } = this;
      if (action === 'consumptionRecord') {
        expand = [{
          label: '支付方式',
          value: localEnum.PaymentMethod[recordInfo.PaymentMethod],
        }, {
          label: '支付号码',
          value: recordInfo.PaymentNumber,
        }, {
          label: '所在门店',
          value: recordInfo.TenantName,
        }, {
          label: '商品',
          value: recordInfo.GoodsInfo,
        }, {
          label: '交易状态',
          value: localEnum.TradingState[recordInfo.State],
        }];
      } else if (action === 'exchangeRecord') {
        expand = [{
          label: '门店',
          value: recordInfo.TenantName,
        }, {
          label: '商品',
          value: recordInfo.GoodsInfo,
        }, {
          label: '状态',
          value: localEnum.TradingState[recordInfo.State],
        }];
      } else {
        expand = recordInfo.TenantName;
      }
      return expand;
    },
  },
};
</script>

<style>

</style>

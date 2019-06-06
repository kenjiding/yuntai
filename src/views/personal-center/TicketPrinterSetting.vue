<template>
  <ych-page>
    <page-header
      left-arrow
      title="小票打印设置"
      @click-left="$router.back()"
      @click-right="save"
      slot="header">
      <van-icon name="save" slot="right" :class="$style['header-icon']" size="25"/>
    </page-header>

    <cell-group>
      <cell
        title="小票打印张数"
        cell-type="input"
        v-model="ticketPrinterSetting.PrintCount"
        @input="limitInput"
        type="number"/>
    </cell-group>

    <cell-group header="小票样式预览" :class="$style['ticket-container']">
      <div :class="$style['ticket-header']">{{ticketPrinterSetting.TicketHeader}}</div>
      <img src="../../assets/img/ticket.png" :class="$style['ticket-img']" width="100%"/>
    </cell-group>
  </ych-page>
</template>

<script>
import Person from '@/api/Person';
import PageHeader from '@/components/PageHeader';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import { Toast } from 'vant';

export default {
  components: {
    PageHeader,
    CellGroup,
    Cell,
  },

  data: () => ({
    ticketPrinterSetting: {
      PrintCount: 1,
    },
  }),

  created () {
    this.asyncGetData();
  },

  methods: {
    limitInput (val) {
      if (val.length > 1) {
        this.ticketPrinterSetting.PrintCount = val.slice(0, 1);
      }
    },
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Person.ticketPrinterSetting().then(res => {
        this.hideLoadingToast();

        this.ticketPrinterSetting = res;
      });
    },

    save () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Person.ticketPrinterSettingEdit({
        PrintCount: this.ticketPrinterSetting.PrintCount,
      }).then(res => {
        Toast.success('修改成功');

        this.$router.back();
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .ticket-img {
    width: '100%';
  }

  .ticket-container {
    position: relative;
  }

  .ticket-header {
    color: $font-color-placeholder;
    font-size: $font-size-primary;
    position: absolute;
    width: 150px;
    left: 50%;
    margin-left: -75px;
    top: 65px;
    text-align: center;
  }
</style>

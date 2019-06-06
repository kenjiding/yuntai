<template>
  <ych-page>
    <cash-content
      @hideCashContent="showPage"
      v-if="componentShow == 'index'"></cash-content>
    <cash-log
      v-if="componentShow == 'logsPage'"
      @closeLogPage="componentShow = 'index'"></cash-log>
    <new-bank-cart
      v-if="componentShow == 'newBankCartPage'"
      @closeBankCardPage="componentShow = 'index'"></new-bank-cart>
  </ych-page>
</template>

<script>
import cashLog from './components/GetCashLog.vue';
import cashContent from './components/GetCashContent.vue';
import newBankCart from './components/GetCashBankCart.vue';

export default {
  name: 'getCashPage',
  data () {
    return {
      componentShow: 'newBankCartPage',
    };
  },

  components: {
    cashLog,
    cashContent,
    newBankCart,
  },
  methods: {
    showPage (val) {
      if (val === 'showCashLog') {
        this.componentShow = 'logsPage';
      } else if (val === 'showNewBankCard') {
        this.componentShow = 'newBankCartPage';
      }
    },
  },

};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

</style>

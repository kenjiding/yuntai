<template>
  <ych-page>
    <page-header
      slot="header"
      title="积分规则"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>

    <div :class="$style['person-info-wrap']">
      <van-cell-group>
        <van-cell
          title="积分赠送">
          <van-switch
            v-model="integration"
            :disabled="!isMain"
            slot="right-icon"
            size="24px"
            @change="openIntegration" />
        </van-cell>
      </van-cell-group>

      <div v-show="integration">
        <p :class="$style.iconText">获取方式(暂不开放设置)</p>
        <van-cell-group>
          <van-cell
            title="充值游戏币套餐送">
            <van-switch v-model="currency" slot="right-icon" disabled size="24px" />
          </van-cell>
          <van-cell
            title="购买零售商品送">
            <van-switch v-model="goods" slot="right-icon" disabled size="24px" />
          </van-cell>
          <p :class="$style.iconText">获取比例(暂不开放设置)</p>
          <van-cell title="每消费1元等于" :value="spend + '积分'"/>
        </van-cell-group>
      </div>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast } from 'vant';

export default {
  name: '',
  data () {
    return {
      spend: '',
      currency: true,
      goods: true,
      integration: false,
    };
  },

  components: {
    PageHeader,
  },

  computed: {
    isMain () {
      return this.$store.state.userInfo.IsMain;
    },
  },

  methods: {
    openIntegration (val) {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PersonApi.updateIntegralRule({IsOpenIntegralGive: val}).then(() => {
        Toast.clear();
      });
    },
    getIntegrationRuleData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PersonApi.getIntegrationRule().then((res) => {
        this.spend = res.spend;
        this.currency = res.currency;
        this.goods = res.goods;
        this.integration = res.integralRule;
        Toast.clear();
      });
    },
  },

  created: function () {
    this.getIntegrationRuleData();
  },

};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.iconText {
  position: relative;
  padding: 10px 15px;
  font-size: $font-size-special;
  color: $font-color-placeholder;
}

.person-info-wrap {
  height: 100%;

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .van-cell {
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      .van-switch--on {
        background-color: $color-primary;
        margin-top: 5px;
      }

      &:nth-child(5) {
        margin-bottom: 15px;
      }

      .van-cell__title {
        line-height: 32px;
        font-size: $font-size-primary;
      }

      .van-cell__value {
        color: $font-color-placeholder;
        line-height: 32px;

        input {
          text-align: right;
        }
      }
    }
  }

  &-top {
    margin-bottom: 15px;
  }
}
</style>

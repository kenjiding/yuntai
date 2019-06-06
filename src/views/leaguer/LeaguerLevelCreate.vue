<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      title="新增会员等级"
      @click-left="$router.back()"
      @click-right="saveLevel">
      <div slot="right">保存</div>
    </page-header>

    <cell-group>
      <cell
        title="会员等级名称"
        cell-type="input"
        v-model="levelInfo.LevelName">
      </cell>
    </cell-group>

    <cell-group
      header="升级策略(一年内累计消费达标, 升至该会员级别)">
      <cell
        title="指定时间"
        desc="自然年">
      </cell>

      <cell
        title="消费达到"
        cell-type="number"
        placeholder="请填写金额"
        v-model="levelInfo.UpgradeStrategy.Limit">
      </cell>
    </cell-group>

    <cell-group
      header="保级策略(一年内累计消费达标, 保留该会员级别)">
      <cell
        title="指定时间"
        desc="自然年">
      </cell>

      <cell
        title="消费达到"
        cell-type="number"
        placeholder="请填写金额"
        v-model="levelInfo.KeepStrategy.Limit">
      </cell>
    </cell-group>

    <cell-group>
      <cell
        :expand-default="levelInfo.ConsumerDiscount.IsEnable"
        title="消费折扣优惠"
        cell-type="expand"
        @onExpandChange="value => levelInfo.ConsumerDiscount.IsEnable = value">

        <cell-expand
          title="游戏币套餐折扣"
          slot="expand"
          expand="折">
          <input-number
            slot="input"
            v-model="levelInfo.ConsumerDiscount.GameCurrencyDiscount"
            value-type="discount"/>
        </cell-expand>

        <cell-expand
          title="零售商品折扣"
          slot="expand"
          expand="折">
          <input-number
            slot="input"
            v-model="levelInfo.ConsumerDiscount.RetailGoodsDiscount"
            value-type="discount"/>
        </cell-expand>

        <cell-expand
          title="兑换折扣"
          slot="expand"
          expand="折">
          <input-number
            slot="input"
            v-model="levelInfo.ConsumerDiscount.ExchangeDiscount"
            value-type="discount"/>
        </cell-expand>
      </cell>
    </cell-group>

    <cell-group>
      <cell
        :expand-default="levelInfo.CurrencyDeliveryForLevel.IsEnable"
        title="等级送币"
        cell-type="expand"
        @onExpandChange="value => levelInfo.CurrencyDeliveryForLevel.IsEnable = value">

        <cell-expand
          title="送币数量"
          slot="expand"
          expand-type="number"
          v-model="levelInfo.CurrencyDeliveryForLevel.Amount">
        </cell-expand>

        <cell-expand
          title="币有效期"
          slot="expand"
          expand-type="number"
          v-model="levelInfo.CurrencyDeliveryForLevel.TermOfValidity"/>

        <cell-expand
          ref="CurrencyDeliveryForLevel"
          expand-type="select"
          title="有效期单位"
          slot="expand"
          :value="localEnum.TimeSlot[levelInfo.CurrencyDeliveryForLevel.PeriodOfValidity]"
          cancel-text="取消"
          :actions="levelActions"/>
      </cell>
    </cell-group>

    <cell-group>
      <cell
        :expand-default="levelInfo.CurrencyDeliveryForBirthday.IsEnable"
        title="生日送币"
        cell-type="expand"
        @onExpandChange="value => levelInfo.CurrencyDeliveryForBirthday.IsEnable = value">

        <cell-expand
          title="送币数量"
          slot="expand"
          expand-type="number"
          v-model="levelInfo.CurrencyDeliveryForBirthday.Amount">
        </cell-expand>

        <cell-expand
          title="币有效期"
          slot="expand"
          expand-type="number"
          v-model="levelInfo.CurrencyDeliveryForBirthday.TermOfValidity"/>

        <cell-expand
          ref="CurrencyDeliveryForBirthday"
          expand-type="select"
          title="有效期单位"
          slot="expand"
          :value="localEnum.TimeSlot[levelInfo.CurrencyDeliveryForBirthday.PeriodOfValidity]"
          cancel-text="取消"
          :actions="birthdayActions"/>
      </cell>
    </cell-group>

  </ych-page>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import PageHeader from '@/components/PageHeader';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import CellExpand from '@/components/CellExpand';
import Enum from './config/Enum';
import InputNumber from '@/components/InputNumber';
import {
  Toast,
} from 'vant';

export default {
  components: {
    PageHeader,
    Cell,
    CellGroup,
    CellExpand,
    InputNumber,
  },

  data: () => ({
    levelId: '',
    isEdit: false,
    localEnum: Enum,
    levelActions: [],
    birthdayActions: [],
    levelInfo: {
      LevelName: '',
      UpgradeStrategy: {
        TimeCycle: 'Year',
        Limit: 1000,
      },
      KeepStrategy: {
        TimeCycle: 'Year',
        Limit: 1000,
      },
      ConsumerDiscount: {
        IsEnable: false,
        GameCurrencyDiscount: 1,
        RetailGoodsDiscount: 1,
        ExchangeDiscount: 1,
      },
      CurrencyDeliveryForLevel: {
        IsEnable: false,
        Amount: 1,
        TermOfValidity: 10,
        PeriodOfValidity: 'Day',
      },
      CurrencyDeliveryForBirthday: {
        IsEnable: false,
        Amount: 20,
        TermOfValidity: 10,
        PeriodOfValidity: 'Day',
      },
    },
  }),

  created () {
    this.initActions();

    this.levelId = this.$route.query.levelId;
    this.isEdit = !!this.levelId;
    if (this.isEdit) {
      this.asyncGetData();
    }
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Leaguer.leaguerLevelDetail({
        LevelID: this.levelId,
      }).then(res => {
        this.levelInfo = res;
        this.hideLoadingToast();
      });
    },
    initActions () {
      let { TimeSlot } = this.localEnum;
      for (let p in TimeSlot) {
        this.levelActions.push({
          name: TimeSlot[p],
          key: p,
          callback: item => this.handleSelected(item, 'CurrencyDeliveryForLevel', 'PeriodOfValidity'),
        });

        this.birthdayActions.push({
          name: TimeSlot[p],
          key: p,
          callback: item => this.handleSelected(item, 'CurrencyDeliveryForBirthday', 'PeriodOfValidity'),
        });
      }
    },

    handleSelected (item, name, subname) {
      this.levelInfo[name][subname] = item.key;
      this.$refs[name].close();
    },

    saveLevel () {
      let { levelInfo } = this;

      if (!levelInfo.LevelName) {
        Toast('请输入会员等级名称');
        return;
      }

      if (levelInfo.UpgradeStrategy.Limit === 0) {
        Toast('请完善会员等级升级策略');
        return;
      }

      if (levelInfo.KeepStrategy.Limit === 0) {
        Toast('请完善会员等级保级策略');
        return;
      }

      Toast.loading({
        message: '正在保存...',
        duration: 0,
        mask: true,
      });

      if (this.isEdit) {
        levelInfo.LevelID = this.levelId;
        Leaguer.leaguerLevelEdit(
          levelInfo
        ).then(res => {
          Toast.success('保存成功');
          this.$router.back();
        });
      } else {
        Leaguer.leaguerLevelCreate(
          levelInfo
        ).then(res => {
          Toast.success('保存成功');
          this.$router.back();
        });
      }
    },

    hideLoadingToast () {
      Toast.clear();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .header-icon {
    font-size: 20px;
  }
</style>

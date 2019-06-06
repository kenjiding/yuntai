<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      :title="navTitle"
      @click-left="$router.back()"
      @click-right="save">
      <div slot="right">保存</div>
    </page-header>
    <div :class="$style['page-wrap']">
      <div
        v-for="(item, index) in formData"
        :key="index"
        :class="$style['page-wrap-content']">
        <cell-group>
          <cell
            title="消费达到"
            cell-type="number"
            v-model="item.ConsumptionLimit"/>

          <cell
            title="赠送游戏币"
            cell-type="number"
            v-model="item.GiveCount"/>

          <cell
            title="有效期"
            cell-type="number"
            v-model="item.TermOfValidity"/>

          <cell
            :ref="'actionSheet_' + index"
            title="有效期单位"
            cell-type="select"
            cancel-text="取消"
            :actions="getActions(index)"
            :value="localEnum.TimeSlot[item.PeriodOfValidity]"/>
        </cell-group>

        <cell-group>
          <cell
            title="充值游戏币套餐赠送"
            cell-type="switch"
            v-model="item.IsGiveInRecharge"/>
        </cell-group>
      </div>
      <div
        :class="$style['add-icon-style']"
        @click="addItemHandler"
        v-show="addIconShow">
        <van-icon name="tianjia" />
      </div>
    </div>
  </ych-page>
</template>

<script>
import Activity from '@/api/Activity';
import PageHeader from '@/components/PageHeader';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Enum from './config/Enum';
import checkData from '@/views/packge/tool/checkFormData';

import {
  Toast,
} from 'vant';

export default {
  components: {
    PageHeader,
    CellGroup,
    Cell,
  },

  data: () => ({
    formData: [],
    actions: [],
    localEnum: Enum,
    isEdit: false,
    addIconShow: true,
    navTitle: '',
  }),

  created () {
    let { activityId } = this.$route.query;
    if (activityId) {
      this.navTitle = '编辑送币方案';
      this.addIconShow = false;
      this.isEdit = true;
      this.asyncGetData();
    } else {
      this.navTitle = '新增送币方案';
      this.addItemHandler();
    }
  },

  methods: {
    getActions (index) {
      let { TimeSlot } = this.localEnum;
      let actions = [];
      for (let p in TimeSlot) {
        actions.push({
          name: TimeSlot[p],
          key: p,
          callback: item => this.onSelected(item, index),
        });
      }

      return actions;
    },

    onSelected (item, index) {
      this.formData[index].PeriodOfValidity = item.key;
      this.$refs['actionSheet_' + index][0].close();
    },

    addItemHandler () {
      let obj = {
        ConsumptionLimit: null,
        GiveCount: null,
        TermOfValidity: null,
        PeriodOfValidity: 'Day',
        IsGiveInRecharge: false,
      };
      this.formData.push(obj);
    },
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Activity.activityDetail({
        ActivityID: this.$route.query.activityId,
      }).then(res => {
        this.formData.push(res);
        this.hideLoadingToast();
      });
    },

    save () {
      let dataPass = checkData({
        data: this.formData,
      });

      if (dataPass) {
        Toast.loading({
          message: '加载中...',
          duration: 0,
          mask: true,
        });
        Activity[this.isEdit ? 'activityEdit' : 'activityCreate']({
          Data: this.formData,
        }).then(res => {
          Toast.clear();
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

<style lang='scss' module>
@import "@/styles/them.scss";

.page-wrap {
  width: 100%;
  height: 100%;
  background-color: $border-color;

  &-content {
    background-color: $color-bg-secondary;
    margin-bottom: 15px;
  }
}

.add-icon-style {
  width: 90%;
  height: 40px;
  background: $color-white;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .van-icon-tianjia {
    font-size: $font-size-secondary;
    color: $color-primary;
  }
}
</style>

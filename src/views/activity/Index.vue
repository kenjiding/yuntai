<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      title="活动赠送"
      @click-left="$router.back()"
      @click-right="save">
      <div slot="right">保存</div>
    </page-header>

    <tabs :class="$style.tabs">
      <tab title="消费送币">
        <list
          @load="asyncGetActivityList"
          :finished="isFinished"
          :offset="100"
          :loading="isLoading">

          <cell-group
            v-for="activity in activityList"
            :key="activity.ID">
            <cell cell-type="add" v-if="activity.isAdd" @click.native="$router.push('/activity-create')"/>

            <cell v-else @click.native="$router.push({path: '/activity-create', query: {activityId: activity.ID}})">
              <div slot="title">每满 {{activity.ConsumptionLimit | number}} 元送 {{activity.GiveCount | number}} 币</div>
              <van-icon name="arrow"/>
            </cell>
          </cell-group>
        </list>
      </tab>

      <tab title="完善资料送币">
        <cell-group>
          <cell
            :expand-default="activityCompletedInfo.IsEnable"
            title="完善会员资料送币"
            cell-type="expand"
            @onExpandChange="value => activityCompletedInfo.IsEnable = value">

            <cell-expand
              slot="expand"
              type="number"
              title="赠送游戏币"
              v-model="activityCompletedInfo.GiveCount"/>

            <cell-expand
              slot="expand"
              type="number"
              title="币有效期"
              v-model="activityCompletedInfo.TermOfValidity"/>

            <cell-expand
              ref="selectActionsheet"
              slot="expand"
              expand-type="select"
              title="有效期单位"
              cancel-text="取消"
              :actions="actions"
              :value="localEnum.TimeSlot[activityCompletedInfo.PeriodOfValidity]"/>
          </cell>
        </cell-group>
      </tab>
    </tabs>
  </ych-page>
</template>

<script>
import Activity from '@/api/Activity';
import PageHeader from '@/components/PageHeader';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import CellExpand from '@/components/CellExpand';
import Enum from './config/Enum';

import {
  Toast,
  Tabs,
  Tab,
  List,
} from 'vant';

export default {
  components: {
    PageHeader,
    Tab,
    Tabs,
    CellGroup,
    Cell,
    CellExpand,
    List,
  },

  data: () => ({
    activityList: [{
      ID: 'add',
      isAdd: true,
    }],
    activityCompletedInfo: {
      IsEnable: false,
      GiveCount: 10,
      TermOfValidity: 10,
      PeriodOfValidity: 'Day',
    },
    actions: [],
    localEnum: Enum,
    isFinished: false,
    isLoading: false,
    pageIndex: 1,
  }),

  created () {
    this.asyncGetData();

    let { TimeSlot } = this.localEnum;
    for (let p in TimeSlot) {
      this.actions.push({
        name: TimeSlot[p],
        key: p,
        callback: this.onSelected,
      });
    }
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      this.asyncGetCompletedInfo();
    },

    asyncGetActivityList () {
      this.isLoading = true;

      Activity.activityList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        this.isLoading = false;

        if (res.Data.length === 0) {
          this.isFinished = true;
          return;
        }

        let addComp = this.activityList.pop();
        this.activityList = this.activityList.concat(res.Data);
        this.activityList.push(addComp);
      });
    },

    asyncGetCompletedInfo () {
      Activity.activityCompletedInfo().then(res => {
        this.hideLoadingToast();

        this.activityCompletedInfo = res;
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },

    onSelected (item) {
      this.activityCompletedInfo.PeriodOfValidity = item.key;
      this.$refs.selectActionsheet.close();
    },

    save () {
      let { activityCompletedInfo } = this;
      if (activityCompletedInfo.GiveCount <= 0 ||
        activityCompletedInfo.TermOfValidity <= 0) {
        Toast('请输入正确的信息');
      }

      Activity.activityCompletedInfoEdit(
        this.activityCompletedInfo
      ).then(res => {
        Toast.success('修改成功');
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .tabs {
    padding-top: 0;
    height: 100%;

    .van-tabs__content {
      position: absolute;
      top: 44px;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: auto;
    }

    .van-tab--active {
      color: $color-primary;
    }

    .van-tabs__nav {
      .van-tabs__line {
        background-color: transparent;
      }

      .van-tabs__line::after {
        background-color: $color-primary;
        width: 20px;
        height: 4px;
        border-radius: $border-radius-small;
        position: absolute;
        top: -3px;
        color: transparent;
        left: 50%;
        margin-left: -10px;
      }
    }
  }
</style>

<template>
  <ych-page>
    <page-header title="Cell示例"/>

    <cell-group>
      <cell title="会员等级名称" desc="钻石会员"></cell>
    </cell-group>

    <cell-group header="升级策略(一年内累计消费达标，升至该会员级别)">
      <cell
        title="指定时间"
        cell-type="input"
        placeholder="Test"
        v-model="str"></cell>

      <cell title="消费达到">
        <p>{{str}}</p>
      </cell>
    </cell-group>

    <cell-group>
      <cell
        title="指定时间"
        cell-type="switch"
        v-model="bool"></cell>
    </cell-group>

    <cell-group>
      <cell
        ref="actionSheet"
        title="制定时间"
        cell-type="select"
        :value="selectValue"
        :actions="actions">
      </cell>
    </cell-group>

    <cell-group>
      <cell
        title="兑换"
        cell-type="expand"
        v-model="expandValue"
        expand-default
        @onExpandChange="handleExpandChange">
      </cell>

      {{expandValue}}
    </cell-group>

  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';

export default {
  components: {
    PageHeader,
    Cell,
    CellGroup,
  },

  data () {
    let _self = this;
    return {
      str: 'test',
      bool: true,
      selectValue: '选择',
      actions: [{
        name: '选择一',
        subname: 'test',
        id: 123456,
        callback: _self.handleSelectClicked,
      }, {
        name: '选择二',
      }, {
        name: '选择三',
      }],
      expandValue: 'Test',
    };
  },

  methods: {
    handleSelectClicked (item) {
      console.log(item.id);
      this.selectValue = item.name;
      this.$refs.actionSheet.close();
    },

    handleExpandChange (value) {
      console.log(value);
      if (!value) {
        this.expandValue = '';
      }
    },
  },
};
</script>

<style>
</style>

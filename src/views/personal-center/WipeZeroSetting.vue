<template>
  <ych-page>
    <page-header
      left-arrow
      title="POS机抹零设置"
      @click-left="save">
    </page-header>

    <cell-group :class="$style.cell">
      <cell
        title="抹零设置"
        cell-type="switch"
        v-model="wipeZeroSetting.IsEnable"></cell>
    </cell-group>

    <transition name="fade">
      <radio-group v-model="wipeZeroSetting.Setting" v-show="wipeZeroSetting.IsEnable">
        <cell-group :class="$style.cell">
          <cell
            title="抹分">
            <radio name="EraseCent"/>
          </cell>

          <cell
            title="抹角">
            <radio name="EraseDime"/>
          </cell>

          <cell
            title="四舍五入到角">
            <radio name="RoundingToDime"/>
          </cell>
        </cell-group>
      </radio-group>
    </transition>

  </ych-page>
</template>

<script>
import Person from '@/api/Person';
import PageHeader from '@/components/PageHeader';
import Cell from '@/components/Cell';
import CellGroup from '@/components/CellGroup';
import { RadioGroup, Radio, Toast } from 'vant';

export default {
  components: {
    PageHeader,
    Cell,
    CellGroup,
    RadioGroup,
    Radio,
  },

  data: () => ({
    wipeZeroSetting: {
      IsEnable: false,
      Setting: 'EraseCent',
    },
  }),

  computed: {
    wipeZero () {
      return this.wipeZeroSetting.IsEnable;
    },
  },
  watch: {
    wipeZero (val, old) {
      if (!val) {
        this.wipeZeroSetting.IsEnable = false;
      }
    },
  },

  created () {
    this.asyncGetData();
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中....',
        duration: 0,
        mask: true,
      });

      Person.wipeZeroSetting().then(res => {
        this.hideToastLoading();

        this.wipeZeroSetting = res;
      });
    },

    save () {
      Toast.loading({
        message: '保存中...',
        duration: 0,
        mask: true,
      });

      Person.wipeZeroSettingEdit(this.wipeZeroSetting).then(res => {
        Toast.success('保存成功');
        this.$router.back();
      });
    },

    hideToastLoading () {
      Toast.clear();
    },
  },
};
</script>
<style>
.fade-enter-active {
  transition: all .3s ease;
}

.fade-leave-active {
  transition: all .4s cubic-bezier(.4, .2, .5, 2);
}

.fade-enter,
.fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
<style lang="scss" module>
  @import "@/styles/them.scss";

  .van-radio .van-icon-checked {
    color: $color-primary;
  }

  .cell {
    padding: 0;
    margin-bottom: 10px;
  }
</style>

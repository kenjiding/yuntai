<template>
  <ych-page>
    <page-header
        slot="header"
        title="选择推送人"
        left-arrow
        @click-left="save">
      </page-header>

    <van-radio-group
        v-model="radio"
        :class="$style['all-check-box']">
        <van-cell title="选择全部" @click="selectAllBox">
          <van-radio
            :name="true"
            :class="$style['all-check-box-radio']" />
        </van-cell>
      </van-radio-group>

    <van-checkbox-group
      v-model="result"
      @change="selectChange"
      :class="$style.wrap">
      <van-cell
        v-for="item in accountList"
        :title="item.PhoneNum + (item.IsMain ? '(主账号)': '(子账号)')"
        :key="item.ID">
        <van-checkbox :name="item.ID"/>
      </van-cell>
    </van-checkbox-group>
</ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';

export default {
  name: '',

  data () {
    return {
      result: [],
      radio: false,

    };
  },

  components: {
    PageHeader,
  },

  watch: {
    defaultUser () {
      this.result = this.defaultUser;
    },
  },

  props: {
    defaultUser: Array,
    accountList: Array,
  },

  methods: {
    selectAllBox () {
      this.radio = !this.radio;
      if (this.radio) {
        this.accountList.forEach((item) => {
          this.result.push(item.ID);
        });
      } else {
        this.result = [];
      }
    },
    selectChange (val) {
      this.radio = !(this.result.length < this.accountList.length);
    },
    save () {
      this.result = Array.from(new Set(this.result));
      this.$emit('returnResult', this.result);
      this.$emit('closePoupu');
    },
  },
  created () {
    console.log(123);
    this.result = this.defaultUser;
    this.selectChange();
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.all-check-box-radio {
  color: $color-primary;

  .van-icon-checked {
    color: $color-primary !important;
  }
}

.all-check-box {
  padding: 15px 20px 0;
}

.wrap {
  padding: 20px;
  box-sizing: border-box;

  .van-checkbox--checked {
    border-color: $color-primary;
    background-color: $color-primary;
  }
}
</style>

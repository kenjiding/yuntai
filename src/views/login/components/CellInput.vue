<template>
<div>
  <van-cell
    title="手机号码"
    :class="$style.qrcode">
    <div slot="right-icon" :class="$style['qrcode-right']">
      <van-field
        v-model="inputValue"
        :error-message="errorText"
        @blur="checkPhoneNumber"
        @focus="iconName = 'arrow-down'"
        @input="numberLimit"
        type="tel"/>
      <van-icon :name="iconName" @click.native="seleceHistoryPhone" />

    </div>
  </van-cell>

  <div :class="$style.historyContent" v-show="iconName === 'arrow-up'">
    <p
      v-for="(item,index) in historyList"
      :key="item.phone"
      @click="clickPhone(item)">
      {{item.phone}}
      <van-icon name="close" @click.stop="deletePhoneNum(index)" />
    </p>
  </div>
</div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      inputValue: '',
      errorText: '',
      iconName: 'arrow-down',
      historyList: [],
    };
  },
  created () {},

  methods: {
    clickPhone (data) {
      this.$emit('fillBackData', data);
      this.inputValue = data.phone;
      this.iconName = 'arrow-down';
      this.checkPhoneNumber();
    },
    deletePhoneNum (index) {
      this.historyList.splice(index, 1);
      localStorage.setItem('phoneHistory', JSON.stringify(this.historyList));
    },
    seleceHistoryPhone () {
      if (this.iconName === 'arrow-down') {
        this.historyList = JSON.parse(localStorage.getItem('phoneHistory')) || [];
      }

      this.iconName = this.iconName === 'arrow-down' ? 'arrow-up' : 'arrow-down';
    },
    checkPhoneNumber () {
      if (/^1\d{10}$/.test(this.inputValue)) {
        this.errorText = null;
        return true;
      } else {
        this.errorText = '手机号格式错误';
        return false;
      }
    },
    numberLimit (val) {
      let cacheValue = val;
      if (val.length >= 11) {
        cacheValue = val.slice(0, 11);
      }
      this.$emit('changeValue', cacheValue);
      this.inputValue = cacheValue;
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.historyContent {
  width: 70%;
  height: 150px;
  background-color: $color-white;
  position: absolute;
  z-index: 2000;
  top: 40px;
  right: 5px;
  overflow: auto;
  /* stylelint-disable-next-line */
  box-shadow: 0 1px 5px #888888;
  -webkit-overflow-scrolling: touch;

  p {
    margin: 0 10px 0 14px;
    padding: 10px 0;
    text-align: right;
    color: $font-color-secondary;
    border-bottom: 1px solid $border-color;
  }
}

.qrcode {
  .van-cell__title {
    flex: 3;
  }

  .van-cell__value {
    border-bottom: 0 !important;
  }

  &-right {
    flex: 6;
    position: relative;
    border-bottom: 1px solid $border-color;
  }

  .van-field {
    width: 85%;
    float: left;
    padding: 0 !important;
  }

  .van-icon {
    color: $font-color-secondary;
    float: right;
    width: 25px;
    height: 25px;
    text-align: right;
    line-height: 20px;
    /* stylelint-disable-next-line */
    font-size: 25px;
    position: absolute;
    right: 0;
  }
}
</style>

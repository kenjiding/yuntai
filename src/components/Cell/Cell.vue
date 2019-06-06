<template>
  <div :class="$style['container']">
    <div :class="[
        $style['cell-container'],
        {
          [$style['cell-padder']]: cellType === 'expand'
        }
      ]"
      :style="{padding: cellContainerPadding}">
      <slot name="icon"/>
      <div :class="[$style.title]" v-if="cellType !== 'add' && isNeedTitle">
        <span v-if="required" :class="$style['required-flag']">*&nbsp;</span>
        <slot v-if="$slots.title" name="title"/>
        <div v-else :class="cellType == 'button' && $style['center']">{{title}}</div>
      </div>

      <div :class="$style['add-container']" v-if="cellType === 'add'">
        <van-icon name="tianjia"/>
      </div>

      <div :class="$style.desc" v-if="cellType === 'desc'">
        <div v-if="$slots.default" :class="$style['default-wrap']">
          <slot></slot>
        </div>
        <div v-else>{{desc}}</div>
      </div>

      <div :class="$style['input-wrap']" v-if="cellType === 'input'">
        <van-field
          :class="[$style.input, disabled && $style['disabled']]"
          :value="value"
          maxLength="1500"
          @input="(val) => $emit('input', val)"
          type="input"
          :placeholder="placeholder || '请输入'"
          :disabled="disabled"
          style="text-align: right;"
        />
      </div>

      <div :class="$style['input-wrap']" v-if="cellType === 'number'">
        <input-number
          v-if="!disabled"
          :class="[$style.input, disabled && $style['disabled']]"
          :value="value"
          @input="(val) => $emit('input', val)"
          :placeholder="placeholder || '请输入'"
          :disabled="disabled"
          v-bind="$attrs"/>

        <div
          v-else
          :class="[$style.input, $style.disabled, $style.text]">
          {{ value }}
        </div>
      </div>

      <div :class="$style['switch-wrap']" v-if="cellType === 'switch'">
        <van-switch
          :value="value"
          @input="checked => $emit('input', checked)"
          size="24px"
          :disabled="disabled"
          v-bind="$attrs"
          v-on="$listeners"/>
      </div>

      <div :class="$style['select-wrap']" v-if="cellType === 'select'" @click="showActionsheet = true">
        <div v-if="value">{{ value }}</div>
        <div v-else :class="$style['disabled']">{{ placeholder || '请选择' }}</div>
      </div>

      <div :class="[$style['select-wrap'], disabled && $style['disabled']]" v-if="cellType === 'datetime'" @click="() => { if (!disabled) { showDatePicker = true } }">
        <div v-if="value">{{ value | date }}</div>
        <div v-else :class="$style['select-placeholder']">{{ placeholder || '请选择' }}</div>
      </div>

      <div :class="$style['radio-group-wrap']" v-if="cellType === 'radio-group'" @click="showDatePicker = true">
        <van-radio-group :value="value" @input="val => $emit('input', val)" :disabled="disabled">
          <van-radio v-for="radio in radios" :key="radio.value" :name="radio.value">{{ radio.name }}</van-radio>
        </van-radio-group>
      </div>

      <div :class="$style['text-wrap']" v-if="cellType === 'text'" @click="showDatePicker = true">
        <van-field
          id="textarea_id"
          :value="value"
          maxLength="1500"
          @input="(val) => $emit('input', val)"
          type="textarea"
          rows="5"
          autosize
          :disabled="disabled"
        />
      </div>

      <div :class="$style['expand-wrap']" v-if="cellType === 'expand'">
        <van-switch
          size="24px"
          v-model="showExpand"
          :disabled="disabled"/>
      </div>

      <div :class="[$style['link-wrap'], disabled && $style['disabled']]" v-if="cellType === 'link'" @click="() => !disabled && onLinkClick()">
        <div :class="$style['link-content']">
          <div v-if="value">{{ displayName ? value[displayName] : value }}</div>
          <div v-else :class="$style['content-placeholder']">{{ placeholder }}</div>
        </div>
        <van-icon name="arrow" color="#999999" size="14px"/>
      </div>

      <div :class="$style['range-wrap']" v-if="cellType === 'range'">
        <input-number
          :class="[$style.input, disabled && $style['disabled']]"
          :value="value[0]"
          @input="val => onRangeChange(val, 'min')"
          :placeholder="placeholder || '请输入'"
          :disabled="disabled"
          v-bind="$attrs"/>
        至
        <input-number
          :class="[$style.input, disabled && $style['disabled']]"
          :value="value[1]"
          @input="val => onRangeChange(val, 'max')"
          :placeholder="placeholder || '请输入'"
          :disabled="disabled"
          v-bind="$attrs"/>
      </div>

      <div :class="$style['uploader-wrap']" v-if="cellType === 'uploader'">
        <div :class="$style['updater-close']" v-if="canRemove && uploadedImg" @click="removeUploadedImg">
          &times;
        </div>
        <ych-uploader
          :after-read="onRead"
          :max-size="204800000"
          @oversize="oversizeHandler"
          :class="{[$style.uploadImg]: true,[$style.largeSize]: largeSize}"
          :disabled="disabled"
          uploadType="public">
          <img :src="uploadedImg" v-if="uploadedImg" :class="{[$style['uploader-image']]: true, [$style.largeSizeImg]: largeSize}"/>
          <div v-else :class="{[$style['uploader-placeholder']]: true,[$style['uploader-placeholder_large']]: largeSize}">
            <van-icon name='tianjia' size="18px" color="#E0E0E0" />
          </div>
        </ych-uploader>
      </div>

      <div :class="$style['expand-block']" v-if="showExpand">
        <slot v-if="$slots.expand" name="expand"/>
        <cell-expand
          v-else
          :value="value"
          @input="value => $emit('input', value)"/>
      </div>

      <div :class="$style['addon-after-wrap']" v-if="addonAfter">
        {{ addonAfter }}
      </div>

      <actionsheet
        v-if="cellType === 'select'"
        :class="$style['cell-actionsheet']"
        v-model="showActionsheet"
        :title="selectTitle"
        v-bind="$attrs"
        v-on="$listeners">
        <slot name="actions"/>
      </actionsheet>

      <actionsheet
        v-if="cellType === 'datetime'"
        v-model="showDatePicker">
        <div :class="$style['date-time-header']">
          <div>年</div>
          <div>月</div>
          <div>日</div>
          <div>时</div>
          <div>分</div>
        </div>
        <van-datetime-picker
          :value="new Date(value)"
          type="datetime"
          :min-date="new Date()"
          :max-date="new Date(2050, 12, 31)"
          @confirm="(value) => { $emit('dateConfirm', value); showDatePicker = false}"
          @cancel="showDatePicker = false"
        />
      </actionsheet>
    </div>

    <div :class="$style['subtitle']" v-if='subtitle'>
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
import {
  Actionsheet,
  Toast,
} from 'vant';
import CellExpand from '@/components/CellExpand';
import InputNumber from '@/components/InputNumber';

export default {
  components: {
    Actionsheet,
    CellExpand,
    InputNumber,
  },

  props: {
    largeSize: {
      type: Boolean,
      default: false,
    },
    cellContainerPadding: String,
    isNeedTitle: {
      type: Boolean,
      default: true,
    },
    title: String,
    desc: String,
    placeholder: String,
    value: String | Number | Array,
    selectTitle: String,
    expandDefault: Boolean,
    subtitle: String,
    disabled: Boolean,
    linkUrl: String,
    linkLazy: Function,
    displayName: String,
    required: Boolean,
    canRemove: Boolean,
    onUploaded: Function,
    addonAfter: String,
    radios: {
      type: Array,
      default: () => ([]),
    },

    cellType: {
      validator (value) {
        return [
          'add',
          'desc',
          'input',
          'number',
          'switch',
          'select',
          'expand',
          'datetime',
          'text',
          'radio-group',
          'uploader',
          'button',
          'range',
          'link',
        ].indexOf(value) !== -1;
      },
      default: 'desc',
    },
  },

  data: () => ({
    showActionsheet: false,
    showExpand: false,
    showDatePicker: false,
    currentDate: '',
    uploadedImg: '',
    min: '',
    max: '',
    linkBackDataTime: 0,
  }),

  computed: {
    attrs () {
      return {
        ...this.$attrs,
        maxLength: 30,
      };
    },
  },

  created () {
    this.showExpand = this.expandDefault || false;

    if (this.cellType === 'uploader') {
      this.$nextTick(() => {
        console.log('cell', this.value);
        this.uploadedImg = this.value;
      });
    } else if (this.cellType === 'text') {
      this.$nextTick(() => {
        let text = this.$el.querySelector('#textarea_id');
        if (!this.value) {
          text.value = this.placeholder;
          text.style.color = '#999';
        } else {
          text.style.color = '#333';
        }

        text.addEventListener('focus', () => {
          text.style.color = '#333';
          if (!this.value) {
            text.value = '';
          }
        });

        text.addEventListener('blur', () => {
          if (!this.value) {
            text.style.color = '#999';
            text.value = this.placeholder;
          }
        });
      });
    }
  },

  watch: {
    showExpand (newVal) {
      this.$emit('onExpandChange', newVal);
    },

    expandDefault (newVal) {
      this.showExpand = newVal;
    },

    value (newVal) {
      if (newVal && this.cellType === 'text') {
        this.$el.querySelector('#textarea_id').style.color = '#333';
      } else if (newVal && this.cellType === 'uploader') {
        if (newVal.startsWith('http') || newVal.startsWith('data:image')) {
          console.log('cell', newVal);
          this.uploadedImg = newVal;
        }
      }

      //处理活动排行回填手动添加的奖品的特殊情况
      if (newVal !== null) {
        if (this.cellType === 'uploader' && (newVal === '' || newVal.indexOf('http://') >= 0)) {
          this.uploadedImg = newVal;
        }
      }
    },

    '$store.state.linkBackData': function (newVal, oldVal) {
      if (oldVal !== this.linkBackDataTime) {
        return;
      }

      if (newVal && this.linkUrl) {
        this.$emit('input', newVal);
        this.$store.commit('setLinkBackData', null);
      }
    },
  },

  methods: {
    onLinkClick () {
      this.linkBackDataTime = Date.now();
      this.$store.commit('setLinkBackData', this.linkBackDataTime);

      if (this.linkLazy && this.linkUrl) {
        this.linkLazy((res) => {
          if (res) {
            this.$router.push(res);
          }
        });
      } else {
        if (this.linkUrl) {
          this.$router.push(this.linkUrl);
        } else {
          this.$emit('click');
        }
      }
    },

    removeUploadedImg () {
      this.uploadedImg = '';
      this.$emit('input', null);
      if (this.onUploaded) {
        this.onUploaded({ content: '' }, null);
      }
    },

    handleShowActionsheet () {
      if (this.cellType === 'select') {
        this.showActionsheet = true;
      }
    },

    close () {
      this.showActionsheet = false;
    },

    oversizeHandler () {
      Toast('图片大小超过限制');
    },

    onRead (file, key) {
      console.log('图片上传成功', file, key);
      this.uploadedImg = file.content;
      this.$emit('input', key);
      if (this.onUploaded) {
        this.onUploaded(file, key);
      }
    },

    onRangeChange (value, field) {
      this[field] = value;
      this.$emit('change', {min: this.min, max: this.max});
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    background-color: $color-white;
    color: $font-color-regular;

    .subtitle {
      font-size: 12px;
      color: $font-color-secondary;
      padding: 0 16px;
      padding-bottom: 10px;
    }
  }

  .required-flag {
    font-size: 14px;
    color: $color-danger;
  }

  .cell-container {
    background-color: $color-white;
    color: $font-color-primary;
    font-size: $font-size-special;
    display: flex;
    min-height: 45px;
    padding: 0 16px;
    justify-content: center;
    padding-top: 15px;
    box-sizing: border-box;
    flex-wrap: wrap;

    .van-icon {
      margin: 0 0 3px 3px;
    }

    .van-cell {
      padding: 0;
    }

    textarea.van-field__control {
      margin-top: -3px;

      &::-webkit-input-placeholder {
        color: $font-color-secondary;
      }
    }
  }

  .cell-padder {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .title {
    width: 100px;
    display: flex;

    .center {
      text-align: center;
    }
  }

  .desc {
    color: $font-color-secondary;
    text-align: right;
    flex: 1;
    display: flex;
  }

  .input-wrap {
    flex: 1;

    .van-field {
      margin-top: -3px;
    }

    .van-field__control {
      text-align: right;
    }

    input::-webkit-input-placeholder {
      color: $font-color-secondary;
    }
  }

  .input {
    width: 100%;
    text-align: right;
    color: $font-color-primary;
    border: none;

    &.disabled {
      color: $font-color-secondary;
    }

    &.text {
      padding-top: 2px;
    }

    &::-webkit-input-placeholder {
      color: $font-color-secondary;
    }
  }

  .addon-after-wrap {
    margin-left: 10px;
    padding-top: 3px;
  }

  .default-wrap {
    flex: 1;
  }

  .switch-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin-top: -5px;

    .van-switch--on {
      background-color: $color-primary;
    }
  }

  .select-wrap {
    flex: 1;
    text-align: right;
    color: $font-color-primary;

    &.disabled {
      color: $font-color-secondary;
    }

    .select-placeholder {
      color: $font-color-secondary;
    }
  }

  .link-wrap {
    flex: 1;
    color: $font-color-primary;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    &.disabled {
      color: $font-color-secondary;
    }

    .van-icon {
      margin-right: 0;
    }

    .link-content {
      margin-right: 5px;
      font-size: 14px;

      .content-placeholder {
        color: $font-color-secondary;
      }
    }
  }

  .uploader-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
    position: relative;

    .uploadImg {
      width: 50px;
      height: 50px;
      margin-top: -5px;
    }

    .largeSize {
      width: 90px;
    }

    .largeSizeImg {
      width: 90px !important;
    }

    .uploader-image {
      width: 50px;
      height: 50px;
      border-radius: $border-radius-small;
      box-sizing: border-box;
    }

    .uploader-placeholder {
      width: 50px;
      height: 50px;
      border: 1px dashed #b3b3b3; // stylelint-disable
      border-radius: $border-radius-small;
      line-height: 50px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      &_large {
        width: 90px;
      }
    }

    .updater-close {
      position: absolute;
      z-index: 5;
      right: -5px;
      top: -10px;
      width: 15px;
      height: 15px;
      line-height: 15px;
      display: flex;
      justify-content: center;
      background-color: $color-danger;
      border-radius: 50%;
      color: $color-white;
      font-size: 12px;
    }
  }

  .van-actionsheet--withtitle {
    .van-actionsheet__header {
      text-align: left;
      padding-left: 16px;
    }
  }

  .range-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -15px;

    .input {
      text-align: center;
    }
  }

  .expand-wrap {
    flex: 1;

    .van-switch--on {
      background-color: $color-primary;
    }
  }

  .radio-group-wrap {
    flex: 1;

    .van-radio-group {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: -3px;
    }
  }

  .expand-block {
    width: 375px;
    padding-top: 16px;
    box-sizing: border-box;

    & > div:nth-child(n + 2) {
      margin-top: 10px;
    }
  }

  .text-wrap {
    flex: 1;
  }

  .date-time-header {
    display: flex;
    height: 45px;
    justify-content: space-around;
    align-items: center;
    color: $font-color-primary;
    font-size: 14px;
  }

</style>

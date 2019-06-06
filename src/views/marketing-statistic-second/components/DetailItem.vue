<template>
  <div :class="$style['container']">
    <div :class="$style['header']" @click="isOpened = !isOpened">
      <div :class="$style['title']">{{ title }}</div>
      <div :class="$style['tag']" v-if="tag">{{ tag }}</div>
      <div :class="$style['value']" v-if="!$slots.value">
        <span :class="$style['prefix']">{{ valuePrefix }} </span>
        {{ value | number(valueFmt) }}
         <span :class="$style['prefix']">{{ valueSuffix }} </span>
      </div>
      <div :class="$style['value']" v-else>
        <slot name="value"></slot>
      </div>
      <van-icon :name="isOpened ? 'arrow-up' : 'arrow-down'" :class="$style['icon']"/>
    </div>

    <div :class="$style['content']" v-show="isOpened">
      <div
        v-for="(data, index) in dataList"
        :key="'detail_item_key_' + index"
        :class="$style['data-item']">
        <div :class="$style['data-name']">{{ data.name }}：</div>
        <div :class="$style['data-value']">
          <span v-if="data.value !== undefined">
            <span v-if="!data.disableFmt">{{ data.value | number(data.valueFmt || '0,0.00')}}</span>
            <span v-else>{{ data.value }}</span>
          </span>
          {{ data.valueSuffix }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: null,
    },
    value: {
      type: Number,
      default: null,
    },
    valuePrefix: {
      type: String,
      default: null,
    },
    valueSuffix: {
      type: String,
      default: null,
    },
    valueFmt: {
      type: String,
      default: '0,0.00',
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isOpened: false,
  }),

  created () {
    this.isOpened = this.opened;
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    min-height: 50px;
    background-color: $color-white;
    margin-top: 5px;

    &:nth-child(1) {
      margin-top: 10px;
    }
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
    padding: 0 16px;

    .title {
      font-size: 16px;
      color: $color-primary;
    }

    .tag {
      padding: 0 10px;
      height: 20px;
      background-color: $color-primary;
      font-size: 12px;
      color: $color-white;
      border-radius: $border-radius-small;
      line-height: 20px;
      text-align: center;
      margin-left: 10px;
    }

    .value {
      flex: 1;
      text-align: right;
      margin-right: 5px;
      font-size: 16px;
      color: $font-color-primary;

      .prefix {
        font-size: 12px;
      }
    }

    .icon {
      color: $font-color-secondary;
      font-size: 18px;
    }
  }

  .content {
    margin: 0 16px;
    border-top: 1px solid $border-color;

    .data-item {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      height: 30px;

      .data-name {
        color: $font-color-secondary;
      }

      .data-value {
        flex: 1;
        color: $font-color-primary;
        text-align: right;
      }
    }
  }
</style>

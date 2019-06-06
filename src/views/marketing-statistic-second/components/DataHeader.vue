<template>
  <div :class="$style['container']">
    <div :class="$style['header']">
      <div :class="$style['title']">{{ title }}</div>
      <div :class="$style['value']" v-if="typeof value === 'number'">
        <div :class="$style['value-value']">{{ value | number(valueFmt) }}</div>
        <div :class="$style['value-unit']">{{ unit }}</div>
      </div>
      <div :class="$style['value']" v-else>
        <template
          v-for="(valueItem, index) in value">
          <div :class="[$style['value-value'], $style['small']]" :key="'value' + index">{{ valueItem | number(valueFmt[index] || '0,0.00') }}</div>
          <div :class="[$style['value-unit'], $style['small']]" :key="'unit' + index">{{ unit[index] || '元' }}</div>
          <div :class="$style['value-split']"  :key="'split' + index" v-if="index < value.length - 1">/</div>
        </template>
      </div>
      <slot></slot>
    </div>

    <div :class="$style['footer-wrap']">
      <div :class="$style['footer']" :style="{'width': `${footerWidth}%`}">
        <div
          v-for="(store, index) in storeList"
          :key="'store_key_' + index"
          :class="[$style['store-item'], storeTouchable && index === storeActive && $style['store-active']]"
          :style="{'width': `${storeItemWidth}%`}"
          @click="() => { onStoreItemClick(index) }">
          <template v-if="typeof store.value === 'number'">
            <div :class="$style['store-name']">{{ store.name }}</div>
            <div :class="$style['store-value']">{{ store.value | number(store.valueFmt || '0,0.00')}}</div>
          </template>
          <template v-else>
            <div :class="$style['store-name']">{{ store.name }}</div>
            <div :class="$style['store-value-wrap']">
              <div v-for="(valueItem, valueIndex) in store.value" :key="'value' + valueIndex" :class="$style['value-wrap']">
                <div :class="$style['store-value']">{{ valueItem | number(store.valueFmt[valueIndex] || '0,0.00')}}</div>
                <div :class="$style['store-unit']">{{ store.unit[valueIndex] || '元' }}</div>
                <div :class="$style['store-split']" v-if="valueIndex < store.value.length - 1">/</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <slot name="power-comp"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    value: {
      type: Number | Array,
      required: true,
    },

    valueFmt: {
      type: String | Array,
      default: '0,0.00',
    },

    unit: {
      type: String | Array,
      required: true,
    },

    storeList: {
      type: Array,
      default: () => ([]),
    },

    storeTouchable: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    storeActive: 0,
  }),

  computed: {
    footerWidth () {
      if (this.storeList.length < 3) {
        return 100;
      } else {
        return 33.33 * this.storeList.length;
      }
    },
    storeItemWidth () {
      if (this.storeList.length < 3) {
        return 100 / this.storeList.length;
      } else {
        return 33.33;
      }
    },
  },

  methods: {
    onStoreItemClick (index) {
      if (this.storeTouchable) {
        this.storeActive = index;
        this.$emit('onStoreItemClick', index);
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    position: relative;
    width: 100%;
    height: 200px;
    background-image: url('@/assets/img/data_bg.png');
    background-size: contain;
  }

  .header {
    width: 100%;
    height: 145px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 14px;
      color: #7ac2ff; // stylelint-disable
    }

    .value {
      height: 50px;
      margin: 10px 0;
      margin-bottom: 15px;
      display: flex;
      align-items: flex-end;

      &-value {
        font-size: 50px;
        color: $color-white;

        &.small {
          font-size: 35px;
        }
      }

      &-unit {
        height: 100%;
        font-size: 16px;
        color: $color-white;
        margin-left: 8px;
        box-sizing: border-box;
        padding-top: 28px;
      }

      &-split {
        height: 100%;
        font-size: 30px;
        color: #7ac2ff;
        margin-left: 10px;
        margin-right: 10px;
        box-sizing: border-box;
        padding-top: 18px;
      }
    }
  }

  .footer-wrap {
    width: 100vw;
    overflow-x: scroll;
  }

  .footer {
    // width: 110%;
    height: 55px;
    background-color: rgba(255, 255, 255, .3);
    display: flex;
    justify-content: flex-start;
    flex-flow: row nowrap;
    align-items: center;

    .store-item {
      width: calc(100vw/3);
      /* position: relative; */
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      z-index: 5;
      // display: inline-block;

      &:not(:last-child) {
        border-right: 1px solid rgb(32, 148, 255);
      }

      .store-name {
        font-size: 12px;
        color: #c2e6fd;
      }

      .store-value-wrap {
        display: flex;
        flex-direction: row;
      }

      .value-wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .store-value {
        font-size: 16px;
        color: $color-white;
        font-weight: bold;
      }

      .store-unit {
        font-size: 14px;
        color: $color-white;
      }

      .store-split {
        font-size: 14px;
        color: $color-white;
        font-weight: bold;
        margin: 0 5px;
      }

      &.store-active:after {
        color: transparent;
        overflow: hidden;
        position: absolute;
        width: 0px;
        height: 0px;
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: #7ac2ff transparent transparent;/*灰 透明 透明 */
        bottom: -6px;
        z-index: 4;
      }
    }
  }
</style>

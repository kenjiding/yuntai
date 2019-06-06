<template>
  <div :class="$style['item-container']">
    <div :class="$style.card">
      <div :class="$style['card-header']" @click="openExpand">
        <div :class="$style['card-header__sign']"></div>
        <div :class="$style['card-header__titles']">
          <p :class="$style['card-header__title']">{{cardInfo.title}}</p>
          <p :class="$style['card-header__subtitle']">{{parseInt(cardInfo.subtitle) | date}}</p>
        </div>
        <div :class="$style['card-header__values']">
          <p :class="$style['card-header__value']">{{cardInfo.valuePrefix}} {{cardInfo.value | number(cardInfo.valueFormatter)}}</p>
          <p :class="$style['card-header__subvalue']" v-if="cardInfo.subvalue">{{cardInfo.subvalue}}</p>
        </div>
      </div>

      <div :class="$style['card-expand']" v-if="showExpand || alwaysShowExpand">
        <div :class="$style['expand-item']"
          v-if="typeof cardExpand === 'string'">
          <p :class="$style['expand-item__value']" :style="{'text-align': 'left'}">{{cardExpand}}</p>
        </div>

        <div :class="$style['expand-item']"
          v-for="(expand, index) in cardExpand"
          :key="index"
          v-else>
          <p :class="$style['expand-item__label']">{{expand.label}}</p>
          <p :class="$style['expand-item__value']">{{expand.value}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardInfo: Object,
    alwaysShowExpand: Boolean,
    cardExpand: [Array, String],
  },

  data: () => ({
    showExpand: false,
  }),

  methods: {
    openExpand () {
      if (!this.alwaysShowExpand) {
        this.showExpand = !this.showExpand;
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .item-container {
    padding: 0 16px;
  }

  .card {
    background-color: $color-white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    margin-bottom: 10px;
  }

  .card-header {
    padding: 10px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    &__sign {
      width: 5px;
      height: 40px;
      background-color: #e0c48f; // stylelint-disable-line
      margin-right: 10px;
      border-radius: $border-radius-small;
    }

    &__titles {
      flex: 1;
    }

    &__title {
      font-size: $font-size-primary;
      color: $font-color-primary;
    }

    &__subtitle {
      font-size: $font-size-special;
      color: $font-color-placeholder;
      margin-top: 8px;
    }

    &__value {
      font-size: $font-size-regular;
      color: $font-color-primary;
      text-align: right;
    }

    &__subvalue {
      font-size: $font-size-special;
      color: $font-color-placeholder;
      margin-top: 8px;
      text-align: right;
    }
  }

  .card-expand {
    background-color: $color-bg-regular;
  }

  .expand-item {
    display: flex;
    height: 45px;
    justify-content: space-between;
    padding: 0 16px;
    align-items: center;
    color: $font-color-regular;
    font-size: $font-size-special;

    &:nth-child(n + 2) {
      border-top: 1px solid $border-color;
    }

    &__label {
      width: 100px;
    }

    &__value {
      flex: 1;
      text-align: right;
    }
  }
</style>

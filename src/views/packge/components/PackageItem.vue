<template>
  <div :class="$style['package-item-wrap']">
    <van-cell-group>
      <van-field
        @input="inputValue"
        :value="currencyValue"
        :class="$style.currencyStyle"
        required
        label="游戏币"
        placeholder="请输入游戏币数量"
      />

      <van-field
        @input="inputPrice"
        :value="priceValue"
        label="售价"
        placeholder="请输入游戏币售价"
        required
      />
    </van-cell-group>

    <van-panel>
      <van-row slot="header">
        <van-col :span="12"><span>兑换积分</span></van-col>
        <van-col :span="12">
          <van-switch v-model="isPointsValue" />
        </van-col>
      </van-row>
        <van-field
          @input="inputPoints"
          :value="pointsValue"
          v-show="isPointsValue"
          placeholder="请输入兑换积分" />
    </van-panel>
  </div>
</template>

<script>
import {
  Panel,
} from 'vant';

export default {
  name: '',
  data () {
    return {
    };
  },
  props: {
    currencyValue: {
      type: [String, Number],
    },
    priceValue: {
      type: [String, Number],
    },
    isPointsValue: {
      type: Boolean,
    },
    pointsValue: {
      type: [String, Number],
    },
  },
  computed: {
    isPoints () {
      return this.isPointsValue;
    },
  },
  watch: {
    isPoints (newValue, oldValue) {
      if (!newValue) {
        this.$emit('update:pointsValue', '');
      }
    },
  },
  components: {
    [Panel.name]: Panel,
  },
  methods: {
    inputValue (val) {
      this.$emit('update:currencyValue', val);
    },
    inputPrice (val) {
      this.$emit('update:priceValue', val);
    },
    inputPoints (val) {
      this.$emit('update:pointsValue', val);
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.currencyStyle {
  &:first-of-type {
    border-bottom: 1px solid $border-color;
  }
}

.package-item-wrap {
  .van-cell-group {
    margin-bottom: 10px;

    .van-cell {
      .van-cell__value {
        input {
          text-align: right;
        }
      }
    }
  }

  .van-panel {
    padding: 7px 15px;

    .van-panel__content {
      .van-field {
        padding: 0;
        margin-top: 10px;

        input {
          background-color: $color-bg-regular;
          padding: 10px;
          margin-bottom: 10px;
        }
      }
    }

    .van-row {
      .van-col--12 {
        font-size: $font-size-special;

        &:first-of-type {
          height: 33px;
          line-height: 33px;
        }

        &:last-of-type {
          text-align: right;
        }
      }
    }
  }
}
</style>

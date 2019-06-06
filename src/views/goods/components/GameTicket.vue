<template>
  <div>
    <van-field
      v-for="(item, index) in gameGoodsDetail"
      :key="index"
      v-model="item.Detail"
      :label="'包含项目' + (index + 1)"
      placeholder="请输入项目名称"
      required
      :disabled="disabled"
      :class="$style.input"
    />
    <div :class="$style.add" @click="!disabled && $emit('addItem')">
      <van-icon name="add-o" />
      <span>添加项目</span>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    gameGoodsDetail: {
      type: Array,
      default: () => ([]),
    },
    disabled: Boolean,
  },

  data () {
    return {};
  },
  mounted () {
  },

  methods: {
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.input {
  border-bottom: 1px solid $border-color;
}

.add {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 15px 0;
  background-color: $color-white;
  color: $color-primary;

  span {
    font-size: $font-size-special;
    position: relative;
    top: -1px;
    left: 5px;
  }
}

</style>

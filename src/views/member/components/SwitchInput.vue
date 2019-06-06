<template>
  <van-cell-group :style="{marginTop: '10px'}">
    <van-cell
      :title="title">
      <van-switch
        :value="checked"
        size="25px"
        slot="right-icon"
        @input="change"
        @change="switchChange"/>
    </van-cell>
    <slot v-if="checked"></slot>
  </van-cell-group>
</template>

<script>
export default {
  name: '',
  props: {
    title: String,
    checked: Boolean,
  },

  data () {
    return {
    };
  },
  created () {},

  methods: {
    switchChange (val) {
      this.$emit('change', val);
    },
    change (val) {
      this.$emit('update:checked', val);
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

</style>

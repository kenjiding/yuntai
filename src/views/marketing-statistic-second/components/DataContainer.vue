<template>
  <div id="container">
    <condition-section
      :hiddenHeader="hiddenHeader"
      :tab-active="tabActive"
      :condition-items="conditionItems"
      @open="hiddenHeader = false"
      @change="(id, start, end) => $emit('change', id, start, end)"
      @close="hiddenHeader = true"/>
    <div :class="$style['content']" id="content">
      <slot />
    </div>
  </div>
</template>

<script>
import ConditionSection from './ConditionSection';
import scrollUtils from 'vant/packages/utils/scroll';
import { on } from 'vant/packages/utils/event';

export default {
  components: {
    ConditionSection,
  },

  props: {
    tabActive: Boolean,
    conditionItems: Array,
  },

  data: () => ({
    el: null,
    hiddenHeader: true,
  }),

  mounted () {
    this.bindScroll();
  },

  methods: {
    bindScroll () {
      this.el = this.el || this.$el.querySelector('#content');
      on(scrollUtils.getScrollEventTarget(this.el), 'scroll', this.onScroll, true);
    },

    onScroll () {
      this.hiddenHeader = true;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .content {
    position: relative;
    padding-top: 45px;
    padding-bottom: 80px;
  }
</style>

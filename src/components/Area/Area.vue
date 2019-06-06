<template>
  <!-- <div></div> -->
  <popup v-model="localVisible" position="bottom">
    <Area
      v-bind="$attrs"
      v-on="$listeners"
      :area-list="dataList"/>
  </popup>
</template>

<script type="text/javascript">
import { Area, Popup } from 'vant';
import areaData from './area';

export default {
  name: 'YchArea',

  components: {
    Area,
    Popup,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      dataList: areaData,
    };
  },

  computed: {
    localVisible: {
      get () {
        return this.visible;
      },

      set (val) {
        this.$emit('update:visible', val);
      },
    },
  },
};
</script>

<style lang="scss">
.van-picker__frame {
  position: absolute !important;
}
</style>

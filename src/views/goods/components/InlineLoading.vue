<template>
   <div
    :class="$style['loading-wrap']">
      <van-loading
        :type="type"
        :color="color"
        :size="size"/>
    </div>
</template>

<script>
import {Loading} from 'vant';
export default {
  name: '',
  data () {
    return {
    };
  },
  props: {
    color: {
      type: String,
      default: 'black',
    },
    type: {
      type: String,
      default: 'circular',
    },
    size: {
      type: String,
      default: '30px',
    },
  },

  components: {
    [Loading.name]: Loading,
  },

  methods: {},

  mounted: function () {},

  computed: {},
};

</script>
<style lang='scss' module>
.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .van-loading {
    margin: 0 0 0 -25px;
    position: absolute;
    left: 50%;
    top: 50%;
  }
}
</style>

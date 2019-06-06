<template>
  <ych-uploader ref="uploader" :after-read="onRead">
    <div :class="$style['img-wrap']">
      <img :src="content"/>
    </div>
  </ych-uploader>
</template>

<script type="text/javascript">

export default {
  name: 'app',

  data () {
    return {
      content: null,
    };
  },

  methods: {
    onRead ({ content }, fileName) {
      this.content = content;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" module>
@import '@/styles/them.scss';

.img-wrap {
  width: 200px;
  height: 200px;
  background-color: $color-white;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

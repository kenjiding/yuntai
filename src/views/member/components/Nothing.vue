<template>
  <div :class="$style.nothing">
    <div>
      <img src="../../../assets/img/nothing.png" :class="$style['nothing-img']">
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
    };
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.nothing {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: $font-color-placeholder;

  &-img {
    display: block;
    width: 200px;
    margin-bottom: 20px;
  }
}

</style>

<template>
  <div :class="$style['search-wrap']">
    <div
      :class="$style['search-box']">
      <van-icon name="search" :class="$style['search-box--icon']"/>
      <div
        :class="$style['search-box--key']">
        {{searchValue || name}}
      </div>
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
  props: ['searchValue', 'name'],

  components: {},

  methods: {
  },

  mounted: function () {},

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.search-wrap {
  width: 100%;
  overflow: hidden;
  background: $color-bg-primary;
}

.search-box {
  width: 340px;
  height: 35px;
  margin: 10px auto;
  line-height: 35px;
  background-color: $color-info;
  padding: 0 16px;
  box-sizing: border-box;
  border-radius: $border-radius;
  color: $font-color-regular;
  display: flex;
  justify-content: center;
  align-items: center;

  &--key {
    flex: 1;
  }

  &--icon {
    width: 25px;
    height: 35px;
    line-height: 35px;
    margin-top: -3px;
    font-size: $font-size-special;
  }
}
</style>

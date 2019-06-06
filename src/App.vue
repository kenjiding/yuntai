<template>
  <div id="app" :class="$style['container']">

    <keep-alive>
      <router-view v-if="$route.meta.needKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.needKeepAlive"></router-view>

  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss" module>
  .container {
    width: 100%;
    height: 100%;
  }
</style>

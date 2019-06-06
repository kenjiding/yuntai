<template>
  <ych-page>
    <div :class="$style['children-manage']">
      <van-tabs v-model="activeTab" color="#077AFF">
        <van-tab title="子账号">
          <children-list />
        </van-tab>
        <van-tab title="角色权限">
          <permission />
        </van-tab>
      </van-tabs>
    </div>
  </ych-page>
</template>

<script>
import ChildrenList from './ChildrenList.vue';
import Permission from './Permission.vue';

export default {
  name: '',
  data () {
    return {
      activeTab: 0,

    };
  },

  components: {
    ChildrenList,
    Permission,
  },

  methods: {

  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

</style>

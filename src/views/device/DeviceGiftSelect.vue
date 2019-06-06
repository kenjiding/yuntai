<template>
  <ych-page>
    <page-header
      left-arrow
      title="礼品选择"
      @click-left="$router.go(-1)"/>

    <div>

    </div>
  </ych-page>
</template>

<script>
/**
 * 设备礼品选择界面
 */
import PageHeader from '@/components/PageHeader';

export default {
  components: {
    PageHeader,
  },
};
</script>

<style lang="scss" module>

</style>

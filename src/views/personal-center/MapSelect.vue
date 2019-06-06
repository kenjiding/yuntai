<template>
  <ych-page :class="$style.mapWrap">
    <page-header
      slot="header"
      title="选择地址"
      left-arrow
      @click-left="$emit('close-popup')">
    </page-header>
      <div :class="$style.mapcontainer">
        <iframe
          id="mapPage"
          width="100%"
          :height="screenInfo.screenHeight"
          frameborder=0
          :src="mapSrc">
        </iframe>
      </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';

export default {
  name: '',

  props: {
    latlngLoc: {
      type: Object,
      default: () => {},
    },
    screenInfo: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    latNum () {
      return this.latlngLoc.Latitude === '0.00000' ? null : this.latlngLoc.Latitude;
    },
    Longitude () {
      return this.latlngLoc.Longitude === '0.00000' ? null : this.latlngLoc.Longitude;
    },
  },

  watch: {
    latNum (val, oldVal) {
      this.locationHandle();
    },
  },

  components: {
    PageHeader,
  },

  data () {
    return {
      mapSrc: 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&mapdraggable=1&key=P4LBZ-F3SAX-VCI4D-7SNBV-DTD6K-I2FVN&referer=dingkey',
    };
  },

  mounted () {
    window.addEventListener('message', (event) => {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      var loc = event.data;
      if (loc && loc.module === 'locationPicker') { //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.$emit('after-select', loc);
      }
    }, false);
  },

  methods: {
    locationHandle () {
      if (this.latNum && this.Longitude) {
        this.mapSrc = `https://apis.map.qq.com/tools/locpicker?search=1&type=1&mapdraggable=1&key=P4LBZ-F3SAX-VCI4D-7SNBV-DTD6K-I2FVN&referer=dingkey&coord=${this.latNum},${this.Longitude}`;
      };
    },
  },
  created () {
    this.locationHandle();
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.mapWrap {
  .ych-page__content {
    width: 100% !important;
    height: 100% !important;
  }
}

.mapcontainer {
  width: 100%;
  height: 100%;
}

</style>

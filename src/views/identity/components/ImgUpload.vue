<template>
  <div
    :class="$style.uploadWrap"
    ref="imgUpload">
      <ych-uploader
        :disabled="uploadStatus"
        :after-read="upload_step"
        :class="$style.uploadImg"
        @oversize="overTouch">
        <div v-show="iconShow" :class="$style.addIcon">
          <van-icon name="tianjia" />
          <p :class="$style['pText']">{{bottomText}}</p>
        </div>
      </ych-uploader>
      <div
        :class="$style['img-mark']"
        v-show="markText">{{bottomText}}</div>
  </div>
</template>

<script>

export default {
  name: '',
  created () {
    // 当需要回填信息的时候，才监听imgSource
    if (this.markText) {
      let unwatch = this.$watch('imgSource', (val) => {
        if (!val) return;
        this.$refs.imgUpload.style.backgroundImage = `url(${val})`;
        unwatch();
      });
    }
  },

  data () {
    return {
    };
  },
  props: {
    //控制回填信息的时候，底部的文字隐藏显示
    markText: {
      type: Boolean,
      default: false,
    },
    //控制上传图片的icon显示隐藏
    iconShow: {
      type: Boolean,
      default: true,
    },
    bottomText: {
      type: String,
      default: '图片名称',
    },
    uploadStatus: {
      type: Boolean,
      default: false,
    },
    imgSource: {
      type: String,
      default: '',
    },
  },

  components: {
  },

  methods: {
    overTouch (file, content) {
      this.$emit('oversize', file, content);
    },
    upload_step (file, key) {
      this.$emit('afterRead', key);
      this.$refs.imgUpload.style.backgroundImage = `url(${file.content})`;
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.img-mark {
  width: 100%;
  height: 20px;
  background-color: rgba(102, 102, 102, .8);
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: $font-size-special;
  text-align: center;
  line-height: 20px;
  color: $color-white;
}

.uploadWrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110px;
  width: 160px;
  box-sizing: border-box;
  background-color: $color-white;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 1px solid $border-color;
  margin: 2px;

  .uploadImg {
    text-align: center;
    width: 100%;
    height: 100%;
    color: $font-color-placeholder;

    .addIcon {
      margin-top: 25px;

      .van-icon-tianjia {
        font-size: 35px;
      }

      .pText {
        font-size: 11px;
        padding-top: 10px;
      }
    }
  }
}
</style>

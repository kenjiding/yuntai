<template>
  <div class="ych-uploader">
    <transition name="van-fade">
      <div
        class="ych-uploader__circle"
        v-show="currentRate > 0 && currentRate < 100"
      >
        <van-circle
          class="ych-uploader__circle-child"
          v-model="currentRate"
          :rate="0"
          :speed="100"
          :text="currentRateText"
        />
      </div>
    </transition>
    <slot />
    <input
      class="ych-uploader__input"
      v-bind="$attrs"
      ref="input"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @change="onChange"
    >
  </div>
</template>

<script>
import NosJSSDK from '@/util/nos-js-sdk';
import File from '@/api/File';

export default {
  name: 'YchUploader',

  inheritAttrs: false,

  props: {
    //是否压缩
    compression: {
      type: Boolean,
      default: true,
    },
    //压缩比例，取0-1之间的值，只有当compression压缩开启才有效
    quality: {
      validator: function (value) {
        // 这个值必须取0-1之间的值数字
        return ((typeof value === 'number') && (value >= 0 && value <= 1));
      },
    },
    abc: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1;
      },
    },
    disabled: Boolean,
    beforeRead: Function,
    afterRead: Function,
    accept: {
      type: String,
      default: 'image/*',
    },
    resultType: {
      type: String,
      default: 'dataUrl',
    },
    maxSize: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    uploadType: {
      type: String,
      default: 'private',
    },
  },

  data () {
    return {
      currentRate: 0,
    };
  },

  computed: {
    currentRateText () {
      return this.currentRate + '%';
    },
  },

  methods: {
    onChange (event) {
      let { files } = event.target;
      if (this.disabled || !files.length) {
        return;
      }

      files = files.length === 1 ? files[0] : [].slice.call(files, 0);
      if (!files || (this.beforeRead && !this.beforeRead(files))) {
        return;
      }

      if (Array.isArray(files)) {
        Promise.all(files.map(this.readFile)).then(contents => {
          let oversize = false;
          const payload = files.map((file, index) => {
            if (file.size > this.maxSize) {
              oversize = true;
            }

            return {
              file: files[index],
              content: contents[index],
            };
          });

          this.onAfterRead(payload, oversize);
        });
      } else {
        this.readFile(files).then(content => {
          this.onAfterRead(
            { file: files, content },
            files.size > this.maxSize
          );
        });
      }
    },

    readFile (file) {
      return new Promise(resolve => {
        const reader = new FileReader();

        reader.onload = event => {
          resolve(event.target.result);
        };

        if (this.resultType === 'dataUrl') {
          reader.readAsDataURL(file);
        } else if (this.resultType === 'text') {
          reader.readAsText(file);
        }
      });
    },

    uploadNos (files) {
      let _this = this;

      return new Promise((resolve, reject) => {
        let method = _this.uploadType === 'public' ? 'generatePublicUploadToken' : 'generatePrivateUploadToken';
        File[method]({
          FileName: files.file.name,
        }).then((data) => {
          let uploadResult = null;
          const nosUploader = NosJSSDK({
            isCompression: this.compression,
            quality: this.quality,
            fileInputEl: this.$refs.input.$el,
            onProgress: ({ progress }) => {
              this.currentRate = Number(progress);
              if (progress >= 100) {
                console.log(data);
                resolve(data.UploadName, uploadResult);
              }
            },
            onError: (error) => {
              this.currentRate = 100;
              let msg = typeof error === 'object' ? error.errMsg : error;
              this.$toast(msg);
            },
          });

          const param = {
            bucketName: data.Bucket,
            objectName: data.UploadName,
            token: data.Token,
          };

          nosUploader.addFile(files, () => {
            uploadResult = nosUploader.upload(param);
          });

        // return Promise.resolve(data.UploadName, uploadResult);
        });
      });
    },

    onAfterRead (files, oversize) {
      if (oversize) {
        this.$emit('oversize', files);
      } else {
        this.uploadNos(files).then((uploadName, uploadResult) => {
          this.afterRead && this.afterRead(files, uploadName, uploadResult);
          this.$refs.input && (this.$refs.input.value = '');
        });
      }
    },
  },
};
</script>

<style lang="scss">
  @import '@/styles/them.scss';

  .ych-uploader {
    position: relative;
    display: inline-block;

    &__input {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    &__circle {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: transparentize($color-black, .2);

      &-child {
        width: 50% !important;
        height: 50% !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .van-circle__text {
          color: $color-white;
        }
      }
    }

    input[type="file"]::-webkit-file-upload-button {
      cursor: pointer;
    }
  }
</style>

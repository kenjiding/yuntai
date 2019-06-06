<template>
  <van-popup
    v-model="localValue"
    :overlay="overlay"
    :lock-scroll="lockScroll"
    :close-on-click-overlay="closeOnClickOverlay"
    class="ych-dialog__popup"
    >
    <div
      class="ych-dialog"
      :class="[`ych-dialog--${themeColor}`]"
    >
      <div
        v-if="$slots.title || title"
        class="ych-dialog--header van-hairline--bottom">
        <slot name="title">
          <span class="ych-dialog--header--default"> {{ title }} </span>
        </slot>
      </div>

      <div class="ych-dialog-content">
        <slot name="default">
          <span
            v-html="message"
            class="ych-dialog-content--default"
            >
          </span>
        </slot>
      </div>

      <div class="ych-dialog__operation">
        <div
          v-if="showCancelButton"
          class="ych-dialog__operation--cancel">
          <van-button
            @click="handleOperationClick('cancel')"
            :loading="loading === 'cancel'"
            class="ych-dialog__operation-btn"
          >
            {{ cancelButtonText }}
          </van-button>
        </div>
        <div
          v-if="showConfirmButton"
          class="ych-dialog__operation--confirm">
          <van-button
            @click="handleOperationClick('confirm')"
            class="ych-dialog__operation-btn"
            :loading="loading === 'confirm'"
            :class="[`ych-dialog__operation-btn--${themeColor}`]"
          >
            {{ confirmButtonText }}
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
import { Popup } from 'vant';

export default {
  name: 'YchDialog',

  components: {
    VanPopup: Popup,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    title: String,

    message: String,

    showConfirmButton: {
      type: Boolean,
      default: true,
    },

    showCancelButton: {
      type: Boolean,
      default: true,
    },

    confirmButtonText: {
      type: String,
      default: '确认',
    },

    cancelButtonText: {
      type: String,
      default: '取消',
    },

    overlay: {
      type: Boolean,
      default: true,
    },

    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },

    theme: {
      type: String,
      default: 'primary',
    },

    lockScroll: {
      type: Boolean,
      default: false,
    },

    beforeClose: {
      type: Function,
    },

    callback: Function,
  },

  computed: {
    localValue: {
      get () {
        return this.value;
      },

      set (val) {
        this.$emit('input', val);
      },
    },

    themeColor () {
      const themeColors = ['primary', 'success', 'warning', 'danger', 'info'];
      return themeColors.indexOf(this.theme) > -1 ? this.theme : themeColors[0];
    },
  },

  data () {
    return {
      loading: null,
    };
  },

  methods: {
    handleOperationClick (action) {
      if (this.beforeClose) {
        this.loading = action;
        this.beforeClose(action, (is = true) => {
          if (is) {
            this.handleOperationAction(action);
          }
          this.loading = null;
        });
      } else {
        this.handleOperationAction(action);
      }
    },

    handleOperationAction (action) {
      this.$emit('input', false);
      this.$emit(action);
      this.callback && this.callback(action);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/them.scss";

.ych-dialog {
  width: 300px;
  border: 2px solid transparent;
  border-radius: $border-radius;
  background-color: $color-white;

  &--primary {
    border-color: $color-primary !important;
  }

  &--success {
    border-color: $color-success !important;
  }

  &--warning {
    border-color: $color-warning !important;
  }

  &--danger {
    border-color: $color-danger !important;
  }

  &--info {
    border-color: $color-info !important;
  }

  &--header {
    height: 50px;
    line-height: 50px;
    border-color: $border-color;

    &--default {
      font-size: $font-size-regular;
      color: $font-color-primary;
      text-align: center;
      width: 100%;
      display: inline-block;
    }
  }

  &-content {
    padding: 2px;

    &--default {
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      padding: 20px 30px;
      text-align: center;
      font-size: $font-size-primary;
      color: $font-color-regular;
      line-height: 30px;
    }
  }

  &__operation {
    border-bottom-right-radius: $border-radius - 2px;
    border-bottom-left-radius: $border-radius - 2px;
    overflow: hidden;
    display: flex;

    & .ych-dialog__operation-btn {
      width: 100%;
      border-radius: 0;
    }

    &--cancel {
      width: 45%;
      display: inline-block;
      color: $color-black;

      & .ych-dialog__operation-btn {
        background-color: $color-info;
        border-color: $color-info;
        color: $font-color-secondary;
      }
    }

    &--confirm {
      width: 55%;
      display: inline-block;
      flex: 1;

      & .ych-dialog__operation-btn {
        color: $color-white;

        &--primary {
          background-color: $color-primary !important;
          border-color: $color-primary !important;
        }

        &--success {
          background-color: $color-success !important;
          border-color: $color-success !important;
        }

        &--warning {
          background-color: $color-warning !important;
          border-color: $color-warning !important;
        }

        &--danger {
          background-color: $color-danger !important;
          border-color: $color-danger !important;
        }

        &--info {
          background-color: $color-info !important;
          border-color: $color-info !important;
        }
      }
    }
  }

  &__popup {
    background-color: transparent;
    border-radius: $border-radius;
    overflow: hidden;
  }
}
</style>

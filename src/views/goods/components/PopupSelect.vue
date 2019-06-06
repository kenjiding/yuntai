<template>

  <van-popup
    v-model="popupStatus"
    position="right"
    :class="$style['popup-wrap']"
    v-bind="$attrs"
    v-on="$listeners"
    :close-on-click-overlay="false">
    <page-header
      title="请选择分组"
      left-text="返回"
      left-arrow
      @click-left="$emit('popupStatusHandle')"
    />

    <inlineLoading
      v-show="isLoading"
      type="spinner"
      size="40px">
    </inlineLoading>

    <div :class="$style['popup-content-style']">
      <van-cell
        v-for="(item,index) in storeList"
        :class="{[$style.popupCellItem]: true, [$style.cellBorderActive] : (isActive == index)}"
        :title="item.Name"
        :key="index"
        @click="toggle(index,item)"
        >
        <template slot="right-icon">
          <van-icon name="fankui" @click.stop="editGroup(item.ID)"/>
          <van-icon name="close" @click.stop="deleteGroup(item)"  v-if="!item.IsSystem"/>
        </template>
      </van-cell>
    </div>

    <van-dialog
      v-model="editGroupShow"
      show-cancel-button
      :before-close="beforeClose">
      <van-field
        v-model="groupName"
        placeholder="请输入分组名称"
        :class="$style['ranking-input']"
        @blur="scrollPage"/>
    </van-dialog>

    <bottomButton
      text="添加分组"
      @confirm="addGoodsGroup" />
  </van-popup>
</template>

<script>
import { Popup, Dialog, Toast } from 'vant';
import PageHeader from '@/components/PageHeader';
import inlineLoading from './InlineLoading';
import bottomButton from '@/components/BottomButton';
import goodsListApi from '@/api/GoodsList';

export default {
  name: '',
  data () {
    return {
      isActive: null,
      groupName: '',
      editGroupShow: false,
      groupID: '',
      apiName: '',
      storeList: [],
      isLoading: false,
      isdeleteGroup: false,
    };
  },
  props: {
    defaultGroup: String,
    titleText: {
      type: String,
      default: '请选择',
    },
    popupStatus: {
      type: Boolean,
      default: false,
    },
    popupHeight: {
      type: Number,
      default: 40,
    },
  },
  components: {
    inlineLoading,
    PageHeader,
    bottomButton,
    [Dialog.name]: Dialog,
    [Popup.name]: Popup,
  },
  methods: {
    getGroupList () {
      this.isLoading = true;
      goodsListApi.getGoodsGroup().then(res => {
        //将商品分组里面的‘游戏币分组’剔除掉
        res.data.splice(
          res.data.findIndex(
            item => item.Name === '游戏币套餐'
          ), 1);
        this.storeList = res.data;
        this.isLoading = false;
        this.isActive = this.storeList.findIndex(item => item.ID === this.defaultGroup);
      });
    },
    addGoodsGroup () {
      this.apiName = 'addGoodsGroup';
      this.editGroupShow = true;
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (!this.groupName) {
          Toast('请输入分组名称');
          return done(false);
        }
        goodsListApi[this.apiName]({
          groupName: this.groupName,
          ID: this.groupID,
        }).then((res) => {
          Toast(`分组${this.apiName === 'addGoodsGroup' ? '添加' : '编辑'}成功`);
          this.dialogValue = false;
          this.groupName = '';
          this.apiName = '';
          this.groupID = '';
          this.getGroupList();
          done();
        }, _ => {
          this.groupName = '';
          done();
        });
      } else {
        this.groupName = '';
        done();
      }
    },
    scrollPage () {
      document.body.scrollTop = document.body.scrollHeight;
    },
    editGroup (id) {
      this.apiName = 'editGoodsGroup';
      this.editGroupShow = true;
      this.groupID = id;
    },
    deleteGroup (data) {
      this.$dialog.confirm({
        title: '提醒',
        message: `该“${data.Name}”分组下可能存在商品，删除该分组后会将原有商品重新分配到默认分组下`,
        theme: 'danger',
      }).then(() => {
        goodsListApi.deletedGoodsGroup({ID: data.ID}).then((res) => {
          Toast('删除分组成功');
          // this.$emit('popupStatusHandle');
          this.$emit('deleteGroup');
          this.getGroupList();
        });
      }).catch(() => {});
    },

    toggle (index, val) {
      this.isActive = index;
      this.$emit('popupStatusHandle');
      this.$emit('afterSelect', val, this.titleText);
    },
  },

  watch: {
    popupStatus (val) {
      if (!val) return;
      this.getGroupList();
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.ranking-input {
  border-bottom: 1px solid $border-color;

  .van-cell__value--alone {
    padding: 0 20px;
  }

  input {
    text-align: center !important;
    padding: 10px 0;
    margin: 20px 0;
    border: 1px solid $font-color-secondary;
    border-radius: $border-radius-small;
  }
}

.popup-wrap {
  width: 100%;
  height: 100%;

  .popup-content-style {
    overflow: auto;

    .popupCellItem {
      color: $font-color-placeholder;
      font-size: $font-size-primary;

      .van-icon {
        width: 25px;
        height: 25px;
        text-align: center;
        font-size: $font-size-regular;
      }

      .van-icon-close {
        margin-left: 10px;
        font-size: $font-size-secondary;
      }

      &:last-of-type {
        margin-bottom: 60px;
      }
    }

    .cellBorderActive {
      color: $color-primary;
    }
  }
}
</style>

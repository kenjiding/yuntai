<template>
  <div :class="$style['children-list']">
    <searchItem
      :type="'text'"
      placeholder="可搜索姓名/手机号"
      history-name="childrenSearchHistory"
      backGround="#FAFAFA"
      @search="searchHandle"
      ref="search-item"/>
    <div :class="$style['children-list-wrap']">
      <van-cell-group>
        <van-cell
          v-for="item in currentDataList"
          :key="item.ID"
          is-link
          @click="goToPage(item.ID)">
          <template slot="title">
            <p>{{item.name}} <span :style="{color: '#aaaaaa', display: 'inline'}">{{' (' + whichRole(item.role) + ')'}}</span></p>
            <p :class="$style.label">{{`${item.phoneNum} | ${'门店权限:' + (item.role === 'admin' ? '全部' : (item.permissionNum + '家'))}`}}</p>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-button
        type="primary"
        :class="$style['children-list-add']"
        @click="addChildren">
        新增子账号
    </van-button>
  </div>
</template>

<script>
import PersonApi from '@/api/Person';
import searchItem from '@/components/SearchItem';
import { Toast } from 'vant';

export default {
  name: '',
  data () {
    return {
      popupShow: false,
      listData: [],
      searchValue: '',
      searchDataList: [],
    };
  },

  components: {
    searchItem,
  },

  computed: {
    currentDataList () {
      return this.searchValue ? this.searchDataList : this.listData;
    },
  },

  created: function () {
    this.getDataHandler();
  },

  methods: {
    whichRole (val) {
      let name = {
        partner: '合伙人',
        manager: '店长',
        employee: '收银员',
        admin: '超级管理员',
      };
      return name[val];
    },

    whichPermissionCount (val) {
      let permissionCount = {
        partner: 2,
        manager: 15,
        employee: 9,
        admin: 17,
      };
      return permissionCount[val];
    },

    goToPage (id) {
      this.$router.push({
        path: '/personal-center-children-manage/children-edit',
        query: { isEdit: 'true', uid: id },
      });
    },
    addChildren () {
      this.$router.push({
        path: '/personal-center-children-manage/children-add',
        query: { isEdit: 'false' },
      });
    },
    getDataHandler () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      PersonApi.getChildAccountList().then((res) => {
        this.listData = res.DataList;
        Toast.clear();
      });
    },
    searchHandle (value) {
      this.searchValue = value;
      //启用搜索功能时，要将页码置 1 ，并将列表数据清空
      this.searchDataList = [];
      // this.searchPageIndex = 1;
      value && this.getSearchData();
    },

    getSearchData () {
      PersonApi.getChildAccountList({
        Condition: this.searchValue,
      }).then((res) => {
        this.searchDataList = this.searchDataList.concat(res.DataList);
      });
    },

  },

};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.label {
  font-size: $font-size-mini;
  color: $font-color-placeholder;
  margin-top: 3px;
}

.children-list {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: $color-bg-secondary;

  &-add {
    border-radius: $border-radius-small;
    width: 95%;
    margin-top: 6px;
  }

  &-wrap {
    height: calc(100vh - 155px);
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: $color-bg-secondary;

    [class*=van-hairline]::after {
      content: none;
    }

    .van-cell-group {
      background-color: $color-bg-secondary;
    }

    .van-cell {
      height: 80px;
      padding: 15px;

      .van-icon-arrow {
        display: flex;
        align-items: center;
      }

      .van-cell__title {
        font-size: $font-size-primary;
        // flex: none;
        // width: 70%;

        span {
          display: block;
        }

        .van-cell__label {
          color: $font-color-placeholder;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>

<template>
  <ych-page>
    <div :class="$style['children-info-wrap']">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in permissionListData"
          is-link
          :key="index"
          :title="item.RoleName"
          :value="item.permissionCount + '项权限'"
          @click="goToSelectPage(item.role)" />
      </van-cell-group>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
//import PersonApi from '@/api/Person';

export default {
  name: '',
  data () {
    return {
      popupShow: false,
      permissionListData: [
        {
          role: 'admin',
          RoleName: '超级管理员',
          permissionCount: 25,
          label: '超级管理员',
        },
        {
          role: 'manager',
          RoleName: '店长',
          permissionCount: 21,
          label: '店长',
        },
        {
          role: 'partner',
          RoleName: '合伙人',
          permissionCount: 1,
          label: '合伙人',
        },
        {
          role: 'cashier',
          RoleName: '收银员',
          permissionCount: 8,
          label: '员工',
        },
      ],
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    goToSelectPage (name) {
      this.$router.push({
        path: '/personal-center-children-manage/permission-select',
        query: {
          roleName: name,
        },
      });
    },
    getData () {
      // PersonApi.getRolePermission().then((res) => {
      //   this.permissionListData = res.Data;
      // });
    },
  },

  created: function () {
    this.getData();
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.children-info-wrap {
  padding: 10px 0 0;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;
  }

  .van-cell {
    padding-left: 10px;

    .van-cell__value {
      color: $font-color-placeholder;
      text-align: right;
    }

    .van-cell__title {
      font-size: $font-size-primary;

      span {
        display: block;
      }
    }
  }
}
</style>

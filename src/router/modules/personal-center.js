export default [
  {
    path: '/personal-map',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/MapSelect'),
    name: 'personal-map',
  },
  {
    path: '/personal-center-children-manage',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChildrenManage'),
    name: 'personal-center-children-manage',
  },
  {
    path: '/personal-center-children-manage/children-add',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChildrenManage/ChildrenAdd'),
    name: 'personal-center-children-add',
    alias: '/personal-center-children-manage/children-edit',
  },
  {
    path: '/personal-center-children-manage/permission-select',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChildrenManage/PermissionSelect'),
    name: 'personal-center-permission-select',
  },
  {
    path: '/personal-center-paycode',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/OpenPayment'),
    name: 'personal-center-paycode',
  },
  {
    path: '/personal-center-children-manage/store-select',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChildrenManage/StoreSelect'),
    name: 'personal-center-store-select',
    alias: '/personal-center-children-manage/store-select-from-add',
  },
  {
    path: '/personal-center-children-manage/permission',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChildrenManage/Permission'),
    name: 'personal-center-permission',
  },
  {
    path: '/weapp-phone-bind',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/WeappPhoneBind'),
    name: 'weappPhoneBind',
  },
  {
    path: '/wipe-zero-setting',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/WipeZeroSetting'),
    name: 'wipe-zero-setting',
  },
  {
    path: '/ticket-printer-setting',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/TicketPrinterSetting'),
    name: 'ticket-printer-setting',
  },
  {
    path: '/personal-center',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/Index'),
    name: 'personal-center',
  },
  {
    path: '/tenant-info',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/TenantInfo'),
    name: 'tenant-info',
  },
  {
    path: '/push-message',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/PushMessage'),
    name: 'push-message',
  },
  {
    path: '/network-setting',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/NetworkSetting'),
    name: 'network-setting',
  },
  {
    path: '/feed-back',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/FeedBack'),
    name: 'feed-back',
  },
  {
    path: '/integration',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/IntegrationChange'),
    name: 'integration',
  },
  {
    path: '/change-tenant',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/ChangeTenant'),
    name: 'change-tenant',
    meta: {
      title: '切换主体',
    },
  },
  {
    path: '/tenant-manage',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/TenantManage'),
    name: 'tenant-manage',
  },
  {
    path: '/person-info',
    name: 'person-info',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/PersonInfo'),
    meta: {
      title: '主体信息',
    },
  },
  {
    path: '/mini-pro-info',
    name: 'mini-pro-info',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/MiniProInfo'),
    meta: {
      title: '小程序二维码',
    },
  },
  {
    path: '/mini-pro-setting',
    name: 'mini-pro-setting',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/MiniProSetting'),
    meta: {
      title: '风格设置',
      needKeepAlive: true,
    },
  },
  {
    path: '/mini-pro-preview',
    name: 'mini-pro-preview',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/MiniProPreview'),
    meta: {
      title: '小程序自定义风格预览',
    },
  },
  {
    path: '/payment-manage',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/PaymentManage'),
    name: 'payment-manage',
  },
  {
    path: '/edit-payment',
    component: () => import(/* webpackChunkName: "personal-center" */ '@/views/personal-center/components/EditPayment'),
    name: 'edit-payment',
  },
];

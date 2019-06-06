export default [
  {
    path: '/gift-management',
    name: 'gift-management',
    component: () => import(/* webpackChunkName: "gift-management" */ '@/views/gift-management/Index'),
  },
  {
    path: '/gift-setting',
    name: 'gift-setting',
    component: () => import(/* webpackChunkName: "gift-management" */ '@/views/gift-management/GiftSetting'),
  },
];

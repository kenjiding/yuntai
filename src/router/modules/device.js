export default [
  {
    path: '/tenant-list',
    name: 'tenant-list',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/Index'),
  },
  {
    path: '/tenant-detail',
    name: 'tenant-detail',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/TenantDetail'),
  },
  {
    path: '/device-detail',
    name: 'device-detail',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceDetail'),
  },
  {
    path: '/device-setting',
    name: 'device-setting',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceSetting'),
  },
  {
    path: '/device-gift-setting',
    name: 'device-gift-setting',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceGiftSetting'),
  },
  {
    path: '/game-device-setting',
    name: 'game-device-setting',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/GameDeviceSetting'),
  },
  {
    path: '/device-gift-select',
    name: 'device-gift-select',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceGiftSelect'),
  },
  {
    path: '/device-probability-setting',
    name: 'device-probability-setting',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/ProbabilitySetting'),
  },
  {
    path: '/device-register',
    name: 'device-register',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceRegister'),
  },
  {
    path: '/device-register-code',
    name: 'device-register-code',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceRegisterCode'),
    meta: { openJsSdk: true },
  },
  {
    path: '/device-rate-setting',
    name: 'device-rate-setting',
    component: () => import(/* webpackChunkName: "device" */ '@/views/device/DeviceRateSetting'),
  },
];

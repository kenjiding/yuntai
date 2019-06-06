export default [
  {
    path: '/customer-appeal',
    name: 'customer-appeal',
    component: () => import(/* webpackChunkName: "customer-appeal" */ '@/views/customer-appeal/Index'),
  },
  {
    path: '/device-logs',
    name: 'device-logs',
    component: () => import(/* webpackChunkName: "customer-appeal" */ '@/views/customer-appeal/DeviceLogs'),
  },
];

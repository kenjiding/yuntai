export default [
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
    meta: { openJsSdk: true },
  },
  {
    path: '/order-detail',
    name: 'order-detail',
    component: () => import(/* webpackChunkName: "order" */ '@/views/order/OrderDetail'),
  },
];

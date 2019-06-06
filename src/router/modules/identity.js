export default [
  {
    path: '/identity',
    name: 'identity',
    component: () => import(/* webpackChunkName: "identity" */ '@/views/identity/Index'),
  },
  {
    path: '/validate-money',
    name: 'validate-money',
    component: () => import(/* webpackChunkName: "identity" */ '@/views/identity/ValidateMoney'),
  },
];

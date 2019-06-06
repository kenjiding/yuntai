export default [
  {
    path: '/package',
    name: 'package',
    component: () => import(/* webpackChunkName: "packge" */ '@/views/packge/Index'),
  },
  {
    path: '/package-batch',
    name: 'package-batch',
    component: () => import(/* webpackChunkName: "packge" */ '@/views/packge/PackageBatch'),
  },
  {
    path: '/package-add',
    name: 'package-add',
    component: () => import(/* webpackChunkName: "packge" */ '@/views/packge/PackgeAdd'),
    props: {isEdit: false},
  },
  {
    path: '/package-edit',
    name: 'package-edit',
    component: () => import(/* webpackChunkName: "packge" */ '@/views/packge/PackgeAdd'),
    props: {isEdit: true},
  },
];

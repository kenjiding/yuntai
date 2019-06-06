export default [
  {
    path: '/philately',
    name: 'philately',
    component: () => import(/* webpackChunkName: "philately" */ '@/views/philately/Index'),
  },
  {
    path: '/add-philately',
    name: 'add-philately',
    component: () => import(/* webpackChunkName: "philately" */ '@/views/philately/AddOrEditPhilately'),
    props: {isEdit: false},
  },
  {
    path: '/edit-philately',
    name: 'edit-philately',
    component: () => import(/* webpackChunkName: "philately" */ '@/views/philately/AddOrEditPhilately'),
    props: {isEdit: true},
  },
];

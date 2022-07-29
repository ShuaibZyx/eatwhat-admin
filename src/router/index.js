import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Home = () => import("../components/Home.vue");
const Ingredient = () => import("../views/Ingredient.vue");
const Menu = () => import("../views/Menu.vue");
const User = () => import("../views/User.vue");
const Authority = () => import("../views/Authority.vue");
const Login = () => import("../components/Login.vue");

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/ingredient",
      children: [
        { path: "/ingredient", component: Ingredient },
        { path: "/menu", component: Menu },
        { path: "/user", component: User },
        { path: "/authority", component: Authority },
      ],
    },
  ],
});

// 挂载路由前置守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径而来
  // next表示是否放行next()放行 或 next('')跳转走

  //首先判断用户是否已经登录
  const admin = JSON.parse(window.sessionStorage.getItem("admin"));
  if (to.path !== "/login") {
    if (admin !== null) {
      //已经登录
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;

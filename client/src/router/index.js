import Vue from "vue";
import VueRouter from "vue-router";

//normal loading
// import SelectWord from "../views/SelectWord.vue";

//lazy loading parts
const Index = () => import( "../views/Index.vue");
const LoginOrSignup = () => import( "../views/LoginOrSignup.vue");
const UserInputs = () => import( "../views/UserInputs.vue");
const SelectWord = () => import(/* webpackPreload: true */ "../views/SelectWord.vue");
const DefineWord = () => import(/* webpackPreload: true */ "../views/WordDef.vue");
const PartOne = () => import(/* webpackPreload: true */ "../views/Part1.vue");
const PartTwo = () => import(/* webpackPreload: true */ "../views/Part2.vue");
const PartThree = () => import(/* webpackPreload: true */ "../views/Part3.vue");
const Results = () => import(/* webpackPreload: true */ "../views/Results.vue");

// const EnglishPart = () =>
//   import(/* webpackPrefetch: true */ "../views/EnglishLevel.vue");
// const MemoryPart = () =>
//   import(/* webpackPrefetch: true */ "../views/MemoryLevel.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
  },
  {
    path: "/login",
    name: "login",
    component: LoginOrSignup,
  },
  {
    path: "/signup",
    name: "signup",
    component: LoginOrSignup,
  },
  // {
  //   path: "/english-Part",
  //   name: "EnglishPart",
  //   component: EnglishPart,
  // },
  // {
  //   path: "/memory-Part",
  //   name: "MemoryPart",
  //   component: MemoryPart,
  // },
  {
    path: "/users-words",
    name: "UserInputs",
    component: UserInputs,
  },
  {
    path: "/select-word",
    name: "SelectWord",
    component: SelectWord,
  },
  {
    path: "/define-word",
    name: "DefineWord",
    component: DefineWord,
  },
  {
    path: "/part-1",
    name: "PartOne",
    component: PartOne,
  },
  {
    path: "/part-2",
    name: "PartTwo",
    component: PartTwo,
  },
  {
    path: "/part-3",
    name: "PartThree",
    component: PartThree,
  },
  {
    path: "/results",
    name: "results",
    component: Results,
  },
  {
    path: "*",
    redirect: "/",
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route Part code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

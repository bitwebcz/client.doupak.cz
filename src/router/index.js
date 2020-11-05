import { createWebHistory } from "vue-router"
import Home from "@/views/Home"
import About from "@/views/About"
import Login from "@/views/Login"
import NotFound from "@/views/NotFound"
import RouterExamples from "@/components/RouterExamples"
import ErrorLayout from "@/layouts/ErrorLayout"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, // import("@/views/Home") // horthand
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/user/:name",
    name: "RouterExamples",
    component: RouterExamples,
    props: true, // pass to component as prop (name)
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
        requiresAuth: true
    }
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
        layout: ErrorLayout
    }
  },
]

export default {
  history: createWebHistory(),
  routes
}

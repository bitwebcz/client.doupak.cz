import { createWebHistory } from "vue-router"
import Home from "@/views/Home";
import About from "@/views/About";
import NotFound from "@/views/NotFound";
import RouterExamples from "@/components/RouterExamples";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, // import("@/views/Home") // horthand
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
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
]

export default {
  history: createWebHistory(),
  routes
}

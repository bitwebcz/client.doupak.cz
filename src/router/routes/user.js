import RouterExamples from "@/components/RouterExamples"

export default [
      {
        path: "/user/",
        name: "User",
        component: RouterExamples
      },
      {
        path: "/user/:name",
        name: "RouterExamples",
        component: RouterExamples,
        props: true, // pass to component as prop (name)
      }
]

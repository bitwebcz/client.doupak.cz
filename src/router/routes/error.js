import NotFound from "@/views/NotFound"
import ErrorLayout from "@/layouts/ErrorLayout"

export default [
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
      meta: {
          layout: ErrorLayout
      }
    }
]

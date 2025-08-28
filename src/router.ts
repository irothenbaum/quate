import {createWebHistory, createWebHashHistory, createRouter} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import * as Routes from '@/constants/routes'
import Landing from '@/components/Landing.vue'
import NotFound from '@/components/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: Routes.ROUTE_LANDING,
    component: Landing,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

removeParentsRecursive(routes)

export default createRouter({
  history: createWebHistory(),
  routes,
})

// -------------------------------------------------------------

function removeParentsRecursive(routeArr: Array<RouteRecordRaw>, parent: RouteRecordRaw | undefined = undefined): void {
  if (routeArr.length === 0) {
    return
  }

  for (const r of routeArr) {
    // name is the full path before modifications are made
    r.name = r.path

    if (r.children) {
      removeParentsRecursive(r.children, r)
    }

    if (parent) {
      r.path = routeWithoutParent(r.path, parent.path)

      // this resolves a warning when the first child is a root path ('')
      // vue router advises the parent's name be placed on the child root path instead of the parent
      if (r.name === '') {
        r.name = parent.name
        delete parent.name
      }
    }
  }
}

function routeWithoutParent(route: string, parent: string): string {
  if (route.startsWith(parent)) {
    return route.slice(parent.length + 1) // + 1 to remove the leading slash
  }
  return route
}

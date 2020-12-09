/**
 * A module to nest all the routes within a another router.
 * @module routes/routes
 * @author Faizaan Chowdhary
 * @requires koa-router
 * @requires public.js
 * @requires secure.js
 */
import Router from 'koa-router'


import { publicRouter } from './public.js'
import { secureRouter } from'./secure.js'


const apiRouter = new Router()


const nestedRoutes = [publicRouter, secureRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }

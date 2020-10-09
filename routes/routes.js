
import Router from 'koa-router'


import { publicRouter } from './public.js'
import { secureRouter } from'./secure.js'

const apiRouter = new Router()

// apiRouter.post('/login', async ctx => {
// 	console.log(ctx.request.body)
// 	ctx.redirect(`/?author=${ctx.request.body.author}`)
// })

const nestedRoutes = [publicRouter, secureRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }


import Router from 'koa-router'
import bodyParser from 'koa-body'
import session from 'koa-session'

const publicRouter = new Router()
publicRouter.use(bodyParser({multipart: true}))

import { Accounts } from '../modules/accounts.js'
const dbName = 'GiftListService.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
publicRouter.get('/', async ctx => {
	try {
		const account = await new Accounts(dbName)
		let AllEvents  = await account.GetAllEvents()
		ctx.hbs.AllEvents =  AllEvents
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
 publicRouter.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
publicRouter.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})


publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

publicRouter.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if(!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const account = await new Accounts(dbName)
			await account.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
			await ctx.render('login', ctx.hbs)
		}
	} catch(err) {
		await ctx.render('login', ctx.hbs)
	}
})

publicRouter.get('/login', async ctx => {
	await ctx.render('login', ctx.hbs)
})

publicRouter.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		let UserId = await account.login(body.user, body.pass)
		ctx.session.UserId = UserId
		ctx.session.authorised = true
		const referrer = body.referrer || '/'
		console.log(body.referrer)
		return ctx.redirect(`${referrer}?msg=you are now logged in here...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

publicRouter.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})


export { publicRouter }

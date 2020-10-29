import Router from 'koa-router'
import fs from 'fs-extra'

const secureRouter = new Router({ prefix: '/Events' })

import { Accounts } from '../modules/accounts.js'

import { Email } from '../modules/Email.js'

const dbName = 'GiftListService.db'

secureRouter.get('/', async ctx => {
	try {
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})


secureRouter.post('/', async ctx => {
	const account = await new Accounts(dbName)
	try {
		await fs.copy(ctx.request.files.EventImage.path, `EventImages/${ctx.request.files.EventImage.name}`)
		const EventId = await account.RegisterEvent(ctx.request.body.EventTitle,ctx.request.body.EventsDescription,
	  ctx.request.body.EventDate , ctx.session.UserId , ctx.request.files.EventImage.name)
		if (typeof ctx.request.body.ItemName === 'string') {
			await account.AddItem( ctx.request.body.ItemName, ctx.request.body.ItemPrice,
			 ctx.request.body.ItemLink , EventId)
		} else {
			for (const index = 0; index < ctx.request.body.ItemName.length; index++) {
				await account.AddItem( ctx.request.body.ItemName[index]
				 ,ctx.request.body.ItemPrice[index], ctx.request.body.ItemLink[index] , EventId)
			}
		}
		ctx.redirect('/')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('register', ctx.hbs)
	}
})

secureRouter.get('/SingleEvent/:id', async ctx => {
	if(ctx.hbs.authorised !== true) {
		return ctx.redirect(`/login?msg=you need to log in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	}
	const account = await new Accounts(dbName)
	const EventData = await account.GetEventbyEventId(ctx.params.id)
	const EventItems = await account.GetItemsbyEventId(ctx.params.id)
	for (let i = 0; i < EventItems.length; i++) {
		const ItemPledged = await account.ItemPledgedbyItemId(EventItems[i].ItemId)
		if (ItemPledged) {
			EventItems[i].ItemPledged = ItemPledged
		}
	}
	ctx.hbs.EventData = EventData
	ctx.hbs.ItemData = EventItems
	await ctx.render('SingleEvent',ctx.hbs)
})

secureRouter.post('/SingleEvent/:id', async ctx => {
	if(ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log'
	in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	const account = await new Accounts(dbName)
	await account.PledgeItem(ctx.params.id,ctx.session.UserId)
	const EventData = await account.GetEventbyEventId(ctx.request.body.EventId)
	const EventItems = await account.GetItemsbyEventId(ctx.request.body.EventId)
	for (const i = 0; i < EventItems.length; i++) {
		const ItemPledged = await account.ItemPledgedbyItemId(EventItems[i].ItemId)
		if (ItemPledged) {
			EventItems[i].ItemPledged = ItemPledged
		}
	}
	ctx.hbs.EventData = EventData
	ctx.hbs.ItemData = EventItems
	await ctx.render('SingleEvent',ctx.hbs)
})
export { secureRouter }

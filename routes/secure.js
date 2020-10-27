import Router from 'koa-router'
import mime from 'mime-types'
import fs from 'fs-extra'

const secureRouter = new Router({ prefix: '/Events' })

import { Accounts } from '../modules/accounts.js'

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
		const EventImageFile = ctx.request.files.EventImage
		await fs.copy(EventImageFile.path, `EventImages/${EventImageFile.name}`)
		let EventId = await account.RegisterEvent(ctx.request.body.EventTitle, ctx.request.body.EventsDescription, ctx.request.body.EventDate , ctx.session.UserId , EventImageFile.name)
		if (typeof ctx.request.body.ItemName === "string"){
			await account.AddItem( ctx.request.body.ItemName, ctx.request.body.ItemPrice, ctx.request.body.ItemLink , EventId)
		}
		else{
			for (var index = 0; index < ctx.request.body.ItemName.length; index++) {
				await account.AddItem( ctx.request.body.ItemName[index], ctx.request.body.ItemPrice[index], ctx.request.body.ItemLink[index] , EventId)			
			}	
		}
		ctx.hbs.msg = 
	  ctx.redirect('/');
	}
	catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	}
})

secureRouter.get('/SingleEvent/:id', async ctx => {
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/Events/SingleEvent/'+ctx.params.id)
  const account = await new Accounts(dbName)
	let EventData = await account.GetEventbyEventId(ctx.params.id)
	let EventItems = await account.GetItemsbyEventId(ctx.params.id)
	console.log(EventItems)
	for (var i = 0; i < EventItems.length; i++) {
		let ItemPledged  = await account.ItemPledgedbyItemId(EventItems[i].ItemId)
		EventItems[i].ItemPledged = ItemPledged
	} 								
	ctx.hbs.EventData = EventData
	ctx.hbs.ItemData = EventItems
	await ctx.render('SingleEvent',ctx.hbs)
})

export { secureRouter }

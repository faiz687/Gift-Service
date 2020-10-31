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
const AddItemsToEvent = async(BodyInfo,EventId) => {
	try {
		const account = await new Accounts(dbName)
		for (let index = 0; index < BodyInfo.ItemName.length; index++) {
			await account.AddItem( BodyInfo.ItemName[index],BodyInfo.ItemPrice[index],
			 BodyInfo.ItemLink[index],EventId)
		}
	} catch (err) {
		console.log(err)
	}
}
secureRouter.post('/', async ctx => {
	const account = await new Accounts(dbName)
	try {
		await fs.copy(ctx.request.files.EventImage.path, `EventImages/${ctx.request.files.EventImage.name}`)
		const BodyInfo = ctx.request.body
		const EventId = await account.RegisterEvent(BodyInfo.EventTitle,BodyInfo.EventsDescription,
	  BodyInfo.EventDate , ctx.session.UserId , ctx.request.files.EventImage.name)
		if (typeof ctx.request.body.ItemName === 'string') {
			await account.AddItem( BodyInfo.ItemName, BodyInfo.ItemPrice,BodyInfo.ItemLink , EventId)
		} else {
			AddItemsToEvent(BodyInfo,EventId)
		}
		ctx.redirect('/')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('register', ctx.hbs)
	}
})
secureRouter.get('/SingleEvent/:id', async ctx => {
	if(ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	const account = await new Accounts(dbName)
	const EventData = await account.GetEventbyEventId(ctx.params.id)
	const EventItems = await account.GetItemsbyEventId(ctx.params.id)
	for (let i = 0; i < EventItems.length; i++) {
		const ItemPledged = await account.ItemPledgedbyItemId(EventItems[i].ItemId)
		if (ItemPledged) {
			EventItems[i].ItemPledged = ItemPledged
		}
		const EventOwnerInfo = await account.GetEventOwnerInfo(ctx.params.id)
		if (ctx.session.UserId === EventOwnerInfo.UserId) {
				const ItemPledgedconfirm = await account.IsItemAwatingConfirmation(EventItems[i].ItemId)
				if (ItemPledgedconfirm) {
					EventItems[i].ItemPledgedconfirm = ItemPledgedconfirm
				}
			}
	}
	ctx.hbs.EventData = EventData
	ctx.hbs.ItemData = EventItems
	await ctx.render('SingleEvent',ctx.hbs)
})


secureRouter.post('/SingleEvent/:id', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log'
	in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	const account = await new Accounts(dbName)
	const mail = await new Email()
	await account.PledgeItem(ctx.params.id,ctx.session.UserId,0)
	const EventOwnerInfo = await account.GetEventOwnerInfo(ctx.request.body.EventId)
	const ItemInfo = await account.GetItemInfoByItemId(ctx.params.id)
	mail.SendPledgeMailToOwner(ItemInfo,EventOwnerInfo)
	await ctx.redirect(`/Events/SingleEvent/${ctx.request.body.EventId}`)
})

secureRouter.post('/SingleEvent/PledgeConfirm/:id', async ctx => {
	try{
		if (ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log'
    in&referrer=/Events/SingleEvent/${ctx.params.id}`)		
		const account = await new Accounts(dbName)
		const mail = await new Email()
		await account.ConfirmPledge(ctx.params.id)
		const UserInfo = await account.GetUserInfoByUserId(ctx.request.body.UserId)		
		mail.SendThankYouMailToDonor(UserInfo)
		await ctx.redirect(`/Events/SingleEvent/${ctx.request.body.EventId}`)
		} catch(err){
			console.log(err)
		}
})
									
									
				
export { secureRouter }

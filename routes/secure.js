import Router from 'koa-router'
import fs from 'fs-extra'
import { Email } from '../modules/Email.js'
import { Accounts } from '../modules/Accounts.js'
const secureRouter = new Router({ prefix: '/Events' })

const dbName = 'GiftListService.db'
/**
 * The Page to Regiter An Event.
 *
 * @name Home Page
 * @route {GET} /Events
 */
secureRouter.get('/', async ctx => {
	try {
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/Event')
		await ctx.render('Event', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})
/**
 * fuction to add all Gifts for the Event.
 * @param {List} GiftList list of all Gifts user wants for event.
 * @param {integer} EventId Gift for the specfic event.
 * @returns {Boolean} returns true if the new user has been added
 */
const AddItemsToEvent = async(GiftList,EventId) => {
	try {
		const account = await new Accounts(dbName)
		for (let index = 0; index < GiftList.ItemName.length; index++) {
			await account.AddItem( GiftList.ItemName[index],GiftList.ItemPrice[index],
			 GiftList.ItemLink[index],EventId)
		}
		return true
	} catch (err) {
		console.log(err)
	}
}

const CheckIfItemPledged = async(EventItems,ctx) => {
	const account = await new Accounts(dbName)
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
	} return EventItems
}

const CheckIfItemHasQuestions = async(Items) => {
	const account = await new Accounts(dbName)
	for (let i = 0; i < Items.length; i++) {
		const ItemQuestions = await account.GetAllQuestionByItemId(Items[i].ItemId)
		if (ItemQuestions) {
			Items[i].ItemQuestions = ItemQuestions
		}
	}
	return Items
}
/**
 * The script to processa a new event registration.
 *
 * @name Event Register Script
 * @route {POST} /Events
 */
secureRouter.post('/', async ctx => {
	const account = await new Accounts(dbName)
	try {
    console.log(ctx.request.body.files)
    console.log(ctx.request.body.EventImage)
// 		await fs.copy(ctx.request.files.EventImage.path, `EventImages/${ctx.request.files.EventImage.name}`)
// 		const BodyInfo = ctx.request.body
// 		const EventId = await account.RegisterEvent(BodyInfo.EventTitle,BodyInfo.EventsDescription,
// 	  BodyInfo.EventDate , ctx.session.UserId , ctx.request.files.EventImage.name)
// 		if (typeof ctx.request.body.ItemName === 'string') {
// 			await account.AddItem( BodyInfo.ItemName, BodyInfo.ItemPrice,BodyInfo.ItemLink , EventId)
// 		} else {
// 			AddItemsToEvent(BodyInfo,EventId)
// 		}
// 		ctx.redirect('/')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('register', ctx.hbs)
	}
})
/**
 * The Specific Event page.
 * @name SingleEvent Page
 * @route {GET} /Events/SingleEvent/:id
 */
secureRouter.get('/SingleEvent/:id', async ctx => {
	if(ctx.hbs.authorised !== true ) {
		return ctx.redirect(`/login?msg=you need to log in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	}
	const account = await new Accounts(dbName)
	const EventData = await account.GetEventbyEventId(ctx.params.id)
	const EventItems = await account.GetItemsbyEventId(ctx.params.id)
	ctx.hbs.EventData = EventData
	ctx.hbs.ItemData = await CheckIfItemPledged(EventItems,ctx)
	ctx.hbs.ItemData = await CheckIfItemHasQuestions(ctx.hbs.ItemData)
	await ctx.render('SingleEvent',ctx.hbs)
})
/**
 * The script to process a new pledge made for a gift.
 *
 * @name  Pledge Gift.
 * @route {POST} /Events/SingleEvent/:id
 */
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
/**
 * The script to confirm a new pledge made for a gift.
 * @name Confirm Pledge Gift.
 * @route {POST} /Events/SingleEvent/PledgeConfirm/:id
 */
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
	} catch(err) {
		console.log(err)
	}
})

secureRouter.post('/SingleEvent/MessageOwner/:id', async ctx => {
	if(ctx.hbs.authorised !== true) {
		return ctx.redirect(`/login?msg=you need to log in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	}
	const ItemId = ctx.params.id
	const { Question } = ctx.request.body
	const account = await new Accounts(dbName)
	await account.InsertQuestion(Question,ItemId)
	await ctx.redirect(`/Events/SingleEvent/${ctx.request.body.EventId}`)
})

export { secureRouter }

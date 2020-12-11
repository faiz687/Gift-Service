/**
 * A module containing all the secured routes (endpoints).
 * @module routes/secure
 * @author Faizaan Chowdhary
 * @requires koa-router
 * @requires fs-extra
 * @requires /modules/Email.js
 * @requires /modules/Accounts.js
 */
import Router from 'koa-router'
import fs from 'fs-extra'
import { Email } from '../modules/Email.js'
import { Accounts } from '../modules/Accounts.js'


const secureRouter = new Router({ prefix: '/Events' })
const dbName = 'GiftListService.db'
/**
 * The Route to get a specific event.
 * @function
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
/**
 * fuction to check if an item has been pledged and add appropriate property to it.
 * @param {object} EventItems - list of all Gifts user wants for event.
 * @param {object} ctx - context middleware.
 * @returns {object} EventItems -  returns list of all items if they have been pledged or not.
 */
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
/**
 * fuction to check if an item has any questions.
 * @param {object} Items - list of all Gifts user wants for event.
 * @returns {object} Items - returns list of all items if they have any questions or not.
 */
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
 * The Route to process a new event.
 * @function
 * @route {GET} /Events
 */
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
/**
 * The Route to get an event by its id.
 * @function
 * @param {integer} id - the EventId of the Event to get.
 * @route {GET} /SingleEvent/:id
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
 * The Route to pledge an item for an event.
 * @function
 * @param {integer} id - the EventId of the Event to get.
 * @route {POST} /SingleEvent/:id
 */
secureRouter.post('/SingleEvent/:id', async ctx => {
	console.log(ctx.params.id)
	if (ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log'
	in&referrer=/Events/SingleEvent/${ctx.params.id}`)
	const account = await new Accounts(dbName)
	const mail = await new Email()
	await account.PledgeItem(ctx.params.id,ctx.session.UserId,0)
	const EventOwnerInfo = await account.GetEventOwnerInfo(ctx.request.body.EventId)
	const ItemInfo = await account.GetItemByItemId(ctx.params.id)
	mail.SendPledgeMailToOwner(ItemInfo,EventOwnerInfo)
	await ctx.redirect(`/Events/SingleEvent/${ctx.request.body.EventId}`)
})
/**
 * The Route to confirm pledge of an item by its ownerf.
 * @name Confirm Pledge Gift.
 * @param {integer} id - the EventId of the Event to get.
 * @route {POST} /Events/SingleEvent/PledgeConfirm/:id
 */
secureRouter.post('/SingleEvent/PledgeConfirm/:id', async ctx => {
	try{
		if (ctx.hbs.authorised !== true) return ctx.redirect(`/login?msg=you need to log'
    in&referrer=/Events/SingleEvent/${ctx.params.id}`)
		const account = await new Accounts(dbName)
		const mail = await new Email()
		await account.ConfirmPledge(ctx.params.id)
		const UserInfo = await account.GetUserById(ctx.request.body.UserId)
		mail.SendThankYouMailToDonor(UserInfo)
		await ctx.redirect(`/Events/SingleEvent/${ctx.request.body.EventId}`)
	} catch(err) {
		console.log(err)
	}
})
/**
 * The Route to message the owner regarding question about an item.
 * @name Mesage Owner Route.
 * @param {integer} id - the itemid of the item about the question.
 * @route {POST} /SingleEvent/MessageOwner/:id
 */
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

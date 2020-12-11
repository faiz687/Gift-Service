/**
 * A module to perform operations on the Database.
 * @requires sqlite-async
 * @module modules/Accounts
 * @author Faizaan Chowdhary
 */
import sqlite from 'sqlite-async'
import { CreateUserTbl , CreateEventsTbl , CreateItemstbl
	, CreatePledgeTbl ,CreateQuestionItemTbl , InsertQuestionex
	, Register , Login , RegisterEvent , GetEventOwnerInfoex ,
	GetItemByItemIdex ,ItemPledgedbyItemIdex , GetUserByIdex} from './ExtendedAccounts.js'
/** Class providing all functionality for database operations. */
class Accounts {
	/**
     * Create a database connection in memory or use if value given.
     * @param {string} dbName - database name.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			try{
				this.db = await sqlite.open(dbName)
				await CreateEventsTbl(this)
				await CreateItemstbl(this)
				await CreatePledgeTbl(this)
				await CreateUserTbl(this)
				await CreateQuestionItemTbl(this)
			} catch (err) {
				console.log(err)
			}
 			return this
		})()
	}
  	/**
  	 * function to close the database connection.
     */
	async close() {
		await this.db.close()
	}
  	/**
	 * Creates an event.
	 * @param {String} EventTitle -  title for the event
	 * @param {String} EventsDescription - description for the event.
	 * @param {date} EventDate - date for the event.
	 * @param {integer} UserId - user creating the event.
	 * @param {String} EventImagePath - folder here images are stored.
	 * @returns {integer}  EventId - returns event id if event created successfully.
	 */
	async RegisterEvent(EventTitle,EventsDescription,EventDate,UserId,EventImagePath ) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const eventdata = {_EventTitle: EventTitle , _EventsDescription: EventsDescription, _EventDate: EventDate,
			_UserId: UserId,_EventImagePath: EventImagePath }
		return await RegisterEvent(this, eventdata)
	}
  	/**
	 * Add item (gift) for an event.
	 * @param {String} ItemName - the name of the gift.
	 * @param {inteer} ItemPrice - the price of the gift.
	 * @param {String} ItemLink - the website link for the gift.
	 * @param {integer} EventId - id of the event the gift has been listed.
	 * @returns {Boolean} returns true if  gift has been added.
	 */
	async AddItem(ItemName,ItemPrice,ItemLink,EventId) {
		try{
			Array.from(arguments).forEach( val => {
				if(val.length === 0) throw new Error('missing field')
			})
	  const sql = `INSERT INTO ItemsTbl (ItemName,ItemPrice,ItemLink,EventId) VALUES 
    ('${ItemName}','${ItemPrice}','${ItemLink}','${EventId}');`
			await this.db.run(sql)
			return true
		} catch (error) {
			throw error
		}
	}
  	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async GetAllEvents() {
		try {
      		const sql = `Select  EventId,EventTitle,strftime(' %d-%m-%Y ',EventDate) 
    as EventDate, EventImage from EventsTbl;`
			return await this.db.all(sql)
		} catch (error) {
			throw error
		}
	}
  	/**
	 * get the event by its id.
	 * @param {integer} EventId - id of the event.
	 * @returns {data} list - Containing all the information relating to the event.
	 */
	async GetEventbyEventId(EventId) {
		try {
      		if (isNaN(EventId)) throw new Error('EventId should be a number')
			const sql = `select EventId , EventTitle  , EventsDescription , strftime( ' %d-%m-%Y ', EventDate) as 
    EventDate , EventImage , UserId FROM EventsTbl WHERE EventId ='${EventId}';`
			return await this.db.get(sql)
		} catch (error) {
			throw error
		}

	}
  	/**
	 * gets all the gifts for an event.
	 * @param {integer} EventId - id of the event.
	 * @returns {data} list - Containing all the items for an event.
	 */
	async GetItemsbyEventId(EventId) {
		try {
      		if (isNaN(EventId)) throw new Error('EventId should be a number')
			const sql = `select itemid,itemname,itemprice,EventId,itemlink from ItemsTbl where EventId = '${EventId}';`
			return await this.db.all(sql)
		} catch (error) {
			throw error
		}

	}
  	/**
	 * checks to see if a item has been pledged by its item-id.
	 * @param {integer} ItemId - id of the gift or item.
	 * @returns {data|null} returns list containing item if item pledged or null if otherwise.
	 */
	async ItemPledgedbyItemId(ItemId) {
		return await ItemPledgedbyItemIdex(this, ItemId)
	}
  	/**
	 * pledge an item for an event.
	 * @param {integer} ItemId - id of the gift or item.
	 * @param {integer} UserId - id of the user who is making the pledge.
	 * @param {Boolean} PledgeStatus - status if the pledge has been confirmed by the event owner.
	 * @returns {Boolean} returns true if item pledged.
	 */
	async PledgeItem(ItemId,UserId,PledgeStatus) {
		try{
      		Array.from(arguments).forEach( val => {
				if(val.length === 0) throw new Error('missing field')
			})
			const sql = `INSERT INTO PledgeTbl (itemid,userid,PledgeConfirmed) 
    VALUES (${ItemId}, ${UserId} , ${PledgeStatus});`
			await this.db.run(sql)
			return true
		} catch (error) {
			throw error
		}

	}
  	/**
	 * the owner confirms the pledge for a gift.
	 * @param {integer} ItemId - id of the gift or item.
	 * @returns {Boolean} returns true if pledge status sucessfully changed or confirmed.
	 */
	async ConfirmPledge(ItemId) {
		try {
			if (!ItemId) throw new Error('Item-id undefined')
			if(ItemId.length === 0) throw new Error('missing field')
			if (isNaN(ItemId)) throw new Error('ItemId should be a number')
			const sql = `update pledgetbl set pledgeconfirmed = 1 where itemid = ${ItemId}`
			await this.db.run(sql)
			return true
		} catch (error) {
			throw error
		}
	}
  	/**
	 * get item by item id.
	 * @param {integer} ItemId - id of the gift or item.
	 * @returns {data} returns list containing information for item.
	 */
	async GetItemByItemId(ItemId) {
		return await GetItemByItemIdex(this, ItemId)
	}
  	/**
	 * checks to see if an item pledge status has been confirmed by the owner.
	 * @param {integer} ItemId - id of the gift or item.
	 * @returns {data} returns list containing item if it is awaiting confirmation from the owner.
	 */
	async IsItemAwatingConfirmation(ItemId) {
		try {
			if (!ItemId) throw new Error('Item-id undefined')
			if (isNaN(ItemId)) throw new Error('ItemId should be a number')
			const sql = `select ItemId,UsersTbl.UserId,username,PledgeConfirmed from PledgeTbl 
    INNER join UsersTbl on PledgeTbl.userid = UsersTbl.userid where ItemId = '${ItemId}' and PledgeConfirmed = 0;`
			return await this.db.get(sql)
		} catch (error) {
			throw error
		}

	}
  	/**
	 * Inserting the question relating to an item.
	 * @param {String} Question -  the question user wants to ask.
	 * @param {integer} ItemId - Question relating to which item.
	 * @returns {Boolean} returns true if question inserted.
	 */
	async InsertQuestion(Question,ItemId) {
		if (isNaN(ItemId)) throw new Error('ItemId should be a number')
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		return await InsertQuestionex(this, Question , ItemId)
	}
  	/**
	 * get all the question regarding an item.
	 * @param {integer} ItemId - Questions relating to which item.
	 * @returns {data} returns list - containing all the questions for an item.
	 */
	async GetAllQuestionByItemId(ItemId) {
		try{
			if (isNaN(ItemId)) throw new Error('ItemId should be a number')
	  const sql = `select * from ItemQuestionsTbl where ItemId = ${ItemId};`
			return await this.db.all(sql)
		} catch (error) {
			throw error
		}

	}
	/**
   * registers a new user
   * @param {String} user the chosen username
   * @param {String} pass the chosen password
   * @returns {Boolean} returns true if the new user has been added
   */
	async register(user, pass, email) {
		if (user.length === 0 || pass.length === 0 || email.length === 0 ) throw new Error('missing field')
		return await Register(this, user, pass, email)
	}
	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		return await Login(this,username, password)
	}
  	/**
	 * gets user information by event id.
	 * @param {integer} EventId - the id of the event.
	 * @returns {data} returns list of information of owner who created the event.
	 */
	async GetEventOwnerInfo(EventId) {
		return await GetEventOwnerInfoex(this,EventId)
	}
  	/**
	 * get user by id.
	 * @param {integer} UserId - the id of the user.
	 * @returns {data} returns list of information containing about user.
	 */
	async GetUserById(UserId) {
		return await GetUserByIdex(this,UserId)
	}

}
export { Accounts }

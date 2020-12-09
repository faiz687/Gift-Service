/**
 * A module to perform CRUD operations on the user table.
 * @requires module:/helpers/database
 * @requires module:bcrypt
 * @module models/Users
 * @author Faizaan Chowdhary
 */
import sqlite from 'sqlite-async'
import bcrypt from 'bcrypt-promise'
import { CreateUserTbl , CreateEventsTbl , CreateItemstbl , CreatePledgeTbl
	,CreateQuestionItemTbl , Register} from './ExtendedAccounts.js'

class Accounts {

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
	async close() {
		await this.db.close()
	}
	async RegisterEvent(EventTitle,EventsDescription,EventDate,UserId,EventImagePath ) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT count(EventTitle) AS count FROM EventsTbl WHERE EventTitle="${EventTitle}";`
		const records = await this.db.get(sql)
		if(records.count !== 0) throw new Error('Event Already Exists')
		sql = `INSERT INTO EventsTbl (EventTitle , EventsDescription ,  EventDate , EventImage , UserId) 
    VALUES ('${EventTitle}',	'${EventsDescription}' , '${EventDate}' ,  '${EventImagePath}'  , '${UserId}');`
		await this.db.get(sql)
		sql = 'select last_insert_rowid() AS EventId;'
		const data = await this.db.get(sql)
		return data.EventId
	}
	async AddItem(ItemName,ItemPrice,ItemLink,EventId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
	  const sql = `INSERT INTO ItemsTbl (ItemName,ItemPrice,ItemLink,EventId) VALUES 
    ('${ItemName}','${ItemPrice}','${ItemLink}','${EventId}');`
		await this.db.run(sql)
		return true
	}
	async GetAllEvents() {
		const sql = `Select  EventId,EventTitle,strftime(' %d-%m-%Y ',EventDate) 
    as EventDate, EventImage from EventsTbl;`
		return await this.db.all(sql)
	}
	async GetEventbyEventId(EventId) {
		if (isNaN(EventId)) throw new Error('EventId should be a number')
		const sql = `select EventId , EventTitle  , EventsDescription , strftime( ' %d-%m-%Y ', EventDate) as 
    EventDate , EventImage , UserId FROM EventsTbl WHERE EventId ='${EventId}';`
		return await this.db.get(sql)
	}
	async GetItemsbyEventId(EventId) {
		if (isNaN(EventId)) throw new Error('EventId should be a number')
		const sql = `select itemid,itemname,itemprice,EventId,itemlink from ItemsTbl where EventId = '${EventId}';`
		return await this.db.all(sql)
	}
	async ItemPledgedbyItemId(ItemId) {
		if (isNaN(ItemId)) throw new Error('ItemId should be a number')
		const sql = `select ItemId,UsersTbl.UserId,username,PledgeConfirmed from PledgeTbl 
    INNER join UsersTbl on PledgeTbl.userid = UsersTbl.userid where ItemId = '${ItemId}' and PledgeConfirmed = 1;`
		const record = await this.db.get(sql)
		if (record === undefined) return null
		return record
	}
	async PledgeItem(ItemId,UserId,PledgeStatus) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `INSERT INTO PledgeTbl (itemid,userid,PledgeConfirmed) 
    VALUES (${ItemId}, ${UserId} , ${PledgeStatus});`
		await this.db.run(sql)
		return true
	}
	async ConfirmPledge(ItemId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `update pledgetbl set pledgeconfirmed = 1 where itemid = ${ItemId}`
		await this.db.run(sql)
		return true
	}
	async GetItemInfoByItemId(ItemId) {
		const sql = `	select itemid , itemname , itemprice , itemlink  from ItemsTbl  where itemid =  '${ItemId}';`
		return await this.db.get(sql)
	}
	async IsItemAwatingConfirmation(ItemId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `select ItemId,UsersTbl.UserId,username,PledgeConfirmed from PledgeTbl 
    INNER join UsersTbl on PledgeTbl.userid = UsersTbl.userid where ItemId = '${ItemId}' and PledgeConfirmed = 0;`
		return await this.db.get(sql)
	}
	async InsertQuestion(Question,ItemId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
	  const sql = `INSERT INTO ItemQuestionsTbl (Question,ItemId) VALUES ('${Question}','${ItemId}');`
		await this.db.run(sql)
		return true
	}
	async GetAllQuestionByItemId(ItemId) {
		if (isNaN(ItemId)) throw new Error('ItemId should be a number')
	  const sql = `select * from ItemQuestionsTbl where ItemId = ${ItemId};`
		return await this.db.all(sql)
	}
	/**
   * registers a new user
   * @param {String} user the chosen username
   * @param {String} pass the chosen password
   * @returns {Boolean} returns true if the new user has been added
   */
	async register(user, pass, email) {
		return await Register(this, user, pass, email)
	}
	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		let sql = `SELECT count(UserId) AS count FROM UsersTbl WHERE UserName="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT UserPassword , UserId  FROM UsersTbl WHERE UserName = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.UserPassword)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return record.UserId
	}

	async GetEventOwnerInfo(EventId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `select UsersTbl.userid , username , useremail , eventid from UsersTbl INNER JOIN EventsTbl 
    on EventsTbl.userid = UsersTbl.userid where eventid = ${EventId} ;`
		return await this.db.get(sql)
	}
	async GetUserInfoByUserId(UserId) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `select * from userstbl where userid = ${UserId};`
		return await this.db.get(sql)
	}

}
export { Accounts }
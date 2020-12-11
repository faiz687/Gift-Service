/**
 * An Extended module to perform operations on the Database.
 * @requires sqlite-async
 * @requires bcrypt-promise
 * @module modules/ExtendedAccounts
 * @author Faizaan Chowdhary
 */
import bcrypt from 'bcrypt-promise'
const saltRounds = 10
/**
 * A fuction to create user table if it does not exist.
 * @param {object} thisdb - instance of the database.
 */
const CreateUserTbl = async(thisdb) => {
	try {
		const sql = `CREATE TABLE IF NOT EXISTS UsersTbl
        (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, UserPassword TEXT, UserEmail TEXT);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
/**
 * A fuction to create events table if it does not exist.
 * @param {object} thisdb - instance of the database.
 */
const CreateEventsTbl = 	async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS EventsTbl (EventId INTEGER PRIMARY KEY AUTOINCREMENT, 
        EventTitle TEXT, EventsDescription TEXT, EventDate TEXT , EventImage TEXT, UserId INTEGER);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
/**
 * A fuction to create items table if it does not exist.
 * @param {object} thisdb - instance of the database.
 */
const	CreateItemstbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS Itemstbl (ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
          ItemName TEXT, ItemPrice TEXT, ItemLink TEXT , EventId INTEGER);`
		await thisdb.db.run(sql)
	}catch (err) {
		console.log(err)
	}
}
/**
 * A fuction to create a pledge table if it does not exist.
 * @param {object} thisdb - instance of the database.
 */
const	CreatePledgeTbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS PledgeTbl (PledgeId INTEGER PRIMARY KEY AUTOINCREMENT, 
        UserId INTEGER, ItemId INTEGER, PledgeConfirmed bool);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
/**
 * A fuction to create questions table if it does not exist.
 * @param {object} thisdb - instance of the database.
 */
const	CreateQuestionItemTbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS ItemQuestionsTbl (QuestionId INTEGER PRIMARY KEY AUTOINCREMENT, 
        Question TEXT, ItemId INTEGER);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
/**
 * A fuction to regiter the user.
 * @param {object} thisdb - instance of the database.
 * @param {list} ...args - The object containing all the user properties.
 * @param {string} args[0] - The username of the user.
 * @param {string} args[1] - The password of the user.
 * @param {string} args[2] - The email of the user.
 * @returns {boolean} returns true if user created
 */
const	Register = async(thisdb, user, pass, email) => {
	try {
		let sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserName="${user}";`
		const data = await thisdb.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserEmail="${email}";`
		const emails = await thisdb.db.get(sql)
		if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO UsersTbl(UserName, UserPassword, UserEmail) VALUES("${user}", "${pass}", "${email}")`
		await thisdb.db.run(sql)
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
const	Login = async(thisdb, username, password) => {
	try {
		let sql = `SELECT count(UserId) AS count FROM UsersTbl WHERE UserName="${username}";`
		const records = await thisdb.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT UserPassword , UserId  FROM UsersTbl WHERE UserName = "${username}";`
		const record = await thisdb.db.get(sql)
		const valid = await bcrypt.compare(password, record.UserPassword)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return record.UserId
	} catch (error) {
		throw error
	}
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
const	RegisterEvent = async(thisdb, eventdata) => {
	try {
		const { _EventTitle, _EventsDescription, _EventDate, _UserId, _EventImagePath } = eventdata
		let sql = `SELECT count(EventId) AS count FROM EventsTbl WHERE EventTitle="${_EventTitle}";`
		const records = await thisdb.db.get(sql)
		if(records.count !== 0) throw new Error('Event Already Exists')
		sql = `INSERT INTO EventsTbl (EventTitle , EventsDescription ,  EventDate , EventImage , UserId) 
      VALUES ('${_EventTitle}',	'${_EventsDescription}' , '${_EventDate}' ,  '${_EventImagePath}'  , '${_UserId}');`
		await thisdb.db.get(sql)
		sql = 'select last_insert_rowid() AS EventId;'
		const data = await thisdb.db.get(sql)
		return data.EventId
	} catch (error) {
		throw error
	}
}
  	/**
	 * get all the question regarding an item.
	 * @param {integer} ItemId - Questions relating to which item.
	 * @returns {data} returns list - containing all the questions for an item.
	 */
const	InsertQuestionex = async(thisdb, Question,ItemId) => {
	try {
	  const sql = `INSERT INTO ItemQuestionsTbl (Question,ItemId) VALUES 
     ('${Question}','${ItemId}');`
		await thisdb.db.run(sql)
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
const	GetItemByItemIdex = async(thisdb, ItemId) => {
	if (!ItemId) throw new Error('Item-id undefined')
	if (isNaN(ItemId)) throw new Error('ItemId should be a number')
	if(ItemId.length === 0) throw new Error('missing field')
	try {
		const sql = `	select itemid , itemname , itemprice 
        , itemlink  from ItemsTbl  where itemid =  '${ItemId}';`
		return await thisdb.db.get(sql)
	} catch (error) {
		throw error
	}
}
  	/**
	 * checks to see if a item has been pledged by its item-id.
	 * @param {integer} ItemId - id of the gift or item.
	 * @returns {data|null} returns list containing item if item pledged or null if otherwise.
	 */
const	ItemPledgedbyItemIdex = async(thisdb, ItemId) => {
	try {
		if (isNaN(ItemId)) throw new Error('ItemId should be a number')
		const sql = `select ItemId,UsersTbl.UserId,username,PledgeConfirmed from PledgeTbl 
      INNER join UsersTbl on PledgeTbl.userid = UsersTbl.userid where ItemId = '${ItemId}' and PledgeConfirmed = 1;`
		const record = await thisdb.db.get(sql)
		if (record === undefined) return null
		return record
	} catch (error) {
		throw error
	}
}
  	/**
	 * gets user information by event id.
	 * @param {integer} EventId - the id of the event.
	 * @returns {data} returns list of information of owner who created the event.
	 */
const	GetEventOwnerInfoex = async(thisdb, EventId) => {
	try{
		if (!EventId) throw new Error('EventId is undefined')
		if (isNaN(EventId)) throw new Error('EventId should be a number')
		const sql = `select UsersTbl.UserId , UserName , UserEmail , EventId from UsersTbl INNER JOIN 
      EventsTbl  on EventsTbl.UserId = UsersTbl.UserId where EventId = ${EventId};`
		return await thisdb.db.get(sql)
	} catch (error) {
		throw error
	}
}
  	/**
  	 * get user by id
	 * @param {integer} UserId - the id of the user.
	 * @returns {data} returns list of information containing about user.
	 */
const	GetUserByIdex = async(thisdb, UserId) => {
	if (!UserId) throw new Error('UserId is undefined')
	if (isNaN(UserId)) throw new Error('UserId should be a number')
	const sql = `select * from userstbl where userid = ${UserId};`
	return await thisdb.db.get(sql)
}
export {Login, InsertQuestionex ,RegisterEvent, CreateUserTbl , CreateEventsTbl ,
	CreateItemstbl , CreatePledgeTbl , GetEventOwnerInfoex,ItemPledgedbyItemIdex,
	CreateQuestionItemTbl , GetUserByIdex ,GetItemByItemIdex ,Register}

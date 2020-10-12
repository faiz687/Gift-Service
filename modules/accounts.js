
import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

class Accounts {
	
	constructor(dbName = 'GiftListService.db') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS UsersTbl\
				(UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, UserPassword TEXT, UserEmail TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserName="${user}";`
		const data = await this.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserEmail="${email}";`
		const emails = await this.db.get(sql)
		if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO UsersTbl(UserName, UserPassword, UserEmail) VALUES("${user}", "${pass}", "${email}")`
		await this.db.run(sql)
		return true
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

	async close() {
		await this.db.close()
	}
	
	
	async RegisterEvent( EventTitle , EventsDescription  , EventDate , UserId , EventImagePath ) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT count(EventTitle) AS count FROM EventsTbl WHERE EventTitle="${EventTitle}";`
		const records = await this.db.get(sql)
		if(records.count !== 0) throw new Error("Event Already Exists")
		sql = `INSERT INTO EventsTbl (EventTitle , EventsDescription ,  EventDate , EventImage ,UserId) VALUES ("${EventTitle}",	"${EventsDescription}" , "${EventDate}" ,  "${EventImagePath}"  , "${UserId}");`
		await this.db.get(sql)
	  sql = `select last_insert_rowid() AS EventId;`
		const data = await this.db.get(sql)
		return data.EventId
	}
		
	async AddItem( ItemName , ItemPrice  , ItemLink , EventId ) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
	  let sql = `INSERT INTO ItemsTbl ( ItemName, ItemPrice,  ItemLink, EventId  ) VALUES ("${ItemName}",	"${ItemPrice}" ,"${ItemLink}","${EventId}");`
		await this.db.get(sql)
		return true
	}
}

export { Accounts }

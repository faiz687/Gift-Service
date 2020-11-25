import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

class UserAccounts {


	async CreateUserTbl() {
		try {
			const sql = `CREATE TABLE IF NOT EXISTS UsersTbl
        (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, UserPassword TEXT, UserEmail TEXT);`
			await this.db.run(sql)
		} catch (err) {
			console.log(err)
		}
	}

	constructor(dbName = ':memory:') {
		return (async() => {
			try{
				this.db = await sqlite.open(dbName)
				await this.CreateUserTbl()
			} catch (err) {
				console.log(err)
			}
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
export { UserAccounts }

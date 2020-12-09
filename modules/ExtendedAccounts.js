/**
 * An Extended module to perform operations on the Database.
 * @requires sqlite-async
 * @requires bcrypt-promise
 * @module modules/ExtendedAccounts
 * @author Faizaan Chowdhary
 */
import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'
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
const	Register = async(thisdb,...args) => {
  try {
    Array.from(args).forEach( val => {
		if(val.length === 0) throw new Error('missing field')
	})
	const user = args[0]
	let pass = args[1]
	const email = args[2]
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


export { CreateUserTbl , CreateEventsTbl , CreateItemstbl , CreatePledgeTbl , CreateQuestionItemTbl
	, Register}

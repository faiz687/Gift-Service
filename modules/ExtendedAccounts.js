import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'
const saltRounds = 10
const CreateUserTbl = async(thisdb) => {
	try {
		const sql = `CREATE TABLE IF NOT EXISTS UsersTbl
        (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, UserPassword TEXT, UserEmail TEXT);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
const CreateEventsTbl = 	async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS EventsTbl (EventId INTEGER PRIMARY KEY AUTOINCREMENT, 
        EventTitle TEXT, EventsDescription TEXT, EventDate TEXT , EventImage TEXT, UserId INTEGER);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
const	CreateItemstbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS Itemstbl (ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
          ItemName TEXT, ItemPrice TEXT, ItemLink TEXT , EventId INTEGER);`
		await thisdb.db.run(sql)
	}catch (err) {
		console.log(err)
	}
}
const	CreatePledgeTbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS PledgeTbl (PledgeId INTEGER PRIMARY KEY AUTOINCREMENT, 
        UserId INTEGER, ItemId INTEGER, PledgeConfirmed bool);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
const	CreateQuestionItemTbl = async(thisdb) => {
	try {
		const	sql = `CREATE TABLE IF NOT EXISTS ItemQuestionsTbl (QuestionId INTEGER PRIMARY KEY AUTOINCREMENT, 
        Question TEXT, ItemId INTEGER);`
		await thisdb.db.run(sql)
	} catch (err) {
		console.log(err)
	}
}
const	Register = async(thisdb,...args) => {
	Array.from(args).forEach( val => {
		if(val.length === 0) throw new Error('missing field')
	})
  let user = args[0]
  let pass = args[1]
  let email = args[2]
  console.log(user,pass,email)
	let sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserName="${user}";`
	const data = await thisdb.db.get(sql)
	if(data.records !== 0) throw new Error(`username "${user}" already in use`)
	sql = `SELECT COUNT(UserId) as records FROM UsersTbl WHERE UserEmail="${email}";`
	const emails = await thisdb.db.get(sql)
	if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
	pass = await bcrypt.hash(pass, saltRounds)
	sql = `INSERT INTO UsersTbl(UserName, UserPassword, UserEmail) VALUES("${user}", "${pass}", "${email}")`
  console.log("inserting")
	await thisdb.db.run(sql)
	return true
}


export { CreateUserTbl , CreateEventsTbl , CreateItemstbl , CreatePledgeTbl , CreateQuestionItemTbl
	, Register}

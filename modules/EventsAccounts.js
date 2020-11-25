import sqlite from 'sqlite-async'

class EventsAccounts {

	async CreateUserTbl() {
		try {
			const sql = `CREATE TABLE IF NOT EXISTS UsersTbl
        (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, UserPassword TEXT, UserEmail TEXT);`
			await this.db.run(sql)
		} catch (err) {
			console.log(err)
		}
	}

	async CreateEventsTbl() {
		try {
			const	sql = `CREATE TABLE IF NOT EXISTS EventsTbl (EventId INTEGER PRIMARY KEY AUTOINCREMENT, 
        EventTitle TEXT, EventsDescription TEXT, EventDate TEXT , EventImage TEXT, UserId INTEGER);`
			await this.db.run(sql)
		} catch (err) {
			console.log(err)
		}
	}

	async CreateItemstbl() {
		try {
			const	sql = `CREATE TABLE IF NOT EXISTS Itemstbl (ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
          ItemName TEXT, ItemPrice TEXT, ItemLink TEXT , EventId INTEGER);`
			await this.db.run(sql)
		}catch (err) {
			console.log(err)
		}
	}

	async CreatePledgeTbl() {
		try {
			const	sql = `CREATE TABLE IF NOT EXISTS PledgeTbl (PledgeId INTEGER PRIMARY KEY AUTOINCREMENT, 
        UserId INTEGER, ItemId INTEGER, PledgeConfirmed bool);`
			await this.db.run(sql)
		} catch (err) {
			console.log(err)
		}
	}

	constructor(dbName = ':memory:') {
		return (async() => {
			try{
				this.db = await sqlite.open(dbName)
				await this.CreateEventsTbl()
				await this.CreateItemstbl()
				await this.CreatePledgeTbl()
				await this.CreateUserTbl()
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
    EventDate,EventImage  FROM EventsTbl WHERE EventId ='${EventId}';`
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
}
export { EventsAccounts }

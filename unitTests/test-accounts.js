import test from 'ava'
import { Accounts } from '../modules/Accounts.js'

test('REGISTER                    : register and log in with a valid account', async test => {
	test.plan(1)
	const account = await new Accounts()
	const register = await account.register('doej', 'password', 'doej@gmail.com')
	test.is(register, true, 'unable to register')
	await account.close()
})

test('REGISTER                    : register a duplicate username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
		await account.register('doej', 'password', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "doej" already in use', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER                    : Error if blank username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('', 'password', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER                    : Error if blank password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', '', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER                    : Error if blank email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER                    : Error if duplicate email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
		await account.register('bloggsj', 'newpassword', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('LOGIN                       : invalid username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
		await account.login('roej', 'password')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('LOGIN                       : invalid password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
		await account.login('doej', 'bad')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER EVENT              : Register an event with all valid enteries', async test => {
	test.plan(1)
	const account = await new Accounts()
	const register = await account.RegisterEvent('Birthday','Celebrating Josh'
  +'16th Birthday','12-09-2020','Image/path',3)
	test.is(Number.isInteger(register), true, 'unable to register')
	await account.close()
})

test('REGISTER EVENT              : Register an event with a duplicate title', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('Birthday','Celebrating Josh 16th Birthday','12-09-2020','Image/path',3)
		await account.RegisterEvent('Birthday','Celebrating Josh 16th Birthday','12-09-2020','Image/path',3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Event Already Exists', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER EVENT              : Error if blank event title', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('','Celebrating Josh 16th Birthday','12-09-2020','Image/path',3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER EVENT              : Error if blank event description', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('Birthday','','12-09-2020','Image/path',3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('REGISTER EVENT              : Error if blank event date', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('Birthday','Celebrating Josh 16th Birthday','','Image/path',3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('REGISTER EVENT              : Error if blank UserId', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('Birthday','Celebrating Josh 16th Birthday','12-09-2020','','Image/path')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('REGISTER EVENT              : Error if blank image path ', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent('Birthday','Celebrating Josh 16th Birthday','12-09-2020',1,'')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('INSERT GIFT                 : Insert Gift for an Event with all valid Enteries', async test => {
	test.plan(1)
	const account = await new Accounts()
	const AddItem = await account.AddItem('Iphone 11','£439',
		'https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
	test.is(AddItem, true, 'unable to Add item')
	await account.close()
})

test('INSERT GIFT                 : Error if Item name blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem('','£439','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('INSERT GIFT                 : Error if Item price blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem('Iphone 11','','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('INSERT GIFT                 : Error if Item link blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem('Iphone 11','£439','',1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('INSERT GIFT                 : Error if Event id blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem('Iphone 11','£439',
			'https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2','')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET ALL EVENTS              : Get all the Events created', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.RegisterEvent('Birthday1','Celebrating Josh 16th Birthday','12-09-2020','Image/path1',3)
	await account.RegisterEvent('Birthday2','Celebrating Josh 17th Birthday','12-09-2020','Image/path2',4)
	await account.RegisterEvent('Birthday3','Celebrating Josh 18th Birthday','12-09-2020','Image/path3',5)
	const records = await account.GetAllEvents()
	test.is(records.length, 3, 'Incorrect number of events being returned')
	await account.close()
})

test('GET ALL EVENTS              : Get an Empty Record if no Event created', async test => {
	test.plan(1)
	const account = await new Accounts()
	const records = await account.GetAllEvents()
	test.is(records.length, 0, 'Incorrect number of events being returned')
	await account.close()
})


test('GET EVENT BY EVENT-ID       : Error if Event id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetEventbyEventId('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET EVENT BY EVENT-ID       : Check if correct event is returned by EventId', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.RegisterEvent('Birthday1','Celebrating Josh 16th Birthday','12-09-2020','Image/path1',3)
	const records = await account.GetEventbyEventId(1)
	test.is(records.EventTitle, 'Birthday1' , 'Incorrect number of events being returned')
	await account.close()
})

test('GET GIFTS BY EVENT-ID       : Error if Event id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetItemsbyEventId('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET GIFTS BY EVENT-ID       : Check if Correct gifts are being returned for each Event', async test => {
	test.plan(5)
	const account = await new Accounts()
	await account.AddItem('Iphone 5','£439','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
	await account.AddItem('Iphone 6','£440','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
	await account.AddItem('Iphone 7','£441','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
	await account.AddItem('Iphone 8','£442','https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2',1)
	const records = await account.GetItemsbyEventId(1)
	test.is(records.length,4, 'Incorrect number of gifts being returned')
	test.is(records[0].ItemName,'Iphone 5', 'Incorrect gift is being returned')
	test.is(records[1].ItemName,'Iphone 6', 'Incorrect gift is being returned')
	test.is(records[2].ItemName,'Iphone 7', 'Incorrect gift is being returned')
	test.is(records[3].ItemName,'Iphone 8', 'Incorrect gift is being returned')
	await account.close()
})

test('GET GIFT PLEDGED BY ITEM-ID : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.ItemPledgedbyItemId('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})
'INSERT QUESTION             : Error Question is blank'
test('GET GIFT PLEDGED BY ITEM-ID : should return null as Gift not pledged', async test => {
	test.plan(1)
	const account = await new Accounts()
	const records = await account.ItemPledgedbyItemId(1)
	test.is(records, null , 'incorrect error message')
	await account.close()
})

'INSERT QUESTION             : Error Question is blank'
test('GET GIFT PLEDGED BY ITEM-ID : should return pledged gift', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.register('doej', 'password', 'doej@gmail.com')
	//ItemId,UserId,PledgeStatus
	await	account.PledgeItem(1,1,1)
	const records = await account.ItemPledgedbyItemId(1)
	test.is(records.ItemId, 1 , 'incorrect pledged gift being returned')
	await account.close()
})

'INSERT QUESTION             : Error Question is blank'
test('CONFIRM PLEDGE BY ITEM-ID   : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.ConfirmPledge('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})
'INSERT QUESTION             : Error Question is blank'
test('CONFIRM PLEDGE BY ITEM-ID   : Error if Item id is blank or undefined', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.ConfirmPledge()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Item-id undefined', 'incorrect error message')
	} finally {
		await account.close()
	}
})
'INSERT QUESTION             : Error Question is blank'
test('CONFIRM PLEDGE BY ITEM-ID   : should confirm pledge return true', async test => {
	test.plan(1)
	const account = await new Accounts()
	//ItemId,UserId,PledgeStatus
	await account.register('doej', 'password', 'doej@gmail.com') // register a user
	await	account.PledgeItem(1,1,0) // pledge an item with item-id : 1 pledge status = 0 (false)
	await account.ConfirmPledge(1) // confirm pledge for item-id 1 pledge status = 1.
	const records = await account.ItemPledgedbyItemId(1) // check if pledge status has been changed for item-id 1.
	test.is(records.PledgeConfirmed,1, 'Pledge Not confirmed')
	await account.close()
})

test('GET ITEM BY ITEM-ID         : Error if Item id is blank or undefined', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetItemByItemId()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Item-id undefined', 'incorrect error message')
	} finally {
		await account.close()
	}
})
'INSERT QUESTION             : Error Question is blank'
test('GET ITEM BY ITEM-ID         : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetItemByItemId('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET ITEM BY ITEM-ID         : should return the item-id', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.AddItem('headphones',200,'http',1) // ItemName,ItemPrice,ItemLink,EventId
	const records = await account.GetItemByItemId(1)
	test.is(records.ItemId,1, 'Incorrect Item-id')
	await account.close()
})


test('CHECK ITEM AWAITING CONFIRMATION : Error if Item id is blank or undefined', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.IsItemAwatingConfirmation()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Item-id undefined', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('CHECK ITEM AWAITING CONFIRMATION  : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.IsItemAwatingConfirmation('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('CHECK ITEM AWAITING CONFIRMATION  : should return item awaiting confirmation', async test => {
	test.plan(1)
	const account = await new Accounts()
	//ItemId,UserId,PledgeStatus
	await account.register('doej', 'password', 'doej@gmail.com') // register a user
	await	account.PledgeItem(1,1,0) // pledge an item with item-id : 1 pledge status = 0 (false)
	const records = await account.IsItemAwatingConfirmation(1) // check if item is awaiting confirmation.
	test.is(records.PledgeConfirmed,0, 'Erro : Item confirmed')
	await account.close()
})

test('INSERT QUESTION             : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.InsertQuestion('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('INSERT QUESTION             : Error Question is blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.InsertQuestion('',1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('INSERT QUESTION             : Question should be inserted', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.InsertQuestion('hello world',1) // Question , itemid
	const records = await account.GetAllQuestionByItemId(1)
	test.is(records[0].Question, 'hello world', 'incorrect question message')
	await account.close()
})

test('GET USER BY ID              : Error user-id is not defined', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetUserById()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'UserId is undefined', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET USER BY ID              : Error user-id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetUserById('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'UserId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})


test('GET USER BY ID              : Should return User-id', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.register('doej', 'password', 'doej@gmail.com')
	const records = await account.GetUserById(1)
	test.is(records.UserId,1, 'incorrect user-id')
	await account.close()
})

test('GET USER INFO BY EVENT-ID              : Error event-id is not defined', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetEventOwnerInfo()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId is undefined', 'incorrect error message')
	} finally {
		await account.close()
	}
})

test('GET USER INFO BY EVENT-ID             : Error event-id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetEventOwnerInfo('a')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId should be a number', 'incorrect error message')
	} finally {
		await account.close()
	}
})


import test from 'ava'
import { Accounts } from '../modules/accounts.js'

test('REGISTER                    : register and log in with a valid account', async test => {
	test.plan(1)
	const account = await new Accounts() 
	const register = await account.register('doej', 'password', 'doej@gmail.com')
	test.is(register, true, 'unable to register')
	account.close()
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
		account.close()
	}
})

test('REGISTER                    : error if blank username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('', 'password', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER                    : error if blank password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', '', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER                    : error if blank email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER                    : error if duplicate email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
		await account.register('bloggsj', 'newpassword', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	} finally {
		account.close()
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
		account.close()
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
		account.close()
	}
})

test('REGISTER EVENT              : Register an event with all valid enteries', async test => {
	test.plan(1)
	const account = await new Accounts() 
	const register = await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020","Image/path",3)
	test.is(Number.isInteger(register), true, 'unable to register')
	account.close()
})

test('REGISTER EVENT              : Register an event with a duplicate title', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020","Image/path",3)
		await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020","Image/path",3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Event Already Exists', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER EVENT              : errror if blank event title', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("","Celebrating Josh 16th Birthday","12-09-2020","Image/path",3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER EVENT              : errror if blank event description', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("Birthday","","12-09-2020","Image/path",3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})


test('REGISTER EVENT              : errror if blank event date', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","","Image/path",3)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER EVENT              : errror if blank UserId', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020","","Image/path")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})


test('REGISTER EVENT              : errror if blank image path ', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020",1,"")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('INSERT GIFT                 : Insert Gift for an Event with all valid Enteries', async test => {
	test.plan(1)
	const account = await new Accounts()
	const AddItem = await account.AddItem("Iphone 11","£439","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
	test.is(AddItem, true, 'unable to Add item')
	account.close()
})

test('INSERT GIFT                 : Error if Item name blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem("","£439","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('INSERT GIFT                 : Error if Item price blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem("Iphone 11","","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('INSERT GIFT                 : Error if Item link blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem("Iphone 11","£439","",1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('INSERT GIFT                 : Error if Event id blank', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.AddItem("Iphone 11","£439","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2","")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET ALL EVENTS              : Get all the Events created', async test => {
  test.plan(1)
	const account = await new Accounts()
	await account.RegisterEvent("Birthday1","Celebrating Josh 16th Birthday","12-09-2020","Image/path1",3)
	await account.RegisterEvent("Birthday2","Celebrating Josh 17th Birthday","12-09-2020","Image/path2",4)
	await account.RegisterEvent("Birthday3","Celebrating Josh 18th Birthday","12-09-2020","Image/path3",5)	
	const records = await account.GetAllEvents()	
	test.is(records.length, 3, 'Incorrect number of events being returned')
  account.close()
})

test('GET ALL EVENTS              : Get an Empty Record if no Event created', async test => {
  test.plan(1)
	const account = await new Accounts()	
	const records = await account.GetAllEvents()	
	test.is(records.length, 0, 'Incorrect number of events being returned')
  account.close()
})


test('GET EVENT BY EVENT-ID       : Error if Event id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetEventbyEventId("a")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId should be a number', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET EVENT BY EVENT-ID       : Check if correct event is returned by EventId', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.RegisterEvent("Birthday1","Celebrating Josh 16th Birthday","12-09-2020","Image/path1",3)	
	const records = await account.GetEventbyEventId(1)
	test.is(records.EventTitle, "Birthday1" , 'Incorrect number of events being returned')
  account.close()
})

test('GET GIFTS BY EVENT-ID       : Error if Event id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.GetItemsbyEventId("a")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'EventId should be a number', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET GIFTS BY EVENT-ID       : Check if Correct gifts are being returned for each Event', async test => {
	test.plan(5)
	const account = await new Accounts()
	await account.AddItem("Iphone 5","£439","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
	await account.AddItem("Iphone 6","£440","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
	await account.AddItem("Iphone 7","£441","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
  await account.AddItem("Iphone 8","£442","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
	const records = await account.GetItemsbyEventId(1)
	test.is(records.length,4, 'Incorrect number of gifts being returned')
	test.is(records[0].ItemName,"Iphone 5", 'Incorrect gift is being returned')
	test.is(records[1].ItemName,"Iphone 6", 'Incorrect gift is being returned')
	test.is(records[2].ItemName,"Iphone 7", 'Incorrect gift is being returned')
	test.is(records[3].ItemName,"Iphone 8", 'Incorrect gift is being returned')
  account.close()
})

test('GET GIFT PLEDGED BY ITEM-ID : Error if Item id is not a number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.ItemPledgedbyItemId("a")
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'ItemId should be a number', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET GIFT PLEDGED BY ITEM-ID : should return null as Gift not pledged', async test => {
	test.plan(1)
	const account = await new Accounts()
  const records = await account.ItemPledgedbyItemId(1)
  test.is(records, null , 'incorrect error message')
	account.close()
})


test('GET GIFT PLEDGED BY ITEM-ID : should return pledged gift', async test => {
	test.plan(1)
	const account = await new Accounts()
	//ItemId,UserId,PledgeStatus
	await account.register('doej', 'password', 'doej@gmail.com')
  await	account.PledgeItem(1,1,1)
  const records = await account.ItemPledgedbyItemId(1)
	test.is(records.ItemId, 1 , 'incorrect pledged gift being returned')
	account.close()
})

test('GET GIFT PLEDGED BY ITEM-ID : should return pledged gift', async test => {
	test.plan(1)
	const account = await new Accounts()
	//ItemId,UserId,PledgeStatus
	await account.register('doej', 'password', 'doej@gmail.com')
  await	account.PledgeItem(1,1,1)
  const records = await account.ItemPledgedbyItemId(1)
	test.is(records.ItemId, 1 , 'incorrect pledged gift being returned')
	account.close()
})







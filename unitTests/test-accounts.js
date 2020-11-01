
import test from 'ava'
import { Accounts } from '../modules/accounts.js'

test('REGISTER : register and log in with a valid account', async test => {
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory
	const register = await account.register('doej', 'password', 'doej@gmail.com')
	test.is(register, true, 'unable to register')
	account.close()
})

test('REGISTER : register a duplicate username', async test => {
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

test('REGISTER : error if blank username', async test => {
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

test('REGISTER : error if blank password', async test => {
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

test('REGISTER : error if blank email', async test => {
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

test('REGISTER : error if duplicate email', async test => {
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

test('LOGIN    : invalid username', async test => {
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

test('LOGIN    : invalid password', async test => {
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

test('REGISTER Event: Register an event with all valid enteries', async test => {
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory	
	const register = await account.RegisterEvent("Birthday","Celebrating Josh 16th Birthday","12-09-2020","Image/path",3)
	test.is(Number.isInteger(register), true, 'unable to register')
	account.close()
})

test('REGISTER Event: Register an event with a duplicate title', async test => {
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

test('REGISTER Event: errror if blank event title', async test => {
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

test('REGISTER Event: errror if blank event description', async test => {
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


test('REGISTER Event: errror if blank event date', async test => {
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

test('REGISTER Event: errror if blank UserId', async test => {
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


test('REGISTER Event: errror if blank image path ', async test => {
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

test('Insert Gift : Insert Gift for an Event with all valid Enteries', async test => {
	test.plan(1)
	const account = await new Accounts()
	const AddItem = await account.AddItem("Iphone 11","£439","https://www.amazon.co.uk/s?k=iphone&i=electronics&ref=nb_sb_noss_2",1)
	test.is(AddItem, true, 'unable to Add item')
	account.close()
})















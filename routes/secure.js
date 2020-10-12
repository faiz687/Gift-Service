
import Router from 'koa-router'
import mime from 'mime-types'
import fs from 'fs-extra'

const secureRouter = new Router({ prefix: '/Events' })

import { Accounts } from '../modules/accounts.js'

const dbName = 'GiftListService.db'

secureRouter.get('/', async ctx => {
	try {
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})


secureRouter.post('/', async ctx => {
	const account = await new Accounts(dbName)
	try {
		
		const EventImageFile = ctx.request.files.EventImage
		await fs.copy(EventImageFile.path, `EventImages/${EventImageFile.name}`)
		let EventId = await account.RegisterEvent(ctx.request.body.EventTitle, ctx.request.body.EventsDescription, ctx.request.body.EventDate , ctx.session.UserId , `EventImages/${EventImageFile.name}`)
		let ItemName  =  ctx.request.body.ItemName
		console.log(ctx.request.body)
		for (var index = 0; index < ItemName.length; index++) {
			await account.AddItem( ItemName[index], ctx.request.body.ItemPrice[index], ctx.request.body.ItemLink[index] , EventId)
		}	
	}
	catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	}

	
	
	
// 		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
// 	} catch(err) {
// 		ctx.hbs.msg = err.message
// 		ctx.hbs.body = ctx.request.body
// 		console.log(ctx.hbs)
// 		await ctx.render('register', ctx.hbs)
// 	} finally {
// 		account.close()
// 	}

	//const myfile = ctx.request.files.EventImage

//   console.log(ctx.request.body)
//   console.log(ctx.request.files.myfile)
//   const myfile = ctx.request.files.myfile
//   myfile.extension = mime.extension(myfile.type)
//   console.log(`original filename: ${myfile.name}`)
//   console.log(`mime-type: ${myfile.type}`)
//   console.log(`correct file extension: ${myfile.extension}`)
//   console.log(`file size (in bytes): ${myfile.size}`)
//   console.log(`temp upload directory and name: ${myfile.path}`)
//   try {
//     await fs.copy(myfile.path, `uploads/${myfile.name}`)
//   } catch(err) {
//     console.log(err.message)
//   } finally {
//     ctx.redirect('/')
//   }
})





export { secureRouter }


import Router from 'koa-router'

import mime from 'mime-types'

const secureRouter = new Router({ prefix: '/Events' })

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
	console.log("Post function")
	console.log(ctx.request.body)
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

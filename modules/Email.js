import nodemailer from 'nodemailer'

class Email {
	constructor() {
		return this.mail = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'youremail@gmail.com',
				pass: 'yourpassword'
			}
		})
	}
}


export { Email }

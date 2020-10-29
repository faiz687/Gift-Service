import nodemailer from 'nodemailer'


class Email {
	constructor() {
    	this.transporter =  nodemailer.createTransport({
			service: 'outlook',
			auth: {
				user: 'chowdhaf@uni.coventry.ac.uk',
				pass: 'Placements123-'
			}
});
	return this
	}
	
	async SendMail() {
		
		var mailOptions = {
			from: 'chowdhaf@uni.coventry.ac.uk',
			to: 'faizaan_555@hotmail.com',
			subject: 'Sending Email using Node.js',
			text: 'hello world form node js'
		};
		this.transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});}

}


export { Email }


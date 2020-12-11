/**
 * A module to perform mail operations for gidt list service.
 * @requires nodemailer
 * @module modules/Email
 * @author Faizaan Chowdhary
 */
import nodemailer from 'nodemailer'

/** Class providing all functionality for email operations. */
class Email {
	/** Create a email object  with all the properties. */
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'outlook',
			auth: {
				 user: 'chowdhaf@uni.coventry.ac.uk',
				pass: 'Placements123-'
			}
		})
		return this
	}
	/**
	 * @function Sends mail to owner when a pledge made.
	 * @param {object} ItemInfo -  the item for which pledge has been made
	 * @param {object} EventOwnerInfo - the owner of the event.
	 * @param {string} ItemInfo.ItemName - The name of the gift.
   * @param {string} ItemInfo.ItemPrice - The price of the gift.
	 * @param {string} EventOwnerInfo.UserName - The name of the owner.
	 * @param {string} EventOwnerInfo.EventId - The EventId of the event.
	 * @returns {boolean} returns true if mail send or false.
	 */
	async SendPledgeMailToOwner(ItemInfo,EventOwnerInfo) {
		const mailOptions = {
			from: 'chowdhaf@uni.coventry.ac.uk',
			to: 'faizaan_555@hotmail.com',
			subject: 'Pledge Made : Kindly confirm',
			html: `<p> hello user ${EventOwnerInfo.UserName} </p>
             <p> A pledge has been made for your Gift listed : ${ItemInfo.ItemName} for ${ItemInfo.ItemPrice} </p>
			       <p> Please click on the link below to go the Event Page </p>
			       <p> https://monday-drum-8080.codio-box.uk/Events/SingleEvent/${EventOwnerInfo.EventId} </p>`
		}
		this.transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error)
				return false
			} else {
				console.log(`Email sent: ${info.response}`)
				return true
			}
		})
	}
	/**
	 * @function Send thank you mail to the user who made the pledeg.
	 * @param {object} UserInfo -  the user who made the pledge
	 * @param {string} UserInfo.UserName - The name of the user who made the pledge.
	 * @returns {boolean} returns true if mail send or false.
	 */
	async SendThankYouMailToDonor(UserInfo) {
		const mailOptions = {
			from: 'chowdhaf@uni.coventry.ac.uk',
			to: 'faizaan_555@hotmail.com',
			subject: 'Pledge Confirmed : Thankyou',
			html: `<p> hello user ${UserInfo.UserName} </p>
             <p> Thank you for your pledge i have now confirmed this from my end</p>`
		}
		this.transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error)
				return false
			} else {
				console.log(`Email sent: ${info.response}`)
				return true
			}
		})
	}
}
export { Email }


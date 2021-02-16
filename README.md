# Gift List Service
It is customary for events such as weddings or birthday for those celeberating to make a list of the gifts they would like. Guests can then pick from the list to make sure they are buying something that is useful. 

## Pages created :-
1.Home Page

2.Registration Page.
3.Registration Page for the event. 
4.Specific event Page.
5.Login Page.

## features implemented on each page : - 

### Home Page
* Button for Login/Register.
* Displays wehther user is currently logged in or not.
* Button for Register event.
* All the active or live events.

### Individual event page
* Displays all details of the event clicked on.
* Displays all items host wants for event.
* Details of each item (name,price,link,pledged or not).
* Button to pledge the item and add your name if not pledged by other user.

### Registration Page for the event.
* Page to Create a new event by adding the following details :- 
 * The event title.
 * A full-size image to represent the event, uploaded   from their computer.
 * The date and time when the event is taking place selected from a date/time picker.
 * A detailed, multi-line, formatted description of the event that supports markdown formatting.
 * The system also stores  username of the person adding the event and the date and time that the event was added.
 * Add Gift for the event 
 * Add details of each Gift (name,price,link).

### Registration Page.
* User can create an account with email and password.

## Languages : - 
Html,Css and Javascript (ECMAS 6)

## Frameworks : - 
* Koa-body, koa-router, koa-session,
* fs-extra (file-handling)
* Eslint (Linting)
* Handlebars.js (templating engine)
* AVA (AAA Testing)
* JSDOC (Documentation)
* nodemailer (Mails)
* sqlite-async
* bcrypt, bcrypt-promise (Passwords)

## Running Your Server
```
$ node index.js
```

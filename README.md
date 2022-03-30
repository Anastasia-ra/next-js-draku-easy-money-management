## Draku: easy money management 

:moneybag: Draku is a progressive web app allowing you to easily manage your money. You can track your expenses, define categories and set a budget for each category. Draku provides you with an overview of all your expenses and your budget progress. 

## Technologies used

- Next.js
- TypeScript
- API routes
- Authentication: CSRF tokens, bcrypt
- PostgreSQL (4 tables)
- Emotion for styling
- Unit tests and E2E tests with Jest and Puppeteer
- Chart.js
- ExchangeRate - API
- Nodemailer with OAuth2 and Gmail API

## Functionalities 

- User authentication: registration and login secured with CSRF token
- User can add up to 10 categories and set a monthly bduget for this category
- User can change the name or change the budget of each category
- Categories can also be deleted
- User can add an expense with a date and a name
- User can choose the currency of his expense from 161 currencies. The exchange rates are updated on a daily basis. By default the expense will be added in €.
- User can search for a specific expense and delete it.
- A chart with the user expenses is displayed on the homepage. The user can choose if he wants to see a monthly or a yearly overview
- A progress chart shows the budget progress of the current moment
- A progress chart shows the share of expenses per category
- User can check his budget progress per category in a dedicated page
- User can schedule a reminder to pay a bill on a specific day of the month. The user will then get a confirmation email and then each month on the specified date, he will get an email reminding him to pay this specific bill. 
- Each user can only access his individual information
- The website is fully responsive, it can also be used on mobile phone. 

## How to use Draku

- After signing up, start by creating your first categories in the section "Manage your categories". You cannot add expenses until you have added categories. <br />
- You can now add your first expenses in the section "Manage your expenses". 
- ✨ You can now track your expenses and check your budget progress! 


## Just want to have a quick look? Check out the demo account

## Screenshots

### Mobile version 

![loggeout](https://user-images.githubusercontent.com/92568005/160872041-0cb22d5b-b331-4bc7-9104-ddf0dcb31119.JPG)
![home1](https://user-images.githubusercontent.com/92568005/160872055-0d0126f6-af27-43bc-9993-39fd4c170487.JPG)
![home2](https://user-images.githubusercontent.com/92568005/160872086-0eb463d0-cf88-4443-94bb-0dcbc70033d6.JPG)
![expenses1](https://user-images.githubusercontent.com/92568005/160872109-f630d3bb-3c35-46bc-94a5-21376224aa04.JPG)
![categories](https://user-images.githubusercontent.com/92568005/160872119-161df281-ff04-404a-b054-72f9531fccd2.JPG)
![Budget](https://user-images.githubusercontent.com/92568005/160872127-409c5cff-5378-4d00-a20b-b5495a2d7d16.JPG)
![Reminder](https://user-images.githubusercontent.com/92568005/160872135-df6c4f2c-3f44-42ab-9326-0767766d01bb.JPG)



### Desktop version

![Loggedout](https://user-images.githubusercontent.com/92568005/160659770-76f3c905-313d-441f-9df4-289d0611b117.JPG)
![homev2](https://user-images.githubusercontent.com/92568005/160872664-7b81e56e-2c7f-4346-94f8-aed895be7f41.JPG)
![Categories](https://user-images.githubusercontent.com/92568005/160659537-0ec56746-11b6-44ac-91bc-f4abe565e746.JPG)
![Expenses](https://user-images.githubusercontent.com/92568005/160659550-42bbf65c-7ca8-4991-8922-76bfafdc7fff.JPG)
![Budget](https://user-images.githubusercontent.com/92568005/160659560-8289644f-f34c-4a9a-a26a-310fd771994f.JPG)
![reminder](https://user-images.githubusercontent.com/92568005/160872865-f45284c0-e608-4b38-8475-fa2b4c2455b6.JPG)





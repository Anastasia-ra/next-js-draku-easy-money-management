## Draku: easy money management 

:moneybag: Draku is a progressive web app allowing you to easily manage your money. You can track your expenses, define categories and set a budget for each category. Draku provides you with an overview of all your expenses and your budget progress. 

## Technologies used

- Next.js
- TypeScript
- PWA (progressive web app)
- API routes
- Authentication: CSRF tokens, bcrypt
- PostgreSQL
- Emotion for styling
- Unit tests and E2E tests with Jest and Puppeteer
- Chart.js
- ExchangeRate - API
- Nodemailer with OAuth2, Gmail API and node-cron to schedule the emails

## Functionalities 

- User authentication: registration and login secured with CSRF token
- User can add up to 10 categories and set a monthly bduget for each category
- User can change the name or change the budget of each category
- Categories can also be deleted
- User can add an expense with a date and a name
- User can choose the currency of his expense from 161 currencies. The exchange rates are updated on a daily basis. By default the expense will be added in €.
- User can search for a specific expense and delete it.
- A chart with the user expenses is displayed on the homepage. The user can choose if he wants to see a monthly or a yearly overview
- A progress chart shows the budget progress of the current month
- A progress chart shows the share of expenses per category
- User can check his budget progress per category in a dedicated page
- User can schedule a reminder to pay a bill on a specific day of the month. The user will then get a confirmation email and then each month on the specified date, he will get an email reminding him to pay this specific bill. 
- Each user can only access his individual information
- The website is fully responsive, it can also be used on mobile phone. 

## How to use Draku

- After signing up, start by creating your first categories in the section "Manage your categories". You cannot add expenses until you have added categories. <br />
- You can now add your first expenses in the section "Manage your expenses". 
- ✨ You can now track your expenses and check your budget progress! 
- You can also add a reminder to pay your bills in the "Set up a reminder" section. Fill in the form, after submitting the form, you will receive a confirmation email. Your reminder has been successfully set up, you will now receive a reminder every month on the chosen day


## Screenshots

### Mobile version 

![home1](https://user-images.githubusercontent.com/92568005/161499422-bc8769d1-93ec-4a4e-8239-03de0aa4af72.JPG)
![home2](https://user-images.githubusercontent.com/92568005/161499429-53f8610d-c53e-4601-a895-d6e278da5933.JPG)

![exepenses1](https://user-images.githubusercontent.com/92568005/161499456-d72d29dc-6657-48dc-b693-47dbcdc8ce3f.JPG)
![expenses2](https://user-images.githubusercontent.com/92568005/161499462-e0200f05-53ae-4b54-8755-914d07dbfcb0.JPG)

![Categories](https://user-images.githubusercontent.com/92568005/161499484-d81aa3f2-0f9d-4727-b212-2de8efac19e1.JPG)
![Budget](https://user-images.githubusercontent.com/92568005/161551637-b203a396-f4b0-4f17-af50-2c4606dc712d.jpg)
![Reminders](https://user-images.githubusercontent.com/92568005/161499505-4340a705-5c9f-4fc2-bb96-a7e720ebb2ae.JPG)



### Desktop version

![Loggedout](https://user-images.githubusercontent.com/92568005/160659770-76f3c905-313d-441f-9df4-289d0611b117.JPG)
![homev2](https://user-images.githubusercontent.com/92568005/160872664-7b81e56e-2c7f-4346-94f8-aed895be7f41.JPG)
![Categories](https://user-images.githubusercontent.com/92568005/160659537-0ec56746-11b6-44ac-91bc-f4abe565e746.JPG)
![Expenses](https://user-images.githubusercontent.com/92568005/160659550-42bbf65c-7ca8-4991-8922-76bfafdc7fff.JPG)
![Budget](https://user-images.githubusercontent.com/92568005/160659560-8289644f-f34c-4a9a-a26a-310fd771994f.JPG)
![reminder](https://user-images.githubusercontent.com/92568005/160872865-f45284c0-e608-4b38-8475-fa2b4c2455b6.JPG)





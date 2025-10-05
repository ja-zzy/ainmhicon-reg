# Ainmhícon Registration System

<p align='center'style='width:100%'><img style="width:300px;" src="public/banner.webp"></p>

The Ainmhícon Registration System is a fully open sourced system for registering guests for an event. It was originally designed for [Ainmhícon](https://ainmhicon.ie/), a furry convention in Dublin, Ireland. Anyone and everyone is welcome to adapt this project for their own event, convention or meetup, and the system is MIT Licensed with no strings attached. All we'd ask is that if you're able to do so, give [Ainmhícon](https://ainmhicon.ie/) a shout out on your event's website, or via your social media channels!


Since this was built for the first year of Ainmhícon's existance and budget was limited, the entire service is designed to be possible to run for free! We're using highly scalable services with free tiers - so you can get this set up for as little as $0.

Before you decide to implement our reg system, you may want to check it out here https://reg.ainmhicon.ie/ and decide if it meets your needs. We plan to expand functionality in future but currently support:

1. Registering users and managing login with [magic links](https://supabase.com/docs/guides/auth/auth-email-passwordless)
2. Customising user profiles, including badge pictures
3. Selling tickets, assigning user badge numbers, ticket tiers and registration details for upcoming conventions

While we plan to add these features in future, we currently do not support:

1. Booking/assigning convention hotel rooms
2. Automated cancellations

## Key Components
We'll be running through how to set up each of these components shortly, but to give a brief overview the system is built with

* [React](react.dev), [Tailwind](https://tailwindcss.com/) and [Next.js](https://nextjs.org/) for the user facing stuff
* [Supabase](https://supabase.com/) for the database and user authentication
* [Vercel](https://vercel.com) for hosting
* [Stripe](stripe.com) for sales and payment processing
* [AWS SES](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html) for sending login emails

Importantly, Vercel and Supabase both offer free tiers, while being able to scale up massively. So you can relax when ticket sales go live, and feel confident that people aren't going to hug your registration system to death! 

## Setup Guide

This guide may look intimidatingly long, but it is all quite straightfoward. It should hopefully take you no more than 2 hours to get everything up and running. Without further ado

The first thing you'll likely want to do is fork this repo and then clone that fork to your development machine. Do that now!

#### Note on Environment Variables

We have a lot of keys that need to be set in this project for Supabase and Stripe. We'll be setting these up in Vercel later. Keys that are safe for users to see are prefixed with `NEXT_PUBLIC_`.

When developing locally, we'll set these keys using a file in the root of the project called `.env.local`. If you're following along, create this file now. Inside that file, copy and paste the following:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PK=
NEXT_PUBLIC_REG_START_TIME=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SK=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONTROL_PRODUCT_ID=
CODE_OF_CONDUCT_LINK=
```

We'll fill all of these out as we go along with the setup steps. 

`.env.local` should already be ignored by our [`.gitignore`](.gitignore), but it goes without saying, it is extremely dangerous to check any secret keys into git. If you ever find you've checked in a secret key, make sure it is deleted and replaced with a new key immediately.

### Node.js
The first thing you'll need is [Node.js](https://nodejs.org/en). Download the appropriate version for your development environment and install it. We've developed the System using Node v22 but we will endeaveur to keep it compatible with future versions.

Once installed, you can start the project by opening a terminal/command prompt in the root directory and running

```
npm run dev
```

You should then be able to navigate to http://localhost:3000 to see the System running. You'll likely be greeted by a bunch of errors at this point, because we need to setup Supabase. Lets do that now.

### Supabase

Supabase is where all the registration details for your attendees will be stored, it will also handle login.

#### Project and API Keys
The first step is to create a new project and set the required API keys. This will allow the registration system to connect directly to Supabase.

1. Go to https://supabase.com/ and create an account
2. Once registered, go to the [dashboard](https://supabase.com/dashboard/) and create a new project
    * You can name the project whatever you want
    * _Save_ your password somewhere!
    * For region, select whatever is closest to most of your attendees.
    * Everything else can be left default
3. In your new project's dashboard go to Project Settings > API Keys
    * Click the API Keys tab and select Create new API Keys
    * Copy the Publishable key and paste it into `.env.local` next to `NEXT_PUBLIC_SUPABASE_ANON_KEY=`, this is the key that users on the clientside will use to connect to Supabase. Supabase has [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) so its safe for users to have access to this key, hence why it is prefixed with `NEXT_PUBLIC_`. 
    * Copy the Secret key and paste it into `.env.local` next to `SUPABASE_SERVICE_ROLE_KEY=`. This key must never be revealed to anyone.
4. Go to Project Settings > Data API
    * Copy the Project URL and paste it into `.env.local` next to `NEXT_PUBLIC_SUPABASE_URL=`

At this point if you navigate back to http://localhost:3000  you should be able to see the page load properly. (Note you may need to restart `npm run dev` if you're still seeing errors)

<p align='center'style='width:100%'><img style="width:800px;" src="readme_stuff/home.png"><br/><i>Hopefully you'll now see something like this</i></p>

#### Authentication
The next step is to allow our users to sign in. In our version of this project we've elected to just allow [passwordless email login](https://supabase.com/docs/guides/auth/auth-email-passwordless) and that's what we'll set up here. There's nothing stopping you from providing other login options in your solution though!

1. In Project Settings under the Configuration heading click Authentication
2. In the Supabase Auth tab make sure Allow new users to sign up is checked.
3. Under Auth Providers ensure Email is enabled
4. The content and styling of your emails is configurable under the Configuration > Emails section. The config we've used is in the [email_templates](/email_templates/) folder
5. In Configuration > URL Configuration you should see Site URL. Ensure this is set to  http://localhost:3000. We will come back to this later

If you'd like, you can now try entering your email address on http://localhost:3000, if everything is correct so far, you should receive an email from Supabase and clicking on the link in that email should take you back to the registration site. You'll likely see an error at this point, but that's fine. We'll fix it in the next step.

#### Tables and Functions

Next up we need to set up all of our Tables and Functions. Tables will be set up to store user information, registration details and so on. We also have a couple of basic functions to assign people badge numbers.

Open the SQL Editor in your Supabase project. We'll be pasting a bunch of SQL into here to get everything setup. Navigate to the [infra/supabase](infra/supabase) folder and paste and run the file contents in the following order:

* [functions.sql](infra/supabase/functions.sql) - This contains the code for incrementing badge numbers automatically
* [tables.sql](infra/supabase/tables.sql) - These are all the tables we need for storing information about our con

If you return to http://localhost:3000 and refresh you should see the user registration page, as our Supabase is now set up as expected!

### AWS SES

TODO: Jazzy

### Stripe

Stripe is our payment processor, and it contains a record of all our ticketing information and transactions.

#### Account Setup

To begin, you will need to set up a Stripe account: https://dashboard.stripe.com/. Best to make sure this is secured with 2FA and only accessible by those who need it, since a lot of personal and financial information for convention staff and attendees alike can be accessed here. 

Create a Stripe account and fill in all the personal details it asks for. You don't have to add it immediately, but in order to actually receive payments a bank account needs to be connected to Stripe, preferably a business bank account. 

For setting up and testing, ensure that the Stripe dashboard is in Sandbox Mode. Nothing made here will need actual payment information or take real money. When you are ready to deploy publicly, you should exit sandbox mode and remake/import everything over.

#### Create Products

Navigate to the Product Catalog page, and begin adding products. Ainmhícon 2026 has the following products:

| Name | Pricing |
|-|-|
| 2026 Ticket Controller | €0.00 |
| Ainmhícon 2026 - Founder Package | €270.00 |
| Ainmhícon 2026 - Weekend Sponsor Ticket | €170 |
| Ainmhícon 2026 - Day Pass Sunday Sponsor Ticket | €100 |
| Ainmhícon 2026 - Day Pass Saturday Sponsor Ticket | €100 |
| Ainmhícon 2026 - Weekend Standard Ticket | €90 |
| Ainmhícon 2026 - Day Pass Sunday Standard Ticket | €60 |
| Ainmhícon 2026 - Day Pass Saturday Standard Ticket | €60 |

Note: The "2026 Ticket Controller" product is not actually sold, and exists only to contain metadata about ticket sales and venue capacity. This product contains the following metadata fields inside:

- `tickets_sold_sat`
- `tickets_sold_sun`
- `venue_capacity_sat`
- `venue_capacity_sun`

Within the application we have logic so that each time a ticket purchase is made, one of the `tickets_sold` fields will increment (or both, if a weekend ticket is bought), users will not be brought to the checkout page if the `venue_capacity` has been reached. Stripe does not natively let you set stock/capacity limits, so this is used as a workaround.

All of the actual ticket products contain the following metadata entries, with 3 possible values each:

- day -> saturday / sunday / weekend
- tier -> standard / sponsor / founder

This makes it easy to query specific ticket types through their metadata, which lets us bring a user to checkout with the kind of ticket they want without much hassle.

#### Coupons & Discounts

On the Product catalogue page there is a tab named "Coupons". The project is currently configured to auto-apply the best discount to a user's purchase. This is why the ticket products are created with their late fee as the base price, Early Bird and Standard Fare are applied as discounts on top of the late fee price. Coupons can be configured as a flate rate discount or a percentage, we use a coupon expiry date to set when Early Bird closes.

#### Project Keys

These keys will need to be stored in your project for Stripe to function:

- `NEXT_PUBLIC_STRIPE_PK`
- `STRIPE_SK`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CONTROL_PRODUCT_ID`

__Do Not Forget:__  There are seperate keys for your Sandbox and your Live Stripe environment. Use the Sandbox ones for development and testing! If your secret keys get released publically you should always re-generate new ones immediately

##### `NEXT_PUBLIC_STRIPE_PK` + `STRIPE_SK`

On your Stripe dashboard, search for `Developers > API keys`. Here you will find your Publishable key and Secret key. Use these values for each key in your project respectively.

##### `STRIPE_WEBHOOK_SECRET`

1. On your Stripe dashboard, search for `Webhooks`.
2. Create a new Webhook by clicking "Add destination". 
3. Select all of the "Checkout" events:
    - checkout.session.async_payment_failed
    - checkout.session.async_payment_succeeded
    - checkout.session.completed
    - checkout.session.expired
4. Press Continue
5. Set Destination type as "Webhook endpoint"
6. Set the Destination URL to the project's `stripe-webhook` API endpoint
    - This would be `https://reg.ainmhicon.ie/api/stripe-webhook`
7. Fill in any other optional information, and finish creating your endpoint
8. Once created, you should be able to view the Signing secret. Use this as the value for `STRIPE_WEBHOOK_SECRET`

##### `STRIPE_CONTROL_PRODUCT_ID`

If you have created the "Ticket Controller" product mentioned above, set this value to the Product ID of that product

#### Preparing Stripe for Live Deployment

When you are ready to launch your registration publically, you must make sure you change the secret keys from the Sandbox values to the Live values. You will have to re-create or otherwise import all your products into the Live dashboard too. In order for you to be allowed to accept payments you will need a bank account linked to your Stripe account.

### Vercel 

TODO: Jazzy








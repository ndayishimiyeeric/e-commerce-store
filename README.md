# Full Stack E-Commerce + Dashboard & CMS


>For DEMO, use [Stripe Testing Cards](https://stripe.com/docs/testing)
>
>Live DEMO [Comming soon]()
>
>Store Front-End [Repo](https://github.com/ndayishimiyeeric/e-commerce-store-frontend)

Built With:

- Next.js
- React
- Prisma
- MySQL

Key Features:

- Mulitple vendors or stores through a single CMS!
- CMS will generate API routes for all of those individually!
- Clerk Authentication!
- Order creation
- Stripe checkout
- Stripe webhooks
- MySQL + Prisma + PlanetScale

### Cloning the repository

```shell
git clone https://github.com/ndayishimiyeeric/e-commerce-store.git
```

### Install packages

```shell
npm install
```

### .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=''

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

FRONTEND_STORE_URL=
```

### Connect to PlanetScale and Push Prisma
```shell
npx prisma generate
npx prisma db push
```


### Start the app

```shell
npm run dev
```

## Author

👤 **Odaltoneric**

- GitHub: [@ndayishimiyeeric](https://github.com/ndayishimiyeeric)
- Twitter: [@odaltongain](https://twitter.com/odaltongain)
- LinkedIn: [Ndayishimiye Eric](https://linkedin.com/in/nderic)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- Hat tip to code with Antonio and to everyone who reviewed the project and made suggestions.

## 📝 License

This project is [LICENSE](./LICENSE) licensed.


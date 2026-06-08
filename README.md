# Nuxt Template


This is a starter template for Nuxt to streamline project setup, and get started building your project quickly.

### 🚀 Features:

- Nuxt 4
- Authentication (Nuxt Auth Utils)
- Dark / Light mode
- TypeScript
- Environment-based configuration

Additional branches:

- Shadcn + Prisma
- NuxtUI + Drizzle

📌 This template consists of three branches, offering three different stacks depending on your preferences.. And this readme will explain all three and how to get the one you want working.

⚠ It is **highly recommended** that you read through the documentation/steps of the branch you want to use.

---

### 💻 **Installation:**

1. Depending on the branch you want to use, do the following:
    
    Base branch:
    
    - Create a repository from the template
    - **Leave "Include all branches" disabled**
    
    Shadcn-Prisma or NuxtUI-Drizzle:
    
    - Create a repository from the template
    - **Enable "Include all branches"**
    - Switch to the desired branch
    - Optionally make it the default branch from github settings.
    - Delete unused branches
2. Clone the repo and open it in your IDE.
3. Once you have the repo in your IDE, do the following:
    1. Create three `.env` file **in the root directory**
        1. `.env`: The base .env file.
        2. `.env.development`: For the development environment
        3. `.env.test`: For the development environment
    2. Add the following values to the `.env` files
    
    ```jsx
    NUXT_SESSION_PASSWORD=32CharacterRandomString
    
    NUXT_PUBLIC_APP_ENV='.env respective environment'
    
    # development for .env.development
    # test for .env.test
    # production for .env
    ```
    
    📌 You can use the following command in a **gitBash terminal** to generate the 32CharacterRandomString:   
    `head -c 24 /dev/urandom | base64`
    
4.  Run `npm install`
5.  Run `npm run dev` to start the template.

---

As was mentioned above, this template has three branches, below is the explanation of each one as well as detailed steps on how to set it up.

### Base:

This is the most basic, barebones template, it offers theme switching and authentication, out of the box, giving you full freedom on what to use for UI, database, etc. It is highly recommended to use one of the other two branches, but if you want full control, then this is the one.

📌 The installation steps above are all you need for the base branch.

---

### Shadcn-Prisma:

This branch has everything in the base template — Theme switching & authentication — as well as Shadcn for the UI library, and Prisma as the ORM.
This branch follows the same installation steps mentioned above, but with a bit more steps **After** running `npm install` those steps are:

1. In the `.env` files we created (especially in `.env.development` to start development)  add your DATABASE_URL.
    
    ```jsx
    DATABASE_URL='Your db Url'
    ```
    
2. Run: `npm run db:generate:dev` to generate the required files by Prisma and get prismaClient working.
3. Run: `npm run db:push:dev` to sync your schema with your database.
4. Run `npm run dev` to start the template.

**📌 Important Notes:**

- This branch has a “Users” table already predefined, with a fully functioning login, and signup endpoints, requiring a unique username. If you want something different 
— email — for example, you can change the schema and endpoints as you see fit. This is only a starter after all.
    - Don’t forget to run: `npm run db:push:dev` and `npm run db:generate:dev` **every time you change the schema,** so that your database is in sync, and your prismaClient always has the latest schema.
- If you change the “Users” table/schema, make sure to change the User type in:
**shared/types/auth.d.ts** to ensure consistent typing and intelsense.
- Initially only the Shadcn Button component is installed. You can install other components as you need them.  
👉 https://www.shadcn-vue.com/

---

### NuxtUI-Drizzle:

This branch too has everything in the base template — Theme switching & authentication — as well as NuxtUI for the UI library, and Drizzle as the ORM.

This branch follows the same installation steps mentioned above, but with a bit more steps **After** running `npm install` those steps are:

1. In the `.env` files we created (especially in `.env.development` to start development)  add your DATABASE_URL.
    
    ```jsx
    DATABASE_URL='Your db Url'
    ```
    
2. Run: `npm run db:push:dev` to sync your schema with your database.
3. Run `npm run dev` to start the template.

**📌 Important Notes:**

- This branch has a “Users” table already predefined, with a fully functioning login, and signup endpoints, requiring a unique username. If you want something different 
— email — for example, you can change the schema and endpoints as you see fit. This is only a starter after all.
    - Don’t forget to run: `npm run db:push:dev`  **every time you change the schema,** so that your database is in sync.
- If you change the “Users” table/schema, make sure to change the User type in:
**shared/types/auth.d.ts** to ensure consistent typing and IntelliSense.
- Drizzle ORM requires you to import the tables you are using in queries, that is fine, so don’t stress over it.
- Unlike Shadcn, all of NuxtUI components are installed right off the bat, so you don’t need to install them manually.

---

📖 **References:**

- Shadcn: https://www.shadcn-vue.com/
- Prisma ORM: http://prisma.io/
- NuxtUI: https://ui.nuxt.com/
- Drizzle ORM: https://orm.drizzle.team/
- Auth: https://nuxt.com/modules/auth-utils
- Theming: https://color-mode.nuxtjs.org/

---

Make Something Awesome🤗🤗🤗

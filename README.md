# 🎞 Media Shelf


A Full-Stack Nuxt app for discovering films & shows, tracking watched media, adding favorites, getting recommendations & much more.

Check it out: https://iii-media-shelf.vercel.app/ 👈👈👈

### 🚀 Features:

- Intuitive user-friendly interface.
- Detailed user stats.
- Detailed watch history.
- Extensive filtering options.
- Personal recommendations.

### 💻 Getting Started:

1. Clone the repository.
2. Run `npm install` to install the packages & generate .nuxt directory.
3. In the root directory, create the .env files:
    1. **.env.development**
    2. **.env.test**
    3. **.env**
    
    For now, in the **.env.development,** add the environment variables that are listed in **.env.example.** Make sure to:
    
    1. Set the session password to a 32-character string.
    2. Add your database URL & TMDB Api Key.
4. Run `npm run db:push:dev` to create all the table schemas in your database.
5. Run `npm run dev`  to start the development server.

### 📦 Packages Used:

As was mention above, this site was developed using Nuxt, so the Nuxt ecosystem was primarily used for its packages:

1. **Nuxt:** The Full-Stack application framework.
2. **Nuxt UI:** The main UI library.
3. Inspira UI: Another Nuxt component library.
4. Nuxt Charts: The charts library.
5. Nuxt-auth-utils: The authentication library.
6. Tailwindcss: The main styling library.
7. Drizzle ORM: The database ORM.

---

### 📌 Notes:

- This app uses the local **public/uploads** directory to store profile images in development. However, in production Vercel Storage is used to store images, so the Image URL is slightly different.
    - **Development:** Images are served directly via **/uploads/pathname**
    - **Production:** Images are stored in Vercel storage, and are served via the proxy path **/api/storage/pathname.**
    
    This is implemented via the **[…path].get.ts** endpoint, which is used to stream the file from storage.
    
    📌 All that to say, that if you plan on using Vercel storage, you can keep the code as is, but make sure to add the following to your environment variables. (Mainly the deployment environment variables, but you can add them to development if you want to test things out)
    
    ```jsx
    BLOB_READ_WRITE_TOKEN=your Vercel token
    
    BLOB_STORE_ID=your store Id
    ```
    
    📌 If you plan on using a different storage provider, you can alter **updateInfo.ts** and **[…path].get.ts** to suit your storage provider.
    
- This site is deployed on Vercel.

---

### 🧾 References:

- ✨ https://www.themoviedb.org/ ✨
- https://nuxt.com/
- https://ui.nuxt.com/
- https://inspira-ui.com/
- https://nuxtcharts.com/
- https://nuxt.com/modules/auth-utils
- https://github.com/TonyFresneau/nuxt-rating
- https://tailwindcss.com/
- https://orm.drizzle.team/
- https://particles.js.org/
- https://vercel.com/

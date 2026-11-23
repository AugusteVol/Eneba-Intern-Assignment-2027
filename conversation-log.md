# Conversation Log

## 2026-11-18

### Prompt
I'll be creating a marketplace web application in eneba.com style. I'll be using React Typescript for the frontend and backend in PHP, using REST api's. The database will use MySQL with seeders. Do not create anything outside of what is asked directly. If you see any possible improvements to the code, suggest it instead of changing immediately. This is general information, keep this information stored for the entire chat.

### Response
Stored the project stack and scoped implementation preferences for this repository.

### Prompt
Create the framework: Frontend in one folder, backend in the other. Create only the necessary starting files - the website should not be working as of this moment.

Save a log of this conversation in an md file outside of the whole architecture, but in the \Eneba-Intern-Assignment-2027 folder. It must contain both prompts and your responses. Update it with each change.

### Response
Created separate `frontend` and `backend` folders with minimal React/TypeScript and PHP/MySQL framework starting files. No marketplace features or working application behavior were added.

### Verification and follow-up
Verified the repository status and confirmed that `frontend`, `backend`, and `conversation-log.md` are the only newly created top-level items. PHP syntax checks could not run because the PHP CLI is not available in the current environment. Added the missing `RuntimeException` import in the database seeder placeholder.

### Prompt
Create a gitignore file. Node modules must be in it and .env. List any other recommended files

### Response
Created a root `.gitignore` covering frontend and backend dependencies, environment files, build output, caches, logs, IDE files, coverage output, and operating-system files. Kept `.env.example` trackable.

### Prompt
Let's start with the database seeders. There will be products with multiple sellers.
1. Each seller can have their own price(double) and cashback percentage.
2. Each product has a region, a platform (Steam, Epic Games Store, RockStar Games Launcher, Origin/EA App, Ubisoft Connect or GOG.com, PSN, XboxLive, Nintendo), a description(string), release date(string), publisher(string), creators(string), languages(string) (can be NULL, can be multiple - make it a list or an array).
3. Products can either be a game key or a game currency key. Currencies can be any amount (double)

Create only the seeders.

Additionally, tell me whether you are able to visit websites and review their html layout.

### Response
Added PHP seeders for sellers, products, and product-seller offers. Added representative game-key and game-currency-key records, nullable language arrays, supported platforms, seller-specific prices, and cashback percentages. Multiple sellers are assigned to each product.

Yes, I can visit websites and inspect their HTML/layout using the available web fetch and browser capabilities.

### Seed data follow-up
Expanded the product seed data to include Ubisoft Connect, XboxLive, and Nintendo examples, and added multiple seller offers for those products.

### Prompt
Visit eneba.com and recreate the home page. It must look and feel like eneba. Colors, typography, spacing and components follow the design reference. The home page is assembled from several different blocks, such as a banner, best sellers or deals. Each block gets its content from its own backend service or database, so the frontend only displays what it receives and nothing is hardcoded there.

Create temporary files for product images, I will add them myself later. List any other missing components. No buttons should be working as of yet. I only need the frontend framework.

### Response
Visited eneba.com and reviewed the homepage layout. Added a React frontend framework with a purple Eneba-inspired header, navigation, promotion carousel, category rail, product sections, and gift-card sections. Homepage blocks fetch their own data through `/api/home/banners`, `/api/home/categories`, and `/api/home/sections`; product and section content is not hardcoded in React.

Added temporary banner, product, and gift-card SVG placeholders and `VITE_API_BASE_URL` frontend configuration. All buttons and search controls are intentionally disabled.

### Frontend verification
Ran `npm install` and `npm run build` from the frontend folder. The TypeScript and Vite production build passed. npm reported four high-severity dependency advisories; no dependency upgrade was applied because no implementation improvement was requested.

### Verification cleanup
Removed an accidental root `package-lock.json`; the frontend package lock remains inside the frontend folder.

### Prompt
Add `#logoFull.svg` to the header instead of the brand mark and eneba headline.

### Response
Replaced the generated header brand mark and text in [frontend/src/components/Header.tsx](/D:/GitHub/Eneba-Intern-Assignment-2027/frontend/src/components/Header.tsx) with `frontend/public/images/logoFull.svg`. Updated header brand CSS to size the full logo responsively.

### Prompt
There must be two buttons instead of one for logging in and registering a new user. The `|` must not change position. Change the CSS style accordingly - the same one must be used for both buttons.

### Response
Split the login/register control in [frontend/src/components/Header.tsx](/D:/GitHub/Eneba-Intern-Assignment-2027/frontend/src/components/Header.tsx) into two buttons sharing the `account-button` style, separated by a fixed `account-separator` element. Updated the responsive CSS so the account actions stay grouped or hidden consistently.

### Prompt
Create an SQL file with the entire information in seeders. Keep the tables as `product`, `productSeller`, and `seller`.

### Response
Created [backend/database/seed.sql](/D:/GitHub/Eneba-Intern-Assignment-2027/backend/database/seed.sql) with MySQL table definitions and inserts for all seller, product, and product-seller seeder records. Languages are stored as nullable JSON arrays, currency amounts use `DOUBLE`, and `productSeller` is the junction table with foreign keys.

### Prompt
Implement GET product and GET all products endpoints in the backend (REST). No changes to the frontend may be made for now.

### Response
Added SQLite-backed REST routing in [backend/public/index.php](/D:/GitHub/Eneba-Intern-Assignment-2027/backend/public/index.php), a PDO SQLite connection in [backend/src/Database.php](/D:/GitHub/Eneba-Intern-Assignment-2027/backend/src/Database.php), and product queries in [backend/src/ProductRepository.php](/D:/GitHub/Eneba-Intern-Assignment-2027/backend/src/ProductRepository.php). Added GET `/products` and GET `/products/{id}`. Created and seeded [backend/database/database.sqlite](/D:/GitHub/Eneba-Intern-Assignment-2027/backend/database/database.sqlite) using Python built-in SQLite support: 3 sellers, 9 products, and 19 product-seller offers. No frontend files were changed.

### Prompt
Implement GET Seller and GET all sellers. Add a method to get all sellers for one specific product additionally.

### Response
Added `SellerRepository` with `findAll`, `findById`, and `findAllByProductId`. Added REST routes for `GET /sellers`, `GET /sellers/{id}`, and `GET /products/{id}/sellers`. The product-specific seller response includes offer price and cashback percentage.

### Prompt
Make the menu, Categories, Cheap Games, Software, eGift Cards, and Eneba Gift Cards buttons interactable. They should not navigate to another page and should light up on hover.

### Response
Enabled the header navigation buttons and gave menu and text navigation controls Eneba-style light up hover, active, and keyboard-focus backgrounds. No navigation URLs or click handlers were added.

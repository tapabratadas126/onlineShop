# Walmart-style React Storefront

A responsive multi-page ecommerce prototype rebuilt from the supplied Figma-style reference. The original blurry cropped assets have been replaced with fresh, web-sourced product photography and the navigation now behaves like a real ecommerce site instead of only scrolling within one page.

## What changed

- Home page keeps the reference layout: hero, Deals of the Day, Best Selling Products, Latest Launches, Trending Offers, Discover Latest, newsletter and footer.
- Navigation opens dedicated views for Departments, Deals, Best Selling, Latest Launches and Trending.
- Product cards open product detail views.
- Search opens a real search-results view.
- Category chips, sorting, add-to-cart, cart quantities and demo checkout work.
- Cart state persists in localStorage.
- Newsletter form calls the Express API.
- Hash-based routing works on Vercel/static hosting without server-side rewrite configuration.
- Responsive layouts are included for desktop, tablet and mobile.

## Run

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:5000

For a separate API host, set:

```text
VITE_API_URL=https://your-api.example.com/api
```

## Image sources

The product photographs are remote images selected from web search. Several are free-to-use photographs from Unsplash; each source page identifies the image and its license. They are used as visual stand-ins rather than as official Walmart assets.

Examples used in this build:

- Unsplash skincare: https://unsplash.com/photos/three-colorful-pump-bottles-with-a-flower-EcatBSsexsw
- Unsplash skincare set: https://unsplash.com/photos/skincare-products-including-serums-arranged-on-pink-fGbFh23VIDU
- Unsplash laptop: https://unsplash.com/photos/a-laptop-on-a-desk-E25s9zJuclQ
- Unsplash smartphone: https://unsplash.com/photos/smartphone-with-digital-interface-in-hand-LHs8yrXsR6A
- Unsplash smartphone: https://unsplash.com/photos/a-cell-phone-on-a-table-gl5ZWaEWC3I
- Unsplash smartphone: https://unsplash.com/photos/a-cell-phone-on-a-table-dEczYX6WbJU
- Unsplash smartwatch: https://unsplash.com/photos/black-smart-watch-with-black-strap-5uUErSi29js
- Unsplash earbuds: https://unsplash.com/photos/wireless-earbuds-and-their-charging-case-eFJwnb96exg
- Unsplash sanitizer: https://unsplash.com/photos/three-bottles-of-hand-sanitizers-sitting-on-a-table-vkdyCL9Y93A
- Unsplash chair: https://unsplash.com/photos/brown-wooden-chair-on-gray-concrete-floor-rzqEBbDmDFs
- Unsplash covered car: https://unsplash.com/photos/a-car-covered-in-a-black-cover-sitting-on-top-of-a-white-floor-502v4NjQm50
- Unsplash handbags: https://unsplash.com/photos/a-pair-of-brown-leather-handbags-EjPeevulMPc
- Unsplash patterned bedsheet: https://unsplash.com/photos/a-close-up-of-a-bed-sheet-with-a-flower-pattern-N01JW2cCgyY
- Unsplash wall art: https://unsplash.com/photos/a-painting-on-a-wall-5J25Hly_GXk

## Important

This is a Walmart-inspired UI prototype for learning/prototyping, not an official Walmart site or an integration with Walmart's production services.

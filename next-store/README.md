# Next.js “next-store” deployment and environment

This sub-app is a Next.js storefront that consumes your existing admin-managed backend (MongoDB) and Cloudinary-hosted images.

Environment variables (.env.local)
- NEXT_PUBLIC_API_URL: Backend base URL (e.g., https://damio-kids-backend.onrender.com)
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name (e.g., damio)
- Optional: NEXT_PUBLIC_CLOUDINARY_BASE_URL=https://res.cloudinary.com/<cloud_name>/image/upload

Images
- Configured Next Image to allow:
  - res.cloudinary.com (Cloudinary)
  - damio-kids-backend.onrender.com and *.onrender.com
- If your backend returns Cloudinary URLs, they render optimized by Next’s Image component.

Authentication and cart
- The Next app reads auth tokens from localStorage (authToken or auth-token), like your CRA app.
- addToCart/removeFromCart POST to your backend when authenticated; otherwise a guest cart is used.
- Variant data (size/color) is included when available: { itemId, variant: { size, color }, quantity }

Admin integrations
- Products, categories, new collections, popular, and shop images are read from your backend endpoints.
- Featured Stories page uses shop-images of imageType=feature to curate chapters; category fallback is used when no feature images are present.

Develop
- npm install
- npm run dev

Build
- npm run build
- npm start

Vercel deployment (recommended)
- Create a new Vercel project and point it to the `next-store/` directory (monorepo setup).
- Set environment variables in Vercel:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  - (Backend app should configure MONGODB_URI, CLOUDINARY_URL or separate CLOUDINARY_* keys; not required by Next frontend.)
- No custom build command needed; Vercel will detect Next.js and run `next build`.

Notes for backend (MongoDB + Cloudinary)
- MongoDB (Atlas): set MONGODB_URI in your backend environment.
- Cloudinary: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (or CLOUDINARY_URL) in backend env.
- Upload endpoints (/upload, /upload-multiple) should upload to Cloudinary and store public URLs in MongoDB.
- Shop images endpoint should expose imageType (hero, category, promotional, feature), category, and image URL.

SEO and performance tips
- Use Cloudinary transformations (width, quality, format) in the backend-generated URLs for optimal performance.
- With Next Image remotePatterns configured, images will be optimized and cached by Next.


# SEO-Friendly URLs Implementation Plan

## The Goal
To change the product URLs from the current structure (e.g., `https://www.1steagle.com.ng/product/4`) to an SEO-friendly structure (e.g., `https://www.1steagle.com.ng/product/1steagle-solar-panel-300w`) similar to WordPress and other global e-commerce engines.

## Key Constraint Checklist
- [x] Must not affect existing products.
- [x] Must not touch the current database schema or data.
- [x] Must maintain backwards compatibility (links to `/product/4` must still work to prevent 404s).

## How We Will Achieve This (Zero Database Changes)
After reviewing the `Products.ts` collection configuration (`src/collections/Products.ts`), I discovered that the PayloadCMS database schema **already has a required and unique `slug` field** for all products:

```typescript
{
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
},
```

Since the `slug` is already populated in your database for existing products, we can simply switch the frontend to use this existing field for routing instead of the numeric `id`! We don't need to touch the database at all.

## The Implementation Plan

### 1. Rename the Route Directory
We will rename the product route folder to reflect the new dynamic parameter:
* **From:** `src/app/(app)/product/[id]`
* **To:** `src/app/(app)/product/[slug]`

### 2. Update the Page Logic to Support Slugs AND IDs
We need to ensure that the product page can look up a product by its text `slug`, while still falling back to the numeric `id` for backwards compatibility (so old links don't break).

In `src/app/(app)/product/[slug]/page.tsx`, we will update the fetching logic:

```typescript
// Extract the parameter from the URL
const { slug } = await params;

// Try to find the product by its slug first
let productRes = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    depth: 1,
});

let product = productRes.docs[0];

// If not found by slug, and the parameter is a number, try finding by ID (Backwards Compatibility)
if (!product && !isNaN(Number(slug))) {
    try {
        product = await payload.findByID({ collection: "products", id: slug, depth: 1 });
        
        // Optional: Perform a 301 Permanent Redirect to the new SEO URL for better SEO
        // if (product) redirect(`/product/${product.slug}`, RedirectType.replace);
    } catch (e) {
        // Not found by ID either
    }
}

if (!product) return notFound();
```

### 3. Update Site-Wide Links
Currently, components like `ProductCard.tsx` generate links using the product ID:
```tsx
<Link href={`/product/${product.id}`}>
```

We will perform a global search-and-replace to update these links to use the `slug`:
```tsx
<Link href={`/product/${product.slug || product.id}`}>
```
*(We fall back to `product.id` just in case a slug happens to be missing).*

### 4. Update the Metadata Generation
Just like the page itself, the `generateMetadata` function inside `page.tsx` needs to be updated to resolve the title and description using the `slug` rather than the `id`, ensuring search engines see the correct meta tags for the new URLs.

## Summary of Impact
- **Database Impact:** 0%. No schema migrations, no data changes.
- **Downtime:** 0%.
- **SEO Impact:** Very High. The new URLs will have rich keywords, and old numeric URLs will still resolve (or redirect) to preserve existing search engine indexing.

---
Let me know if you approve this plan, and I can execute it immediately!

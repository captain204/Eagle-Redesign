# Isolated Product Verification & Raffle Draw System

## Goal Description
The objective is to implement the product verification and raffle draw system **without touching the existing e-commerce/Payload CMS database in any way**. 

To accommodate **both offline distributors and automatic online website purchases** while guaranteeing that your current data remains 100% unaffected, we will use an **Isolated Storage Architecture**. This means the raffle system will run as a parallel "micro-system" inside your Next.js app, using its own entirely separate database file.

---

## 1. Integrating with Existing Authentication (Login/Signup)
You currently have a working signup, login, and user dashboard powered by Payload CMS. We will connect the raffle system to this **without modifying your existing auth system**.

1. **The Auth Check**: The new raffle entry page (`/verify-purchase`) will simply be placed behind your *existing* Next.js authentication middleware.
2. **The Flow**: 
   - If an unregistered visitor tries to access the raffle, the system sees they don't have a Payload login cookie and immediately redirects them to your existing `/register` or `/login` page.
   - Once they successfully sign up or log in using your current, untouched Payload system, they are redirected back to the raffle page.
3. **The User Dashboard**: Inside your existing user dashboard, we will simply add a UI Button (a standard HTML `<Link>`) that says "Enter Raffle" pointing to `/verify-purchase`.
4. **Zero Impact**: We do not touch your `Users` collection in Payload, and we do not write any new authentication logic. The raffle system essentially "free-rides" on your existing, perfectly working security.

---

## 2. Automatic Entry for Online Buyers
Customers who buy directly through the 1stEagle website will be entered into the raffle automatically without needing codes or photo uploads:

1. **The Trigger**: When an online customer completes a purchase, your existing Payload CMS system updates the order to "Paid".
2. **The Action**: We will add a simple, non-intrusive event listener (an `afterChange` hook) to your existing `Orders` collection. 
3. **The Result**: When the listener detects a "Paid" order, it instantly and automatically generates a "Verified" raffle entry and saves it directly into the isolated `raffle.sqlite` database under the buyer's email. Online buyers do absolutely nothing.
4. **Zero Impact**: This does not alter your `Orders` database schema or add any new fields. It simply "listens" for a successful sale and writes the entry to the external raffle database.

---

## 3. Manual Entry for Offline Buyers (Distributors)
Offline buyers must prove their physical purchase. We connect them to the isolated system using a **Soft Link**:

1. **The Session**: As explained above, the offline customer logs into the main 1stEagle website exactly as they normally do.
2. **The Submission**: When they submit their photo and code on the protected `/verify-purchase` page, the Next.js frontend securely grabs their existing `userId`, `email`, and `phoneNumber` straight from their active Payload login session.
3. **The Soft Link**: Instead of creating a complex database relationship, the isolated `raffle.sqlite` database simply saves that `userId`, `email`, and `phoneNumber` as plain text in the `RaffleSubmissions` table.

---

## 4. The "Zero-Impact" Architecture

Instead of modifying Payload CMS collections or touching your existing `payload.db` file, we will do the following:

### Completely Separate Database (`raffle.sqlite`)
We will create a brand new, isolated SQLite database file (e.g., `raffle.sqlite`) that sits alongside your app. It will have absolutely no connection to your main Payload database.

### Standalone API Routes (Next.js)
All offline validation logic (checking EXIF data, hashing photos) will be handled in standard Next.js API routes (e.g., `/api/raffle/verify`). These routes will only talk to the new `raffle.sqlite` database.

### The Standalone Raffle Admin Dashboard (`/raffle-admin`)
Because the raffle system is completely isolated from Payload CMS to protect your data, it **will not** appear in your standard Payload Admin panel. Instead, we will build a dedicated, custom Admin UI exclusively for managing the Raffle.

**Features of the Custom Raffle Admin UI:**
1. **Isolated Security**: Accessed via a hidden route (e.g., `/raffle-admin`) and protected by a hardcoded master password (HTTP Basic Auth).
2. **Code Generation Manager**: A button to instantly generate and download unlimited Raffle Code PDFs in batches of 50.
3. **Manual Review Queue (Strict Rules)**: Images that have valid GPS data are automatically approved (`Verified`). The admin is **only** required to manually review images that were uploaded *without* geolocation data (`Flagged`). You click the flagged entry, review the photo, and manually click approve or reject.
4. **Management PDF Report Generator**: A button that instantly generates and downloads a comprehensive PDF report of ALL entries at any time. This PDF is formatted to be sent to management and displays crucial customer details (Email, Phone Number, Date, Status, and Entry Location/Distributor).
5. **Draw Winner Mechanism**: A button to randomly select a winner from the pool of "Verified" entries.

*(Note: Distributors will have a similar but restricted isolated page at `/distributor-raffle` where they enter a specific pin to download their monthly 200 codes).*

---

## Proposed Data Structure (Inside the Isolated `raffle.sqlite`)

We will create three tables in this new, isolated database:

1. **RaffleDistributorLocations**
   - Maps offline distributor names/IDs to their GPS coordinates (Latitude/Longitude).

2. **RaffleCodes**
   - Stores the 8-character codes, the batch ID, who generated them (Admin vs. Distributor), the creation month, and an `isUsed` flag (For offline buyers).

3. **RaffleSubmissions**
   - **`userEmail` / `userId` / `userPhone` (Text)**: The "Soft Link" to the existing customer (works for both automatic online entries and manual offline entries).
   - Stores the customer's uploaded image hash (to prevent duplicates), EXIF data, distance calculation, and the final status (`Verified` or `Flagged`). 

---

## Summary of Guarantee
- **0** Payload CMS collections created or modified.
- **0** Foreign key relationships tying the databases together.
- **100% Isolated** functionality that can be turned on or off without affecting the main website.

(No code will be written until this plan is approved by the design and development team).

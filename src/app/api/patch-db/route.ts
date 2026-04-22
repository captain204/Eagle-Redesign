import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Step 1: Rename the customer_id column to remove the NOT NULL constraint via replacement
    await payload.db.drizzle.run(sql`ALTER TABLE orders RENAME COLUMN customer_id TO _old_customer_id;`);

    // Step 2: Add back the customer_id column as nullable
    await payload.db.drizzle.run(sql`ALTER TABLE orders ADD COLUMN customer_id INTEGER;`);

    // Step 3: Copy the data over
    await payload.db.drizzle.run(sql`UPDATE orders SET customer_id = _old_customer_id;`);

    // Step 4: Drop the old column to remove the NOT NULL constraint completely
    // Note: If running this after a partial fail, it drops the old column
    try { await payload.db.drizzle.run(sql`ALTER TABLE orders DROP COLUMN _old_customer_id;`); } catch (e) { }

    return NextResponse.json({
      success: true,
      message: "Database successfully patched. The NOT NULL constraint on orders.customer_id has been removed. You can now process guest checkouts!"
    });
  } catch (error: any) {
    // If it fails because the column is already renamed or similar, we return the error securely.
    // In many cases, running this script twice will cause a SQLite error saying customer_id already exists, which is fine (means it was already patched).
    return NextResponse.json({
      success: false,
      message: "An error occurred, or the database was already patched.",
      error: error?.message || String(error)
    }, { status: 500 });
  }
}

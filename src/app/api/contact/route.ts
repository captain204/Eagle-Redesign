import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const payload = await getPayload({ config: configPromise });

        const submission = await payload.create({
            collection: "contact-submissions",
            data: {
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email,
                phone: data.phone || "",
                company: data.company || "",
                subject: data.subject || "No Subject",
                message: data.message,
                source: data.source || "general",
            },
        });

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error: any) {
        console.error("Contact Form Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to submit contact form" },
            { status: 500 }
        );
    }
}

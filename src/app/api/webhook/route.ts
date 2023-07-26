import Stripe from "stripe";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    const payload = await req.text();
    const signature = headers().get("Stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session.customer_details?.address

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ]

    const addressString = addressComponents.filter((item) => item !== null).join(", ")

    if (event.type === "checkout.session.completed") {
        await db.order.update({
            where: {
                id: session?.metadata?.orderId
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session.customer_details?.phone || "",
            },
        })

        const order = await db.order.findUnique({
            where: {
                id: session?.metadata?.orderId
            },
            include: {
                items: true,
            },
        })

        const productIds: string[] = order?.items.map((item) => item.productId) || []

        await db.product.updateMany({
            where: {
                id: {
                    in: [...productIds]
                }
            },
            data: {
                quantity: {
                    decrement: 1
                }
            },
        })

        // archive the product if quantity is 0
        await db.product.updateMany({
            where: {
                quantity: {
                    equals: 0
                }
            },
            data: {
                isArchived: true
            },
        })
    }

    return new NextResponse(null, {status: 200});
}

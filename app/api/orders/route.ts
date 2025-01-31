import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            dish: true,
          },
        },
      },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json()
    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: { dishId: number; quantity: number }) => ({
            dishId: item.dishId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 })
  }
}


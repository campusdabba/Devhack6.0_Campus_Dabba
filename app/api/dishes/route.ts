import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        cook: true,
      },
    })
    return NextResponse.json(dishes)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching dishes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, cookId } = await req.json()
    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        price,
        cookId,
      },
    })
    return NextResponse.json(dish)
  } catch (error) {
    return NextResponse.json({ error: "Error creating dish" }, { status: 500 })
  }
}


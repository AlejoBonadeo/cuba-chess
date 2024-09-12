// app/api/player/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  const {
    name,
    dni,
    associateNumber,
  }: {
    name: string;
    dni: string;
    associateNumber: string;
  } = await request.json();

  try {
    const player = await prisma.player.create({
      data: { name, dni, associateNumber, elo: 1300 },
    });

    return NextResponse.json({
      message: "Player created successfully!",
      player,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating player", details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const players = await prisma.player.findMany({ orderBy: { elo: "desc" } });

    return NextResponse.json({ players });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching players", details: error },
      { status: 500 }
    );
  }
}

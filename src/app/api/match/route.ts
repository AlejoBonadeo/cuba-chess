// app/api/match/route.js

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { calculateElo } from "@/utils/elo";

export async function POST(request: NextRequest) {
  const { whitePlayerId, blackPlayerId, result } = await request.json();

  try {
    // Find the white and black players by name
    const whitePlayer = await prisma.player.findUnique({
      where: { id: whitePlayerId },
    });
    const blackPlayer = await prisma.player.findUnique({
      where: { id: blackPlayerId },
    });

    if (!whitePlayer || !blackPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Create the match in the database
    const match = await prisma.match.create({
      data: {
        whitePlayerId: whitePlayer.id,
        blackPlayerId: blackPlayer.id,
        result,
      },
    });

    const { newBlackElo, newWhiteElo } = calculateElo(
      whitePlayer.elo.toNumber(),
      blackPlayer.elo.toNumber(),
      result
    );

    // Update the ELO ratings for both players (you'll need to implement the actual ELO calculation logic)
    // For now, we'll leave the elo update as a placeholder
    const updatedWhitePlayer = await prisma.player.update({
      where: { id: whitePlayer.id },
      data: { elo: newWhiteElo },
    });

    const updatedBlackPlayer = await prisma.player.update({
      where: { id: blackPlayer.id },
      data: { elo: newBlackElo },
    });

    return NextResponse.json({
      message: "Match created successfully!",
      match,
      whitePlayer: updatedWhitePlayer,
      blackPlayer: updatedBlackPlayer,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating match" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: { whitePlayer: true, blackPlayer: true },
      orderBy: { playedAt: "desc" },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching matches", details: error },
      { status: 500 }
    );
  }
}

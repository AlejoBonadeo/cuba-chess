// app/api/match/player/[playerId]/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { playerId: string } }
) {
  const playerId = parseInt(params.playerId);

  if (isNaN(playerId)) {
    return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
  }

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ whitePlayerId: playerId }, { blackPlayerId: playerId }],
      },
      include: { whitePlayer: true, blackPlayer: true },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching matches for player", details: error },
      { status: 500 }
    );
  }
}

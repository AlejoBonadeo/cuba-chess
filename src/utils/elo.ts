import { MatchResult } from "@prisma/client";

// Placeholder function for calculating ELO
export function calculateElo(
  whiteElo: number,
  blackElo: number,
  result: MatchResult
) {
  const K = 32; // FIDE K-factor for rapid ratings (usually 10, 20, or 40 depending on the level)

  // Probability of player 1 (whiteElo) winning
  const whiteExpectedScore =
    1 / (1 + Math.pow(10, (blackElo - whiteElo) / 400));
  const blackExpectedScore = 1 - whiteExpectedScore;

  // Define the actual scores based on result
  const whiteActualScore: number =
    result === "WHITE_WON" ? 1 : result === "DRAW" ? 0.5 : 0;
  const blackActualScore = 1 - whiteActualScore;

  // Calculate new ELO ratings
  const newWhiteElo = Math.max(
    whiteElo + K * (whiteActualScore - whiteExpectedScore),
    1000
  );
  const newBlackElo = Math.max(
    blackElo + K * (blackActualScore - blackExpectedScore),
    1000
  );

  return { newWhiteElo, newBlackElo };
}

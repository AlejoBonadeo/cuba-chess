"use client";

import { useEffect, useState } from "react";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from "@tanstack/react-query";
import { Match, MatchResult } from "@prisma/client";
import { Player } from "@/store/playerStore";
import { html } from "gridjs";

interface MatchWithPlayers extends Match {
  whitePlayer: Player;
  blackPlayer: Player;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchWithPlayers[]>([]);

  // Fetch matches data using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch("/api/match");
      if (!res.ok) {
        throw new Error("Failed to fetch matches");
      }
      return res.json();
    },
  });

  // Update local matches state after successful fetch
  useEffect(() => {
    if (data) {
      setMatches(data.matches);
    }
  }, [data]);

  // Render loading or error states
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error buscando partidas: {(error as Error).message}</div>;
  }

  // Function to determine the styles for winner/loser names
  const getPlayerNameStyle = (
    result: MatchResult,
    whitePlayer: Player,
    blackPlayer: Player
  ) => {
    const colors = {
      WHITE_WON: { white: "text-green-500", black: "text-red-500" },
      BLACK_WON: { white: "text-red-500", black: "text-green-500" },
      DRAW: { white: "text-black", black: "text-black" },
    };

    const { white: whiteClass, black: blackClass } =
      colors[result] || colors.DRAW; // Default to 'draw' if result doesn't match

    return [
      `<span class="${whiteClass}">${whitePlayer.name}</span>`,
      `<span class="${blackClass}">${blackPlayer.name}</span>`,
    ];
  };

  // GridJS data for matches
  const gridData = matches?.map((match: MatchWithPlayers) => {
    const [whitePlayerDisplay, blackPlayerDisplay] = getPlayerNameStyle(
      match.result,
      match.whitePlayer,
      match.blackPlayer
    );

    return [
      whitePlayerDisplay,
      blackPlayerDisplay,
      match.result === "WHITE_WON"
        ? "Victoria Blancas"
        : match.result === "BLACK_WON"
        ? "Victoria Negras"
        : "Tablas",
      new Date(match.playedAt).toLocaleDateString(),
    ];
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>

      <Grid
        data={gridData}
        columns={[
          {
            name: "Jugador Blancas",
            formatter: (cell) => html(cell?.toString() ?? ""), // Formatter for HTML content
          },
          {
            name: "Jugador Negras",
            formatter: (cell) => html(cell?.toString() ?? ""), // Formatter for HTML content
          },
          "Resultado",
          "Fecha",
        ]}
        search={true}
        sort={true}
        pagination={{ limit: 10 }}
        className={{
          table: "table-auto w-full text-center",
          thead: "bg-gray-100",
          th: "px-4 py-2",
          td: "px-4 py-2",
        }}
      />
    </div>
  );
}

// pages/list.js

"use client";

import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { useFetchPlayers } from "@/hooks/useFetchPlayers";
import usePlayerStore from "@/store/playerStore";

export default function List() {
  // Sample data for the grid

  const { isLoading, isError } = useFetchPlayers(); // Fetch players
  const { players } = usePlayerStore(); // Access players from Zustand

  if (isLoading) {
    return <div>Loading players...</div>;
  }

  if (isError) {
    return <div>Error fetching players</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Players List</h1>

      {/* Grid.js table */}
      <Grid
        data={players.map((player) => [
          player.name,
          player.associateNumber,
          player.dni,
          Math.round(player.elo),
        ])}
        columns={[
          { name: "Nombre", width: "150px" },
          { name: "Nro Socio", width: "150px" },
          { name: "DNI", width: "150px" },
          { name: "ELO", width: "100px" },
        ]}
        search={true}
        sort={true}
        pagination={{ limit: 5 }}
        className={{
          container: "text-sm",
          table: "table-auto w-full text-left",
          thead: "bg-gray-200",
          th: "p-2 font-medium",
          td: "p-2 border-b",
        }}
      />
    </div>
  );
}

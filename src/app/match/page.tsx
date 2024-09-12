// pages/match.js
"use client";
import usePlayerStore from "@/store/playerStore";
import { FormEventHandler, useState } from "react";

export default function Match() {
  const { players, updatePlayerElo } = usePlayerStore();

  // State for form inputs
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [eloChanges, setEloChanges] = useState<{
    whitePlayerChange: number | null;
    blackPlayerChange: number | null;
  }>({ whitePlayerChange: null, blackPlayerChange: null });

  const handleSubmit: FormEventHandler = async (e) => {
    try {
      e.preventDefault();

      const matchData = {
        whitePlayerId: +whitePlayer,
        blackPlayerId: +blackPlayer,
        result,
      };

      setLoading(true);
      // Submit match data to your endpoint (e.g., /api/matches)
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });

      if (response.ok) {
        // Handle success (e.g., show a message or redirect)
        const {
          whitePlayer: updatedWhitePlayer,
          blackPlayer: updatedBlackPlayer,
        } = await response.json();

        // Update ELOs in Zustand store
        const whitePlayerOldElo = players.find(
          (p) => p.id === +whitePlayer
        )?.elo;
        const blackPlayerOldElo = players.find(
          (p) => p.id === +blackPlayer
        )?.elo;

        updatePlayerElo(updatedWhitePlayer.id, updatedWhitePlayer.elo);
        updatePlayerElo(updatedBlackPlayer.id, updatedBlackPlayer.elo);

        setEloChanges({
          whitePlayerChange:
            updatedWhitePlayer.elo -
            (whitePlayerOldElo ?? updatedWhitePlayer.elo),
          blackPlayerChange:
            updatedBlackPlayer.elo -
            (blackPlayerOldElo ?? updatedBlackPlayer.elo),
        });
      } else {
        // Handle error
        console.error("Error submitting match");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Record a Match</h1>

      <form onSubmit={handleSubmit}>
        {/* White Player Name Input */}
        <div className="mb-4">
          <label htmlFor="whitePlayer" className="block text-gray-700">
            Jugador de blancas:
          </label>
          <select
            id="whitePlayer"
            value={whitePlayer}
            onChange={(e) => setWhitePlayer(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="" defaultChecked disabled>
              Seleccionar
            </option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ELO: {Math.round(player.elo)})
              </option>
            ))}
          </select>
          {eloChanges.whitePlayerChange !== null && (
            <p
              className={`mt-2 text-sm ${
                eloChanges.whitePlayerChange > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {eloChanges.whitePlayerChange > 0 ? "+" : ""}
              {Math.round(eloChanges.whitePlayerChange)}
            </p>
          )}
        </div>

        {/* Black Player Name Input */}
        <div className="mb-4">
          <label htmlFor="blackPlayer" className="block text-gray-700">
            Jugador de negras:
          </label>
          <select
            id="blackPlayer"
            value={blackPlayer}
            onChange={(e) => setBlackPlayer(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="" defaultChecked disabled>
              Seleccionar
            </option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ELO: {Math.round(player.elo)})
              </option>
            ))}
          </select>
          {eloChanges.blackPlayerChange !== null && (
            <p
              className={`mt-2 text-sm ${
                eloChanges.blackPlayerChange > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {eloChanges.blackPlayerChange > 0 ? "+" : ""}
              {Math.round(eloChanges.blackPlayerChange)}
            </p>
          )}
        </div>

        {/* Result Selector */}
        <div className="mb-4">
          <label htmlFor="result" className="block text-gray-700">
            Resultado
          </label>
          <select
            id="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          >
            <option value="" disabled>
              Seleccionar
            </option>
            <option value="WHITE_WON">Victoria Blancas</option>
            <option value="BLACK_WON">Victoria Negras</option>
            <option value="DRAW">Tablas</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-slate-700" : "bg-indigo-600"
            } text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition`}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Subir"}
          </button>
        </div>
      </form>
    </div>
  );
}

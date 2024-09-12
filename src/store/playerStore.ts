// lib/stores/playerStore.ts
import { Player as BackendPlayer } from "@prisma/client";
import { create } from "zustand";

export type Player = Omit<BackendPlayer, "elo"> & { elo: number };

interface PlayerStore {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  updatePlayerElo: (id: number, newElo: number) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  setPlayers: (players) => set({ players }),
  updatePlayerElo: (id, newElo) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, elo: newElo } : player
      ),
    })),
}));

export default usePlayerStore;

// lib/hooks/useFetchPlayers.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import usePlayerStore, { Player } from "../store/playerStore";

const fetchPlayers = async (): Promise<Player[]> => {
  const res = await fetch("/api/player");
  if (!res.ok) {
    throw new Error("Failed to fetch players");
  }
  const data = await res.json();
  return data.players;
};

// Custom hook to fetch players and store them in Zustand when the query is updated
export const useFetchPlayers = () => {
  const { setPlayers } = usePlayerStore(); // Access Zustand's setPlayers

  // Fetch players using React Query
  const query = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Use useEffect to store fetched players in Zustand when query data changes
  useEffect(() => {
    if (query.data) {
      setPlayers(query.data); // Update Zustand store when data is available
    }
  }, [query.data, setPlayers]); // Effect runs only when data changes

  return query;
};

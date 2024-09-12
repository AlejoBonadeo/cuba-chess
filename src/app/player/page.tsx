"use client";

import usePlayerStore from "@/store/playerStore";
import { useState } from "react";

export default function CreatePlayerPage() {
  const { players, setPlayers } = usePlayerStore(); // Access Zustand store

  // Form states for player inputs
  const [name, setName] = useState("");
  const [associateNumber, setAssociateNumber] = useState("");
  const [dni, setDni] = useState("");

  // State to handle form submission feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPlayerData = { name, associateNumber, dni };
    setLoading(true);

    try {
      // Call API to create a new player
      const response = await fetch("/api/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlayerData),
      });

      if (response.ok) {
        const createdPlayer = await response.json();

        // Update Zustand store with new player
        setPlayers([...players, createdPlayer]);

        // Reset form and display success message
        setName("");
        setAssociateNumber("");
        setDni("");
        setSuccessMessage("Jugador creado!");
        setErrorMessage(null);
      } else {
        // Handle error and show error message
        setErrorMessage("Error creando al jugador");
        setSuccessMessage(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setErrorMessage("Error inesperado");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Agregar jugador</h1>

      {/* Success and Error Messages */}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="associateNumber"
            className="block text-sm font-medium"
          >
            Nro Socio
          </label>
          <input
            id="associateNumber"
            type="text"
            value={associateNumber}
            onChange={(e) => setAssociateNumber(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="dni" className="block text-sm font-medium">
            DNI
          </label>
          <input
            id="dni"
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full ${
            loading ? "bg-slate-700" : "bg-indigo-600"
          } text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition`}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
}

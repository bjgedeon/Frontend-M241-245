// src/api.js

const API_URL = 'http://localhost:8000';  // Deine API URL

// Funktion zum Token generieren
export async function generateToken(credentials) {
  try {
    const response = await fetch(`${API_URL}/user/new-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token Fehler: ${error.detail}`);
    }

    return await response.json();  // Rückgabe des Tokens
  } catch (error) {
    throw new Error(`Fehler bei der Token-Erstellung: ${error.message}`);
  }
}

// Funktion zum Abrufen von Sensor-Daten
export async function fetchSensorData(clientName, token) {
  try {
    const response = await fetch(`${API_URL}/sensors/get-data?client=${clientName}`, {
      headers: { 'token': token }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Sensor-Daten Fehler: ${error.detail}`);
    }

    return await response.json();  // Rückgabe der Sensordaten
  } catch (error) {
    throw new Error(`Fehler beim Abrufen der Sensor-Daten: ${error.message}`);
  }
}

// src/api.js
export async function fetchData() {
  try {
    const response = await fetch('/sensorData.json'); // Lade die JSON-Datei aus dem public-Ordner
    if (!response.ok) {
      throw new Error('Netzwerkantwort war nicht ok');
    }
    const data = await response.json(); // Parsen der JSON-Daten
    return data;
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return {};
  }
}
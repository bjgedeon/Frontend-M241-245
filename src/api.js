const API_BASE_URL = "https://api.bbzw-horizon.duckdns.org";

let lastTimestamp = false;

/**
 * Erzeugt ein Token fuer einen Benutzer anhand von Benutzername und Passwort.
 * Fuehrt einen fetch-Aufruf an die API durch, um eine neue Benutzersitzung zu erhalten.
 *
 * @param {string} username - Der Benutzername.
 * @param {string} password - Das Passwort.
 * @returns {Promise<string>} Ein Promise, das das Token zurueckgibt.
 */
export async function generateToken(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/new-session`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Error: " + response.statusText);
    }

    const data = await response.json();

    console.log("Token erhalten:", data.token);

    return data.token;
  } catch (error) {
    console.error("Fehler beim Erstellen der Benutzersitzung:", error);
  }
}

/**
 * Ruft Sensordaten von der API ab.
 * Berechnet den Zeitraum basierend auf dem aktuellen Datum und dem zuletzt ermittelten Zeitstempel.
 *
 * @param {string} client - Der Name des Klienten.
 * @param {string} token - Das Authentifizierungstoken.
 * @returns {Promise<Object[]>} Ein Promise, das ein Array der Sensordaten zurueckgibt.
 */
export const fetchData = async (client, token) => {
  try {
    const currentDate = new Date();

    let startDate;

    if (!lastTimestamp) {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 1);
      startDate.setHours(startDate.getHours() + 2);
      console.log("Erster Abruf – Zeitraum: letzte 24 Stunden (+2h Offset)");
      lastTimestamp = true;
    } else {
      startDate = new Date(lastTimestamp);
      startDate.setSeconds(startDate.getSeconds() - 10);
      startDate.setHours(startDate.getHours() + 2);
      console.log(
        "Folgeabruf – Zeitraum seit letztem Zeitstempel (+2h Offset):",
        startDate.toISOString()
      );
    }

    const url = `${API_BASE_URL}/sensors/get-data?client=${client}&start_date=${startDate.toISOString()}&end_date=${currentDate.toISOString()}`;

    console.log("Request URL:", url);

    if (!token) {
      throw new Error("Token fehlt oder ist ungultig");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Abrufen der Sensordaten: ${errorText}`);
    }

    const data = await response.json();

    console.log("Response Data:", data);

    if (data.length > 0) {
      const newest = data[data.length - 1];
      lastTimestamp = new Date(newest.timestamp || newest.time || newest.date);
      console.log("Neuer letzter Zeitstempel:", lastTimestamp);
    }

    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Sensordaten:", error);
    throw error;
  }
};

/**
 * Ruft eine Liste von Klienten von der API ab.
 *
 * @param {string} token - Das Authentifizierungstoken.
 * @returns {Promise<string[]>} Ein Promise, das ein Array der Klientnamen zurueckgibt.
 */
export async function fetchClients(token) {
  try {
    if (!token) {
      throw new Error("Token fehlt oder ist ungultig");
    }

    const response = await fetch(`${API_BASE_URL}/clients/get-client`, {
      method: "GET",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Abrufen der Klienten: ${errorText}`);
    }

    const data = await response.json();

    return data.map((client) => client.name);

    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Klienten:", error);
    throw error;
  }
}

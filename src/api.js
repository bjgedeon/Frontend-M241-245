const API_BASE_URL = 'http://172.18.14.20:8080'; 

export async function generateToken(username, password) {

  try {
      const response = await fetch(`${API_BASE_URL}/user/new-session`, {

          method: 'POST',

          headers: {
              'Content-Type': 'application/json',
              // Remove the Authorization header here since it is not needed for token generation
          },

          body: JSON.stringify({
              username: username,
              password: password
          }),

      });

      if (!response.ok) {
          throw new Error('Error: ' + response.statusText);
      }

      const data = await response.json();

      console.log('Token erhalten:', data.token);

      // Token und Gültigkeitsdatum im Zustand oder in einem Store speichern
      return data.token;  // Return the token only

  } catch (error) {
      console.error('Fehler beim Erstellen der Session:', error);
  }
}

// Funktion, um Sensordaten abzurufen
export const fetchData = async (client, token) => {
  try {

    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 1); // Setzt das Startdatum auf gestern

    const url = `${API_BASE_URL}/sensors/get-data?client=${client}`;

    console.log("Request URL:", url);  // Für Debugging

    // Überprüfe, ob das Token vorhanden ist
    if (!token) {
      throw new Error("Token fehlt oder ist ungültig");
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Übergebe das Token im Header
        'Content-Type': 'application/json',
        'start_date': startDate.toISOString(), // Startdatum als Header
        'end_date': currentDate.toISOString(), // Enddatum als Header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Abrufen der Sensordaten: ${errorText}`);
    }

    return await response.json(); // Die Sensordaten zurückgeben
  } catch (error) {
    console.error('Fehler beim Abrufen der Sensordaten:', error);
    throw error;  // Fehler weiterwerfen, damit er im Dashboard behandelt werden kann
  }
};



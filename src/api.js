const API_BASE_URL = 'http://bbzw-horizon.duckdns.org:8080'; 

export async function generateToken(username, password) {

  try {
      const response = await fetch(`${API_BASE_URL}/user/new-session`, {

          method: 'POST',

          headers: {
              'Content-Type': 'application/json',
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

      return data.token;
  } catch (error) {
      console.error('Fehler beim Erstellen der Session:', error);
  }
}

export const fetchData = async (client, token) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 1);

    const url = `${API_BASE_URL}/sensors/get-data?client=${client}&start_date=${startDate.toISOString()}&end_date=${currentDate.toISOString()}`;

    console.log("Request URL:", url);

    if (!token) {
      throw new Error("Token fehlt oder ist ungültig");
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Abrufen der Sensordaten: ${errorText}`);
    }

    const data = await response.json();
    console.log("Response Data:", data); // <--- Hier wird die Response angezeigt

    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Sensordaten:', error);
    throw error;
  }
};




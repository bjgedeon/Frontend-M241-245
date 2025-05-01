const API_BASE_URL = 'http://172.18.14.20:8080'; 

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

    const url = `${API_BASE_URL}/sensors/get-data?client=${client}`;

    console.log("Request URL:", url);


    if (!token) {
      throw new Error("Token fehlt oder ist ungültig");
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'start_date': startDate.toISOString(),
        'end_date': currentDate.toISOString(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Abrufen der Sensordaten: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Abrufen der Sensordaten:', error);
    throw error;
  }
};



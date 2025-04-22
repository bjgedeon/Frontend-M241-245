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

export const fetchData = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sensors/get-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token passed to this function
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Sensordaten');
    }

    return await response.json(); // Return the data as JSON
  } catch (error) {
    console.error('Fehler beim Abrufen der Sensordaten:', error);
    throw error;
  }
};

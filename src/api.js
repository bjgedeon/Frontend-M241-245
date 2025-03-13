export const fetchData = async () => {
    try {
      const response = await fetch('https://example.com/api/data');
      if (!response.ok) throw new Error('Fehler beim Abrufen der Daten');
      return await response.json();
    } catch (error) {
      console.error('API-Fehler:', error);
      throw error;
    }
  };
  
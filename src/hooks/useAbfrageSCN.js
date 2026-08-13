import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Custom Hook zum Abrufen der SCN-Tabellendaten von der API.
// endpoint und query werden aktuell entgegengenommen, aber noch nicht verwendet
// (evtl. für spätere Erweiterungen gedacht, um die Abfrage-URL dynamisch zu machen).
const useAbfrageSCN = (endpoint, query) => {
  // Enthält die eigentlichen Tabellendaten (Array von Vereinen/Zeilen)
  const [data, setData] = useState([]);

  // Zeitstempel der letzten Datenaktualisierung (kommt aus response.data[0])
  const [update, setUpdate] = useState('');

  // Ladezustand, z. B. um einen Spinner in der UI anzuzeigen
  const [isLoading, setIsLoading] = useState(false);

  // Speichert einen eventuell aufgetretenen Fehler (z. B. Netzwerkfehler)
  const [error, setError] = useState(null);

  // fetchData ist mit useCallback "gewrapt", damit die Funktion bei jedem
  // Render die GLEICHE Referenz behält (wichtig für die useEffect-Dependency
  // weiter unten – sonst würde der Effect bei jedem Render erneut feuern
  // und es käme zu einer Endlosschleife / "Maximum Update Depth Exceeded").
  const fetchData = useCallback(async () => {
    // Ladezustand aktivieren, bevor der Request gestartet wird
    setIsLoading(true);

    try {
      // GET-Request an die JSON-Schnittstelle der Website
      const response = await axios.request({
        method: 'GET',
        url: 'https://www.rundf.eu/scraping/scnTabelle.json',
      });

      // Das erste Element im Array enthält den Zeitstempel der letzten
      // Aktualisierung ("Daten Stand") – wird separat gespeichert.
      setUpdate(response.data[0].timestamp);

      // Die kompletten Rohdaten werden in den State geschrieben.
      // Hinweis: response.data[0] (der Timestamp-Eintrag) landet dadurch
      // ebenfalls im data-Array und somit später in der FlatList.
      setData(response.data);
    } catch (error) {
      // Fehler (z. B. kein Netzwerk, Server nicht erreichbar) im State speichern,
      // damit er in der UI angezeigt werden kann
      setError(error);
      console.log(error);
    } finally {
      // Ladezustand in jedem Fall (Erfolg oder Fehler) wieder zurücksetzen
      setIsLoading(false);
    }
  }, []); // Leeres Array: fetchData hat keine externen Abhängigkeiten,
  // die sich über Zeit ändern könnten -> Referenz bleibt stabil

  // Beim ersten Mounten der Komponente einmalig Daten laden.
  // fetchData steht in der Dependency-Liste, weil ESLint (exhaustive-deps)
  // das verlangt; da fetchData dank useCallback stabil bleibt, läuft der
  // Effect trotzdem nur einmal.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manuelle Refetch-Funktion, z. B. um sie bei "Pull to Refresh"
  // oder beim erneuten Fokussieren des Screens aufzurufen
  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // Rückgabe aller relevanten Werte/Funktionen an die aufrufende Komponente
  return { data, update, isLoading, error, refetch };
};

export default useAbfrageSCN;

import axios, { isCancel } from 'axios';
import { useEffect, useState } from 'react';

/**
 * Ein benutzerdefinihter Hook, um asynchron Daten von einer API zu abrufen.
 * Er verwaltet den Ladezustand, die zurückgegebenen Daten und eventuelle Fehler.
 * @param {string} url Die URL des Endpunkts, von dem Daten abgerufen werden sollen.
 * @returns {{ data: any, loading: boolean, error: Error | null, refetch: Function }} Ein Objekt mit den Fetch-Zuständen und einer Refetch-Funktion.
 */
const useFetch = (url) => {
  // Zustände definieren: data (die abgerufenen Informationen), loading (Ladezustand), error (Fehlerobjekt)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect wird ausgeführt, wenn die Komponente gemountet wird oder die 'url' ändert.
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // API-Aufruf mit axios. Cache-Header sind gesetzt, um sicherzustellen,
        // dass nicht veraltete Daten vom Browser Cache verwendet werden.
        const result = await axios.get(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Gültigkeitssperre
            Pragma: 'no-cache', // Älterer Cache-Header
            Expires: '0', // Erzwingt sofortige Aktualisierung
          },
          signal: controller.signal,
        });
        setData(result.data); // Speichert die geladenen Daten
      } catch (error) {
        if (isCancel(error)) {
          // Request wurde abgebrochen, keine Fehlerzustandsaktualisierung nötig
          return;
        }
        setError(error); // Speichert den Fehler bei einem API-Fehler
      } finally {
        setLoading(false); // Setzt den Ladezustand immer auf false
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]); // Dieser Effekt läuft jedes Mal, wenn die 'url' ändert

  // refetch-Funktion ermöglicht es dem Benutzer, die Daten manuell zu aktualisieren.
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Erneuter API-Aufbr...
      const result = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      setData(result.data); // Aktualisiert die Daten
    } catch (error) {
      setError(error); // Speichert den Fehler
    } finally {
      setLoading(false); // Setzt den Ladezustand
    }
  };

  // Gibt alle notwendigen Zustände und die Aktualisierungsfunktion zurück.
  return { data, loading, error, refetch };
};

export default useFetch;

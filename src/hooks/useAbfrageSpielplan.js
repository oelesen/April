import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

// Auf Modulebene verschoben: hängen von nichts Dynamischem ab (keine Props/State),
// dadurch bleiben es stabile Referenzen und sie tauchen nicht mehr als
// "missing dependency" von useCallback auf.
const spiele = {
  method: 'GET',
  url: 'https://www.rundf.eu/scraping/newGames.json',
  headers: {
    'Cache-Control': 'no-cache',
  },
};
const spieleLetzte = {
  method: 'GET',
  url: 'https://www.rundf.eu/scraping/spieleLetzte.json',
  headers: {
    'Cache-Control': 'no-cache',
  },
};

const useAbfrageSpielplan = (endpoint, query) => {
  const [neue, setNeue] = useState([]);
  const [alte, setAlte] = useState([]);
  const [update, setUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      //////////////////////////////////////////////////////////////////
      const response = await axios.request(spiele);
      //console.log(response.data);
      //update ist das Datum der letzten Aktualisierung (Daten Stand)
      setUpdate(response.data.lastUpdated); //angepasst an spiele.json
      // feldclear = JSON.parse(response.data[1]);
      setNeue(response.data);
      //console.log(response.data);
      //////////////////////////////////////////////////////////////////
      const response2 = await axios.request(spieleLetzte);
      const data = response2.data;

      const now = new Date('2026-08-01T00:00:00');

      const gefilterteSpiele = data.spiele.filter((spiel) => {
        const spielDatum = new Date(spiel.timestamp.replace(' ', 'T'));
        return spielDatum > now;
      });

      const oldGames = {
        lastUpdated: data.lastUpdated,
        spiele: gefilterteSpiele,
      };

      setAlte(oldGames);
      console.log(oldGames);
      ////////////////////////////////////////////////////////////////
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //Beim ersten Aufruf der Seite:
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Jedes Mal beim Screen-Fokus
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  return { alte, neue, update, isLoading, error };
};

export default useAbfrageSpielplan;

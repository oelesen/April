import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const useAbfrageApos = (date) => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wann = format(new Date(date), 'yyyy-MM-dd');
  //const wann = '2023-07-21';
  const options = {
    method: 'GET',
    url: `https://www.rundf.eu/php/apoNotdienst.php?date=${wann}`,
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.request(options);
      //console.log(response.data);
      setUpdate(response.data);
      //feldclear = JSON.parse(response.data);
      //console.log(feldclear);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //die Abfrage wird aufgerufen, wenn sich das geforderte Datum änder oder am Anfang
  useEffect(() => {
    fetchData();
  }, [wann]);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, update, isLoading, error, refetch };
};

export default useAbfrageApos;

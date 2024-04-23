import { useState, useEffect } from "react";

export function useWeather(location) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  useEffect(
    function () {
      if (location.length < 2) return setWeather({});

      const controller = new AbortController();
      const signal = controller.signal;

      async function fetchWeather() {
        try {
          setIsLoading(true);

          // 1) Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
            { signal }
          );
          const geoData = await geoRes.json();
          // console.log(geoData);

          if (!geoData.results) throw new Error("Location not found");

          const { latitude, longitude, timezone, name, country_code } = geoData.results.at(0);
          setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          // console.log(weatherData.daily);
          setWeather(weatherData.daily);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }

      fetchWeather();
      localStorage.setItem("location", location);

      return function () {
        controller.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]
  );

  return { isLoading, displayLocation, weather };
}

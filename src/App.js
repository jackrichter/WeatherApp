import { useState, useEffect } from "react";
import { useWeather } from "./useWeather";
import Input from "./components/Input";
import Weather from "./components/Weather";

function App() {
  const [location, setLocation] = useState("");
  const { isLoading, displayLocation, weather } = useWeather(location);

  useEffect(() => {
    setLocation(localStorage.getItem("location"));
  }, []);

  return (
    <div className="app">
      <h1>Weather App</h1>
      <Input location={location} onChangeLocation={setLocation} />
      {isLoading && <p className="loader">Loading...</p>}
      {weather.weathercode && <Weather weatherData={weather} location={displayLocation} />}
    </div>
  );
}

export default App;

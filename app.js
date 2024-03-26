const express = require("express");
const axios = require("axios");
const app = express();
require('dotenv').config();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Обработка запроса на получение погоды
app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;


  try {
    // Запрос данных о погоде с использованием API OpenWeatherMap
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const weatherData = response.data;

    // Подготовка ответа
    const currentTimeInCity = new Date(weatherData.dt * 1000); // Время в городе
    const currentTimeOnServer = new Date(); // Время на сервере
    const timeDifference = Math.abs(currentTimeOnServer.getTimezoneOffset() / 60); // Разница в часах

    const weatherResponse = {
      city: weatherData.name,
      currentTimeInCity: currentTimeInCity.toISOString(), // В формате ISO
      currentTimeOnServer: currentTimeOnServer.toISOString(), // В формате ISO
      timeDifference: `${timeDifference} hours`,
      temperature: weatherData.main.temp,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      clouds: weatherData.weather[0].description
    };

    res.json(weatherResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработка ошибок для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

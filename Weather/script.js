
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const apiKey = "7bc13029f7ad6ec2db116bf5f90184b9";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const { name, weather, main } = data;
      const weatherDescription = weather[0].description;
      const temperature = main.temp;

      if (Notification.permission === "granted") {
        const notification = new Notification("Weather Update", {
          body: `Location: ${name}\nWeather: ${weatherDescription}\nTemperature: ${temperature}°C`,
          icon: `https://openweathermap.org/img/w/${weather[0].icon}.png`
        });
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            const notification = new Notification("Weather Update", {
              body: `Location: ${name}\nWeather: ${weatherDescription}\nTemperature: ${temperature}°C`,
              icon: `https://openweathermap.org/img/w/${weather[0].icon}.png`
            });
          }
        });
      }

      const weatherElement = document.getElementById("weather");
      weatherElement.innerHTML = `
        <h2>${name}</h2>
        <p>${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
      `;
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
  }
});

getLocation();

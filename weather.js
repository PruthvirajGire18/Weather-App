const btn = document.getElementById("btn");
const tdata = document.getElementById("tdata");
const hdata = document.getElementById("hdata");
const wdata = document.getElementById("wdata");
const desc = document.getElementById("desc");
const icon = document.getElementById("icon");
const error = document.getElementById("error");
const input = document.getElementById("input");
const recentContainer = document.getElementById("recent");
const toggle = document.getElementById("themeToggle");

const apikey = "50b5975f5c3c26902c203dbed6e0e201";

// Fetch weather for a city
async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
  tdata.innerText = hdata.innerText = wdata.innerText = desc.innerText = "Loading...";
  icon.src = "";
  error.innerText = "";

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    tdata.innerText = `${data.main.temp} °C`;
    hdata.innerText = `${data.main.humidity} %`;
    wdata.innerText = `${data.wind.speed} m/s`;
    desc.innerText = data.weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    addRecent(city);
  } catch (err) {
    error.innerText = "❌ City not found!";
    tdata.innerText = hdata.innerText = wdata.innerText = desc.innerText = "--";
    icon.src = "";
  }
}

// Button click
btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// 🌙 Dark Mode Toggle
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// 🕘 Save and Show Recent Searches
function addRecent(city) {
  let recent = JSON.parse(localStorage.getItem("recent")) || [];
  if (!recent.includes(city)) {
    recent.unshift(city);
    if (recent.length > 5) recent.pop();
    localStorage.setItem("recent", JSON.stringify(recent));
  }
  renderRecent();
}

function renderRecent() {
  const recent = JSON.parse(localStorage.getItem("recent")) || [];
  recentContainer.innerHTML = "<h3>Recent Searches:</h3>";
  recent.forEach(city => {
    const btn = document.createElement("button");
    btn.innerText = city;
    btn.onclick = () => fetchWeather(city);
    recentContainer.appendChild(btn);
  });
}

// 📍 Geolocation
function fetchByLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Location error");
        const data = await res.json();
        input.value = data.name;
        fetchWeather(data.name);
      } catch {
        error.innerText = "⚠️ Unable to fetch your location's weather.";
      }
    });
  }
}

// Init
renderRecent();
fetchByLocation();

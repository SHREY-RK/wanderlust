async function initMap() {
  const mapDiv = document.querySelector("#map");
  let lat, lon;
  let title = mapDiv.dataset.title;

  if (mapDiv.dataset.lat && mapDiv.dataset.lon) {
    lat = Number(mapDiv.dataset.lat);
    lon = Number(mapDiv.dataset.lon);
  } else {
    const location = mapDiv.dataset.location;
    const country = mapDiv.dataset.country;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        `${location}, ${country}`,
      )}&format=json&limit=1`,
    );

    const data = await response.json();

    lat = Number(data[0].lat);
    lon = Number(data[0].lon);
  }

  const map = L.map("map").setView([lat, lon], 5);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.marker([lat, lon]).addTo(map).bindTooltip(`<h5>${title}</h5><p>Exact location will be proveded after booking</p>`);

  L.circle([lat, lon], {
    radius: 10000,
  }).addTo(map);
}

initMap();

// SELECTORS
const altitudeElement = document.getElementById("altitude");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const velocityElement = document.getElementById("velocity");

const centerCheckbox = document.getElementById("center");
const pauseCheckbox = document.getElementById("pause");

const centerIcon = document.getElementById("ISS-center");

const mapDiv = document.getElementById("ISS-map");

// VARIABLES
const ISS_DATA = {
    altitude: 0,
    latitude: 0,
    longitude: 0,
    velocity: 0,
};

// EVENT LISTENERS
centerCheckbox.addEventListener("change", centerMap);

//center the map when the page loads

// MAP
const map = L.map("ISS-map").setView([51.505, -0.09], 3);

const myIcon = L.icon({
    iconUrl: "graphics/space-station.png",
    iconSize: [80, 80],
    iconAnchor: [40, 40],
});
const marker = L.marker([0, 0], { icon: myIcon }).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// center map when moved or zoomed
map.on("moveend", function (e) {
    centerMap();
});

centerMap();

// API DATA
const api_url = "https://api.wheretheiss.at/v1/satellites/25544";

async function getISSData() {
    if (pauseCheckbox.checked) return;

    response = await fetch(api_url);
    data = await response.json();

    ISS_DATA.altitude = data.altitude;
    ISS_DATA.latitude = data.latitude;
    ISS_DATA.longitude = data.longitude;
    ISS_DATA.velocity = data.velocity;

    marker.setLatLng([ISS_DATA.latitude, ISS_DATA.longitude]);

    centerMap();

    altitudeElement.innerText = ISS_DATA.altitude.toTotallyFixed(7);
    latitudeElement.innerText = ISS_DATA.latitude.toTotallyFixed(7);
    longitudeElement.innerText = ISS_DATA.longitude.toTotallyFixed(7);
    velocityElement.innerText = ISS_DATA.velocity.toTotallyFixed(7);
}

setInterval(getISSData, 1000);

// FUNCTIONS

function centerMap() {
    if (centerCheckbox.checked) {
        // Hide map icon
        marker.setOpacity(0);
        // Center map
        map.setView([ISS_DATA.latitude, ISS_DATA.longitude], map.getZoom());
        // Show HTML icon
        centerIcon.style.display = "inline-block";
    } else {
        // Show map icon
        marker.setOpacity(1);
        // Hide HTML icon
        centerIcon.style.display = "none";
    }
}

Number.prototype.toTotallyFixed = function (n) {
    var s = this.toString(),
        a = (s + (s.indexOf(".") != -1 ? "" : ".0")).split(".");
    return a[0].length > n
        ? s.slice(0, n)
        : a[0] + (+("." + a[1])).toFixed(n - (a[0].length - 1)).slice(1);
};

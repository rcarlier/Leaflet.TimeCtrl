let center = [48.9068, 2.2464];

let map = L.map("map").setView(center, 4);
let layer = L.tileLayer("https://tile.osm.org/{z}/{x}/{y}.png", {
    attribution: `&copy; OpenStreetMap contributors`,
}).addTo(map);

fetch("mass_killing.json")
    .then((response) => response.json())
    .then((data) => {
        showData(data);
    });

let circleData = [];

function showData(data) {
    L.timeCtrl(data, {
        text: {
            title: "Mass Killing in America",
            exact: "By Year",
            inter: "For the period",
        },
        circle: {
            mini: 3,
            maxi: 7,
            color: "#000",
            opacity: 0.5,
            fillColor: "#FF0000",
            fillOpacity: 0.5,
            weight: 0.5,
        },
        data: {
            year: "year", // name of year field
            lat: "latitude", // name of lat field
            lng: "longitude", // name of lng field
            value: "killed", // name of value field
        },
    });
}

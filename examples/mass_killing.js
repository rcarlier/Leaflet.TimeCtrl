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
            position: "topright",
            title: "Mass shootings in the<br>United States",
            legend: "The size of the circles is proportional to the number of victims killed. From 2006 (janv) to 2024 (sept).",
            exact: "By Year",
            inter: "For the period",
            rows: "Incidents",
            value: "Deaths",
        },
        circle: {
            mini: 3,
            maxi: 10,
            color: "#000",
            opacity: 0.5,
            weight: 0.5,
            fillColor: "#FF0000",
            fillOpacity: 0.5,
            popup: true,
        },
        data: {
            year: "year",
            lat: "latitude",
            lng: "longitude",
            value: "killed",
        },
    }).addTo(map);
}

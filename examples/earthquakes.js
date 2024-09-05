let center = [48.9068, 2.2464];

let map = L.map("map").setView(center, 4);
let layer = L.tileLayer("https://tile.osm.org/{z}/{x}/{y}.png", {
    attribution: `&copy; OpenStreetMap contributors`,
}).addTo(map);

fetch("earthquakes.json")
    .then((response) => response.json())
    .then((data) => {
        showData(data);
    });

let circleData = [];

function showData(data) {
    L.timeCtrl(data, {
        text: {
            title: "Tremblements de terre<br>au Japon",
            exact: "1 année",
            inter: "Intervalle",
        },
        circle: {
            mini: 0.5,
            maxi: 4,
            color: "#000",
            opacity: 1,
            weight: 0.5,
            fillColor: "#00F0F0",
            fillOpacity: 0.25,
        },
        data: {
            lat: "lat", // name of lat field
            lng: "lng", // name of lng field
            value: "mag", // name of value field
        },
    });
}

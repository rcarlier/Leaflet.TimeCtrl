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

function showData(data) {
    //  // Some tests...
    // data = [
    //     {
    //         lat: 25.967,
    //         lng: 143.332,
    //         year: 1905,
    //     },
    //     {
    //         lat: 33.715,
    //         lng: 131.759,
    //         year: 1905,
    //     },
    // ];
    L.timeCtrl(data).addTo(map);
}

L.TimeCtrl = L.LayerGroup.extend({
    initialize: function (data, options) {
        this.defaultOptions = {
            text: {
                position: "bottomleft",
                title: null,
                legend: null,
                exact: "One year",
                inter: "Beetween",
                rows: null,
                value: null,
            },
            circle: {
                mini: 6,
                maxi: 6,
                color: "#FF0000",
                opacity: 0.5,
                weight: 0.5,
                fillColor: "#FF0000",
                fillOpacity: 0.5,
                popup: true,
            },
            data: {
                year: "year",
                lat: "lat",
                lng: "lng",
                value: "value",
            },
        };
        this._opt = L.Util.extend({}, this.defaultOptions, options);
        this._validateOptions();
        this.bounds = null;
        this.yearSliderMini = null;
        this.yearSliderMaxi = null;
        this.timeControl = null;
        this.minYear = Infinity;
        this.maxYear = -Infinity;
        this.count = 0;

        this.data = data;

        this._opt.data.mini = Infinity;
        this._opt.data.maxi = -Infinity;

        this.data.forEach((data) => {
            // @todo : validate data
            this.minYear = Math.min(this.minYear, data[this._opt.data.year]);
            this.maxYear = Math.max(this.maxYear, data[this._opt.data.year]);

            this._opt.data.mini = Math.min(this._opt.data.mini, data[this._opt.data.value]);
            this._opt.data.maxi = Math.max(this._opt.data.mini, data[this._opt.data.value]);
        });

        this.data.sort((a, b) => {
            return b[this._opt.data.value] - a[this._opt.data.value];
        });

        this.circleData = [];
    },

    onAdd: function (map) {
        this._map = map;
        this._createControl();
        this._createCircles();
        this._updateCircles();
        L.LayerGroup.prototype.onAdd.call(this, map);
    },

    _validateType: function (parentAttr, attr, type) {
        if (!this._opt[parentAttr]) {
            this._opt[parentAttr] = null;
        }
        if (!(attr in this._opt[parentAttr])) {
            this._opt[parentAttr][attr] = null;
        }
        if (typeof this._opt[parentAttr][attr] !== type) {
            console.warn(
                `${parentAttr}.${attr} option needs to be a ${type} ; default value applyed.`
            );
            this._opt[parentAttr][attr] = this.defaultOptions[parentAttr][attr];
        }
    },

    _validateOptions: function () {
        this._validateType("text", "position", "string"); // @todo: verify "good" values
        this._validateType("text", "title", "string");
        this._validateType("text", "legend", "string");
        this._validateType("text", "exact", "string");
        this._validateType("text", "inter", "string");
        this._validateType("text", "rows", "string");
        this._validateType("text", "value", "string");

        this._validateType("circle", "mini", "number");
        this._validateType("circle", "maxi", "number");
        this._validateType("circle", "color", "string");
        this._validateType("circle", "opacity", "number");
        this._validateType("circle", "weight", "number");
        this._validateType("circle", "fillColor", "string");
        this._validateType("circle", "fillOpacity", "number");
        this._validateType("circle", "popup", "boolean");
        // names of fields
        this._validateType("data", "year", "string");
        this._validateType("data", "lat", "string");
        this._validateType("data", "lng", "string");
        this._validateType("data", "value", "string");
        this._validateType("data", "value", "string");
    },

    _createCircles: function () {
        this.bounds = L.latLngBounds();
        this.data.forEach((data) => {
            let radius = 0;
            if (this._opt.data.mini != this._opt.data.max) {
                const normalizedValue =
                    (data[this._opt.data.value] - this._opt.data.mini) /
                    (this._opt.data.maxi - this._opt.data.mini);
                radius =
                    this._opt.circle.mini +
                    (this._opt.circle.maxi - this._opt.circle.mini) * normalizedValue;
                radius = Math.max(this._opt.circle.mini, Math.min(this._opt.circle.maxi, radius));
            } else {
                radius = this._opt.circle.mini;
            }

            let circle = L.circleMarker([data[this._opt.data.lat], data[this._opt.data.lng]], {
                color: this._opt.circle.color,
                opacity: this._opt.circle.opacity,
                fillColor: this._opt.circle.fillColor,
                fillOpacity: this._opt.circle.fillOpacity,
                weight: this._opt.circle.weight,
                radius: radius,
                interactive: this._opt.circle.popup,
            });

            if (this._opt.circle.popup) {
                let popupContent = "";
                for (let key in data) {
                    popupContent += `<div class="timeCtrlPopup"><b>${key}</b>: ${data[key]}</div>`;
                }
                circle.bindPopup(popupContent);
            }
            this.circleData.push({
                circle: circle,
                data: data,
            });
            this.bounds.extend(circle.getLatLng());
        });
        map.fitBounds(this.bounds);
    },

    _createControl: function () {
        this.timeControl = L.control({ position: this._opt.text.position });
        this.timeControl.onAdd = () => {
            let div = L.DomUtil.create("div", "timeCtrl");

            let titleDiv = L.DomUtil.create("div");
            titleDiv.innerHTML = ``;
            if (this._opt.text.title != null)
                titleDiv.innerHTML += `<div class="timeCtrlTitle">${this._opt.text.title}</div>`;

            if (this._opt.text.legend != null)
                titleDiv.innerHTML += `<div class="timeCtrlLegend">${this._opt.text.legend}</div>`;

            titleDiv.innerHTML += `
                <div id="rowsLabel" class="timeCtrlRows"></div>
                <div id="valueLabel" class="timeCtrlValue"></div>
            `;

            div.appendChild(titleDiv);
            let divMini = L.DomUtil.create("div");
            divMini.innerHTML = `
            <div id="yearMini" class="timeCtrlYearSlider">
                <input 
                    id="yearSliderMini"
                    type="range"
                    min="${this.minYear}"
                    max="${this.maxYear}"
                    step="1"
                    value="${this.minYear}"
                    class="timeCtrlSlider"
                />
                <output id="yearOutputMini" class="timeCtrlOutput">0000</output>
            </div>
            `;
            this.yearSliderMini = divMini.querySelector("#yearSliderMini");
            div.appendChild(divMini);

            let divMaxi = L.DomUtil.create("div");
            divMaxi.innerHTML += `
            <div id="yearMaxi" class="timeCtrlYearSlider">
                <input 
                    id="yearSliderMaxi"
                    type="range"
                    min="${this.minYear}"
                    max="${this.maxYear}"
                    step="1"
                    value="${this.maxYear}"
                    class="timeCtrlSlider"
                />
                <output id="yearOutputMaxi">0000</output>
            </div>
            `;
            this.yearSliderMaxi = divMaxi.querySelector("#yearSliderMaxi");
            div.appendChild(divMaxi);

            let radios = L.DomUtil.create("div");
            radios.innerHTML = `
                <div class="timeCtrlRadio">
                    <label>
                    <input type="radio" id="timeCtrlViewE" name="timeCtrlView" value="exact"  />
                    ${this._opt.text.exact}
                    </label>
                    <label>
                    <input type="radio" id="timeCtrlViewC" name="timeCtrlView" value="intervale" checked />
                    ${this._opt.text.inter}
                    </label>
                </div>
                `;
            div.appendChild(radios);

            let viewE = div.querySelector("#timeCtrlViewE");
            viewE.addEventListener("click", (event) => {
                this._updateCircles();
            });
            let viewC = div.querySelector("#timeCtrlViewC");
            viewC.addEventListener("click", (event) => {
                this._updateCircles();
            });

            function stopPropagation(e) {
                e.stopPropagation();
            }
            div.addEventListener("mousedown", stopPropagation);
            div.addEventListener("click", stopPropagation);
            div.addEventListener("dblclick", stopPropagation);

            this.yearSliderMini.addEventListener("input", (event) => {
                this._updateCircles();
            });
            this.yearSliderMaxi.addEventListener("input", (event) => {
                this._updateCircles();
            });

            return div;
        };

        if (this._map) {
            this.timeControl.addTo(this._map);
        } else {
            console.warn("La carte Leaflet (_map) n'est pas définie.");
        }
    },

    _updateUi: function () {
        document.querySelector("#yearOutputMini").innerText = this.yearSliderMini.value;
        document.querySelector("#yearOutputMaxi").innerText = this.yearSliderMaxi.value;

        if (this._opt.text.rows === null) {
            document.querySelector("#rowsLabel").style.display = "none";
        } else {
            document.querySelector(
                "#rowsLabel"
            ).innerHTML = `${this._opt.text.rows}: <b>${this.count}</b>`;
        }

        if (this._opt.text.value === null) {
            document.querySelector("#valueLabel").style.display = "none";
        } else {
            document.querySelector(
                "#valueLabel"
            ).innerHTML = `${this._opt.text.value}: <b>${this.total}</b>`;
        }

        let opt = document.querySelector('input[name="timeCtrlView"]:checked');
        if (opt.value == "exact") {
            document.querySelector("#yearMaxi").style.display = "none";
        } else {
            document.querySelector("#yearMaxi").style.display = "grid";
        }
    },

    _updateCircles: function () {
        let option = document.querySelector('input[name="timeCtrlView"]:checked').value;

        this.count = 0;
        this.total = 0;
        this.circleData.forEach((value) => {
            // console.log(value);
            let circle = value.circle;
            let data = value.data;

            if (option === "exact") {
                if (data[this._opt.data.year] == this.yearSliderMini.value) {
                    this.count++;
                    this.total += data[this._opt.data.value];
                    map.addLayer(circle);
                } else {
                    map.removeLayer(circle);
                }
            } else {
                if (
                    data[this._opt.data.year] >= this.yearSliderMini.value &&
                    data[this._opt.data.year] <= this.yearSliderMaxi.value
                ) {
                    this.count++;
                    this.total += data[this._opt.data.value];

                    map.addLayer(circle);
                } else {
                    map.removeLayer(circle);
                }
            }
        });
        this._updateUi();
    },
});

L.timeCtrl = function (data, options = {}) {
    return new L.TimeCtrl(data, options);
};

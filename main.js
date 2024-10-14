import { crimesData } from "./data.js";

const mapa = document.querySelector("#map");
mapa.style.position = "relative";
console.log(mapa);

function getLocations(data) {
  const features = data.features;
  const values = [];
  const locations = [];
  features.forEach((comuna) => {
    if (comuna.properties.Provincia === "Santiago") {
      values.push(parseInt(crimesData[comuna.properties.Comuna]["2023"]));
      locations.push(comuna.properties.Comuna);
    }
  });

  return { mapLocations: locations, mapValues: values };
}

fetch("./output_filtered.json")
  .then((Response) => Response.json())
  .then((mapData) => {
    // or whatever you wanna do with the data
    console.log(mapData);
    const { mapLocations, mapValues } = getLocations(mapData);
    // console.log(mapLocations.length);

    const labelCoord = [];
    mapData.features.forEach((comuna) => {
      if (comuna.properties.Provincia === "Santiago") {
        let minY;
        let maxY;
        let minX;
        let maxX;
        comuna.geometry.coordinates[0].forEach((coord) => {
          if (!minY || minY > coord[1]) minY = coord[1];
          if (!maxY || maxY < coord[1]) maxY = coord[1];
          if (!minX || minX > coord[0]) minX = coord[0];
          if (!maxX || maxX < coord[0]) maxX = coord[0];
        });
        // console.log(`MinYMaxY de : ${comuna.properties.Comuna}`, minY, maxY);
        // console.log(`MinXMaxX de : ${comuna.properties.Comuna}`, minX, maxX);
        const middleTop = maxY + (minY - maxY) / 2;
        const middleLeft = maxX + (minX - maxX) / 2;
        labelCoord.push([comuna.properties.Comuna, middleLeft, middleTop]);
      }
    });
    console.log(labelCoord);
    var data = [
      {
        type: "choroplethmap",
        name: "Chile",
        geojson: mapData,
        locations: mapLocations, // Region codes (match GeoJSON properties)
        z: mapValues,
        featureidkey: "properties.Comuna",
        zmin: Math.min(...mapValues),
        zmax: Math.max(...mapValues),
        autocolorscale: false,
        colorscale: [
          [0, "#73D055FF"],
          [0.2, "#49B370FF"],
          [0.4, "#1F968BFF"],
          [0.6, "#39568CFF"],
          [0.8, "#3F2C70FF"],
          [1, "#440154FF"],
        ],
        colorbar: {
          y: 0,
          yanchor: "bottom",
          title: {
            text: "Denuncias/100 mil habitantes",
            side: "right",
          },
        },
      },
    ];

    var layout = {
      map: {
        style: "dark",
        center: { lon: -70.57, lat: -33.39 },
        zoom: 9,
      },
      marker: { line: { color: "blue" } },
      xaxis: { fixedrange: true },
      yaxis: { fixedrange: true },
      width: 800,
      height: 500,
      margin: { t: 0, b: 0, l: 0, r: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    Plotly.newPlot(mapa, data, layout, {
      scrollZoom: false,
      displayModeBar: false,
      // staticPlot: true,
    });

    function ftop(x) {
      return `${(250 / -0.28642362708) * (x + 33.1035763729) + 10}px`;
    }

    function fleft(x) {
      return `${(400 / 0.5055506629) * (x + 71.0755506629) - 55}px`;
    }

    labelCoord.forEach((comuna) => {
      const label = document.createElement("div");
      switch (comuna[0]) {
        case "La Cisterna":
          label.textContent = 1;
          label.style.position = "absolute";
          label.style.top = ftop(comuna[2]);
          label.style.left = fleft(comuna[1]);
          console.log(fleft(comuna[1]));
          mapa.appendChild(label);
          break;
        case "Quinta Normal":
          label.textContent = 2;
          label.style.position = "absolute";
          label.style.top = ftop(comuna[2]);
          label.style.left = fleft(comuna[1]);
          console.log(fleft(comuna[1]));
          mapa.appendChild(label);
          break;
        case "Cerrillos":
          label.textContent = 3;
          label.style.position = "absolute";
          label.style.top = ftop(comuna[2]);
          label.style.left = fleft(comuna[1]);
          console.log(fleft(comuna[1]));
          mapa.appendChild(label);
          break;
        case "San Miguel":
          label.textContent = 4;
          label.style.position = "absolute";
          label.style.top = ftop(comuna[2]);
          label.style.left = fleft(comuna[1]);
          console.log(fleft(comuna[1]));
          mapa.appendChild(label);
          break;
        case "Vitacura":
          label.textContent = 5;
          label.style.position = "absolute";
          label.style.top = ftop(comuna[2]);
          label.style.left = fleft(comuna[1]);
          console.log(fleft(comuna[1]));
          mapa.appendChild(label);
          break;

        default:
          break;
      }
    });
  });

import { crimesData } from "./data.js";

const mapa = document.querySelector("#map");
console.log(mapa);

function getLocations(data) {
  const features = data.features;
  const values = [];
  const locations = [];
  features.forEach((comuna) => {
    if (comuna.properties.Provincia === "Santiago") {
      console.log(
        comuna.properties.Comuna,
        ":",
        crimesData[comuna.properties.Comuna]["2023"]
      );
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
    console.log(mapLocations.length);
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
        colorbar: {
          
          // orientación barra
          orientation: "h",
          y: 0,
          //El lugar donde se alinea el siguiente objeto
          yanchor: "top",
          // cambiar color de etiquetas
          tickfont: {
            color: "white",
          },
          title: {
            text: "N° de denuncias cada 100 mil habitantes",
            side: "top",
            // cambiar color de título
            font: {
              color: "white",
            },
            
          },
        },
      },
    ];

    var layout = {
      map: {
        style: "dark",
        center: { lon: -70.57, lat: -33.4 },
        zoom: 9,
      },
      xaxis: { fixedrange: true },
      yaxis: { fixedrange: true },
      showLegend: true,
      width: 800,
      height: 500,
      margin: { t: 0, b: 0, l: 0, r: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    Plotly.newPlot(mapa, data, layout, {
      scrollZoom: false,
      displayModeBar: false,
      staticPlot: true,
    });
  });

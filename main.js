import { crimesData } from "./data.js";

const mapa = document.querySelector("#map");
mapa.style.position = "relative";
console.log(mapa);

// Parámetros para el sonido
const hoversound = new Audio("audio.mp3");

const year_slider = document.getElementById("year_slider");
const year_value = document.getElementById("year_value");

const media_comunas = {
  2015: 263.2,
  2016: 232.1,
  2017: 235.0,
  2018: 189.9,
  2019: 181.7,
  2020: 166.5,
  2021: 196.5,
  2022: 238.9,
  2023: 184.6,
  2024: 193.0,
  
};


function getLocations(data, year) {
  const features = data.features;
  const values = [];
  const locations = [];
  features.forEach((comuna) => {
    if (comuna.properties.Provincia === "Santiago") {
      values.push(parseInt(crimesData[comuna.properties.Comuna][year]));
      locations.push(comuna.properties.Comuna);
    }
  });

  return { mapLocations: locations, mapValues: values };
}
function updateMap(year) {
fetch("./output_filtered.json")
  .then((Response) => Response.json())
  .then((mapData) => {
    // or whatever you wanna do with the data
    console.log(mapData);
    const { mapLocations, mapValues } = getLocations(mapData, year);
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

    function calculateVolume(x) {
      return 1 - (650 - x) / 650; 
    }

    function calculate_rate(x) {
      if (x >= 0 && x <= 100 ){ 
        return 1;
      }
      else if (x > 100 && x <= 200) {
        return 1.4;
      }
      else if (x > 200 && x <= 300) {
        return 1.8;
      }
      else if (x > 300 && x <= 400) {
        return 2.2;
      }
      else if (x > 400 && x <= 500) {
        return 2.6;
      }
      else {
        return 3;
    }}
    function calculate_percent(x) {
      //si es mayor o igual a la media
      if (x >= media_comunas[year]) {
        return (((x - media_comunas[year]) / media_comunas[year]) * 100)+100;
      }

      //si es menor a la media
      else {
        return -(((media_comunas[year] - x) / media_comunas[year] ) * 100);
  
    }};


    Plotly.newPlot(mapa, data, layout, {
      scrollZoom: true,
      displayModeBar: false,
      staticPlot: false,
    }).then((gd) => {gd.on("plotly_hover", function (data) {
      var infotext = data.points.map(function (d) {
        return 'Comuna: ' + d.location + '<br>Denuncias: ' + d.z + '<br>Media anual :' + media_comunas[year]  + '<br>% Según media anual: ' +  calculate_percent(d.z).toFixed(2);
      
      });
      var update = { 
        hovertemplate: infotext + '<extra></extra>'
      };
      Plotly.restyle(gd, update);
      //quiero un código que haga que el sonido aumente su frecuencia 

      hoversound.loop = false;
      hoversound.playbackRate = calculate_rate(data.points[0].z);

      
      hoversound.volume = calculateVolume(data.points[0].z); 
      hoversound.play();
      console.log(infotext);
    })
    gd.on("plotly_unhover", function (data) {
      var update = { 
        hovertemplate: null
      };
      Plotly.restyle(gd, update); 
      hoversound.pause();
      hoversound.currentTime = 0;
      
    });
  });

    function ftop(x) {
      return `${(250 / -0.28642362708) * (x + 33.1035763729) - 55}px`;
    }

    function fleft(x) {
      return `${(400 / 0.5055506629) * (x + 71.0755506629) + 1}px`;
    }


  });
}
updateMap(year_slider.value);

// Escuchar los cambios del deslizador
year_slider.addEventListener("input", function () {
  if (year_slider.value == 2024) {
    year_value.innerHTML = "Media 2018 - 2024"; // Actualizar el valor del año
  }else {
  year_value.innerHTML = 'Año '+year_slider.value; // Actualizar el valor del año
  }
  

  updateMap(year_slider.value); // Llamar a la función de actualización del mapa
});

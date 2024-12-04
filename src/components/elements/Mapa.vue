<template>
  <div class="map-container">
    <!-- Botón para restaurar controles minimizados -->
    <button v-if="isMinimized" @click="toggleMinimize"
      class="restore-btn p-2 bg-blue-600 text-white rounded-lg shadow-lg absolute top-10 left-10 z-20 text-xs sm:text-sm hover:bg-blue-700">
      Mostrar Controles
    </button>

    <!-- Contenedor de controles -->
    <!-- <div v-show="!isMinimized"
      class="controls p-4 bg-white bg-opacity-80 rounded-lg shadow-lg absolute top-10 left-10 z-10 max-w-xs w-full transition-all duration-300 ease-in-out transform">
      <span class="status-text block text-sm font-semibold text-gray-800 mb-3">
        {{ routeStatus }}
      </span>
      <button @click="handleRoute"
        class="btn-primary w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-3 text-xs sm:text-sm">
        {{ buttonText }}
      </button>
      <button @click="toggleMinimize" class="text-xs mt-2 text-blue-500 hover:text-blue-700 focus:outline-none">
        Minimizar Controles
      </button>
    </div> -->

    <!-- Contenedor del mapa -->
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      map: null,
      currentLocation: null,
      departmentRecollection: { lat: 19.7671, lon: -104.366 },
      departmentCompost: { lat: 19.768, lon: -104.37 },
      markers: [],
      routeStatus: "Iniciar ruta",
      buttonText: "Iniciar",
      currentDestination: null,
      routingControl: null,
      isMinimized: false, // Estado para minimizar controles
    };
  },
  mounted() {
    this.initializeMap();
    this.fetchMarkers();
  },
  methods: {
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
    },
    initializeMap() {
      this.map = L.map("map", { zoomControl: false }).setView(
        [this.departmentRecollection.lat, this.departmentRecollection.lon],
        15
      );
      L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        { attribution: "© OpenStreetMap contributors" }
      ).addTo(this.map);

    },
    async fetchMarkers() {
      try {
        const response = await axios.get(`${apiUrl}/admin/rutas`);
        console.log("rutas", response);
        if (response.data) {
          const addresses = response.data;
          const markers = await Promise.all(
            addresses.map(async (address) => {
              const formattedAddress = encodeURIComponent(address.direccion_completa);
              console.log(formattedAddress);
              const { data } = await axios.get(
                `https://api.tomtom.com/search/2/geocode/${formattedAddress}.json?key=WZA1UULbGoN1NPp9h98dOWWespM2uCOD`
              );
              const results = data.results;

              if (!results || results.length === 0) return null;

              const { lat, lon } = results[0].position;
              return { lat, lon, ...address };  // Include the full address data
            })
          );

          this.markers = markers.filter(Boolean);
          this.startRouting();
          this.addMarkersToMap(); // Call the method to add markers to the map
        }
      } catch (error) {
        console.error("Error al obtener los marcadores:", error);
      }
    },
    async handleRoute() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          this.startRouting();
        },
        () => {
          alert(
            "No se pudo acceder a tu ubicación. Usando el departamento de recolección como inicio."
          );
          this.currentLocation = this.departmentRecollection;
          this.startRouting();
        }
      );
    },
    startRouting() {
      if (this.markers.length > 0) {
        // Set the initial location to the departmentRecollection if no currentLocation
        if (!this.currentLocation) {
          this.currentLocation = this.departmentRecollection;
        }

        this.currentDestination = this.getClosestMarker();
        this.routeStatus = `Siguiente destino: ${this.currentDestination.direccion_completa}`;
        this.buttonText = "Siguiente destino";
        // this.speak(this.routeStatus); // Texto a voz
        this.drawRoute();
      }
    },
    drawRoute() {
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);  // Remove any existing routing controls
        this.routingControl = null;
      }
      const routeColors = [
        "#ff6347", // Tomato
        "#1e90ff", // DodgerBlue
        "#32cd32", // LimeGreen
        "#ff4500", // OrangeRed
        "#9400d3", // DarkViolet
        "#ff1493", // DeepPink
        "#00fa9a", // MediumSpringGreen
      ];

      // Loop through all markers and draw routes
      const waypoints = this.markers.map(marker => {
        return L.latLng(this.currentLocation.lat, this.currentLocation.lon); // Add starting location as a waypoint
      });

      // Add all markers to the waypoints
      waypoints.push(
        ...this.markers.map(marker => L.latLng(marker.lat, marker.lon))  // Add each marker's position to the route
      );



      // this.routingControl = L.Routing.control({
      //   waypoints: waypoints,
      //   routeWhileDragging: false,
      //   alternatives: false,
      //   collapsible: true,
      //   lineOptions: { styles: [{ color: "#1e90ff", weight: 6 }] },
      //   language: "es", // Spanish language
      //   createMarker: (i, waypoint, n) => {
      //     const iconClass = i === 0 ? "pi-map-marker" : i === n - 1 ? "pi-flag" : "pi-map";
      //     const color = i === 0 ? "#007bff" : i === n - 1 ? "#28a745" : "#ffc107";
      //     return L.marker(waypoint.latLng, {
      //       icon: L.divIcon({
      //         html: `<i class="pi ${iconClass}" style="color: ${color}; font-size: 24px;"></i>`,
      //         className: "prime-icon-marker",
      //         iconSize: [24, 24],
      //         iconAnchor: [12, 24],
      //       }),
      //     });
      //   },
      // }).addTo(this.map);

      this.markers.forEach(marker => {
        L.circleMarker([marker.lat, marker.lon], {
          color: "#007bff", // Tomato color
          radius: 8, // Radius for the dot
          weight: 2,
          fillOpacity: 0.7,
        }).addTo(this.map);
      });

      // this.routingControl.on("routesfound", () => {
      //   const container = document.querySelector(".leaflet-routing-container");
      //   if (container) {
      //     container.style.width = "340px";
      //     container.style.maxWidth = "340px";
      //     container.style.height = "auto";
      //     container.style.overflowY = "hidden";
      //     container.style.padding = "10px";
      //     container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      //     container.style.borderRadius = "10px";
      //     container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      //     container.style.color = "#333";
      //     container.style.position = "absolute";
      //     container.style.top = "10px";
      //     container.style.right = "10px";
      //     container.style.zIndex = "1000";
      //     container.style.display = "none";
      //   }
      // });
    }
    ,addMarkersToMap() {
  this.markers.forEach(marker => {
    const { lat, lon, n_completo, direccion_completa, sol_tipo } = marker;

    const popupContent = `
      <div>
        <h4><strong>Ciudadano: </strong>${n_completo}</h4>
        <p><strong>Dirección:</strong> ${direccion_completa}</p>
        <p><strong>Tipo de Solicitud:</strong> ${sol_tipo}</p>
      </div>
    `;

    const leafletMarker = L.circleMarker([lat, lon], {
      color: "#007bff",  // Style the marker
      radius: 8,         // Adjust size of the marker
      weight: 2,
      fillOpacity: 0.7,
    }).addTo(this.map);

    // Bind a popup to the marker
    leafletMarker.bindPopup(popupContent);

    // Optional: Open the popup immediately when the marker is added
    // leafletMarker.openPopup();
  });
},
    getClosestMarker() {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert latitude difference to radians
        const dLon = ((lon2 - lon1) * Math.PI) / 180; // Convert longitude difference to radians
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calculate the angular distance
        return R * c; // Distance in kilometers
      };

      let closest = null;
      let minDistance = Infinity;

      // Use departmentRecollection instead of currentLocation for calculating distance
      const baseLat = this.departmentRecollection.lat;
      const baseLon = this.departmentRecollection.lon;

      this.markers.forEach((marker) => {
        const distance = calculateDistance(baseLat, baseLon, marker.lat, marker.lon);
        if (distance < minDistance) {
          closest = marker;
          minDistance = distance;
        }
      });

      return closest;
    }
    ,
    // speak(text) {
    //   const utterance = new SpeechSynthesisUtterance(text);
    //   utterance.lang = "es-MX";
    //   speechSynthesis.speak(utterance);
    // },
  },
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.map {
  width: 100%;
  height: 50vh;
}

.controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.restore-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>
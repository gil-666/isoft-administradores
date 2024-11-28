<template>
    <div class="map-container">
      <!-- Botón para restaurar controles minimizados -->
      <button
        v-if="isMinimized"
        @click="toggleMinimize"
        class="restore-btn p-2 bg-blue-600 text-white rounded-lg shadow-lg absolute top-10 left-10 z-20 text-xs sm:text-sm hover:bg-blue-700"
      >
        Mostrar Controles
      </button>
  
      <!-- Contenedor de controles -->
      <div
        v-show="!isMinimized"
        class="controls p-4 bg-white bg-opacity-80 rounded-lg shadow-lg absolute top-10 left-10 z-10 max-w-xs w-full transition-all duration-300 ease-in-out transform"
      >
        <span
          class="status-text block text-sm font-semibold text-gray-800 mb-3"
        >
          {{ routeStatus }}
        </span>
        <button
          @click="handleRoute"
          class="btn-primary w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-3 text-xs sm:text-sm"
        >
          {{ buttonText }}
        </button>
        <button
          @click="toggleMinimize"
          class="text-xs mt-2 text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          Minimizar Controles
        </button>
      </div>
  
      <!-- Contenedor del mapa -->
      <div id="map" class="map"></div>
    </div>
  </template>
  
  <script>
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import "leaflet-routing-machine";
  import axios from "axios";
  
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
  
        this.fetchMarkers();
      },
      async fetchMarkers() {
        try {
          const response = await axios.get("http://192.168.1.15:3000/api/maps");
          if (response.data.success && response.data.data) {
            const addresses = response.data.data;
            const markers = await Promise.all(
              addresses.map(async (address) => {
                const formattedAddress = encodeURIComponent(address.domicilio);
                const { data } = await axios.get(
                  `https://api.tomtom.com/search/2/geocode/${formattedAddress}.json?key=WZA1UULbGoN1NPp9h98dOWWespM2uCOD`
                );
                const results = data.results;
  
                if (!results || results.length === 0) return null;
  
                const { lat, lon } = results[0].position;
                return { lat, lon, domicilio: address.domicilio };
              })
            );
  
            this.markers = markers.filter(Boolean);
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
        //---------------------------------------------------------------------------------------------------------------
        if (this.buttonText === "Iniciar") {
          
        }
        //---------------------------------------------------------------------------------------------------------------
        if (!this.currentDestination && this.markers.length > 0) {
          this.currentDestination = this.getClosestMarker();
          this.routeStatus = `Siguiente destino: ${this.currentDestination.domicilio}`;
          this.buttonText = "Siguiente destino";
          this.speak(this.routeStatus); // Texto a voz
          this.drawRoute();
        } else if (this.currentDestination && this.markers.length > 0) {
          this.markers = this.markers.filter(
            (marker) => marker !== this.currentDestination
          );
          this.currentLocation = {
            lat: this.currentDestination.lat,
            lon: this.currentDestination.lon,
          };
  
          if (this.markers.length === 0) {
            this.currentDestination = this.departmentCompost;
            this.routeStatus = "Dirigiéndose al centro de composta";
            this.buttonText = "Finalizar ruta";
          } else {
            this.currentDestination = this.getClosestMarker();
            this.routeStatus = `Siguiente destino: ${this.currentDestination.domicilio}`;
            this.buttonText = "Siguiente destino";
          }
        //   ------------------------------------------------------------------------------------------------
          this.speak(this.routeStatus); // Texto a voz
          this.drawRoute();
        //   ------------------------------------------------------------------------------------------------
        //   Ruta finalizar
        } else if (this.buttonText === "Finalizar ruta") {
          alert("¡Ruta completada!");
          this.routeStatus = "Ruta finalizada";
          this.speak(this.routeStatus); // Texto a voz
          this.currentDestination = null;
          this.buttonText = "Buen Trabajo";
        }
      },
      drawRoute() {
        if (this.routingControl) {
          this.routingControl.getPlan().setWaypoints([]);
          this.map.removeControl(this.routingControl);
          this.routingControl = null;
        }
  
        const waypoints = [
          L.latLng(this.currentLocation.lat, this.currentLocation.lon),
          L.latLng(this.currentDestination.lat, this.currentDestination.lon),
        ];
  
        this.routingControl = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          alternatives: false,
          collapsible: true,
          lineOptions: { styles: [{ color: "#1e90ff", weight: 6 }] },
          language: "es", // Idioma en español
          createMarker: (i, waypoint, n) => {
            const iconClass =
              i === 0 ? "pi-map-marker" : i === n - 1 ? "pi-flag" : "pi-map";
            const color =
              i === 0 ? "#007bff" : i === n - 1 ? "#28a745" : "#ffc107";
            return L.marker(waypoint.latLng, {
              icon: L.divIcon({
                html: `<i class="pi ${iconClass}" style="color: ${color}; font-size: 24px;"></i>`,
                className: "prime-icon-marker",
                iconSize: [24, 24],
                iconAnchor: [12, 24],
              }),
            });
          },
        }).addTo(this.map);
  
        this.routingControl.on("routesfound", () => {
          const container = document.querySelector(".leaflet-routing-container");
          if (container) {
            container.style.width = "340px";
            container.style.maxWidth = "340px";
            container.style.height = "auto";
            container.style.overflowY = "hidden";
            container.style.padding = "10px";
            container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            container.style.borderRadius = "10px";
            container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            container.style.color = "#333";
            container.style.position = "absolute";
            container.style.top = "10px";
            container.style.right = "10px";
            container.style.zIndex = "1000";
          }
        });
      },
      getClosestMarker() {
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };
  
        let closest = null;
        let minDistance = Infinity;
  
        this.markers.forEach((marker) => {
          const distance = calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lon,
            marker.lat,
            marker.lon
          );
          if (distance < minDistance) {
            closest = marker;
            minDistance = distance;
          }
        });
  
        return closest;
      },
      speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-MX";
        speechSynthesis.speak(utterance);
      },
    },
  };
  </script>
  
  <style scoped>
  @tailwind base;
@tailwind components;
@tailwind utilities;
  .map {
    width: 100%;
    height: 100vh;
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
  
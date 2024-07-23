import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Set the default icon for Leaflet markers
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = defaultIcon;

const Map = ({ location }) => {
  const hasLocationData = location && location.latitude && location.longitude;
  console.log(location);
  return (
    <div className="relative h-full w-full">
      {hasLocationData ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              <div>
                <p>Location</p>
                <p>Latitude: {location.latitude}</p>
                <p>Longitude: {location.longitude}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-gray-200 rounded-lg">
          <p>No location data available</p>
        </div>
      )}
    </div>
  );
};

export default Map;

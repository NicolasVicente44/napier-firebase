import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Set the default icon for Leaflet markers
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = defaultIcon;

// Utility component to adjust map bounds
const MapBounds = ({ locations }) => {
  const map = useMap();

  React.useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = locations.reduce((bounds, location) => {
        return bounds.extend([location.lat, location.lng]);
      }, L.latLngBounds([locations[0].lat, locations[0].lng]));

      map.fitBounds(bounds);
    }
  }, [locations, map]);

  return null;
};

// Utility function to calculate average location
const calculateAverageLocation = (locations) => {
  if (locations.length === 0) return null;

  const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0);
  const lngSum = locations.reduce((sum, loc) => sum + loc.lng, 0);

  return {
    lat: latSum / locations.length,
    lng: lngSum / locations.length,
  };
};

const AggregateMap = ({ locations }) => {
  const averageLocation = calculateAverageLocation(locations);

  return (
    <MapContainer
      center={averageLocation || [51.505, -0.09]} // Default center
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations && locations.length > 0 && (
        <>
          <MapBounds locations={locations} />
          {locations.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lng]}>
              <Popup>
                <div>
                  <p>Location</p>
                  <p>Latitude: {location.lat}</p>
                  <p>Longitude: {location.lng}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
};

export default AggregateMap;

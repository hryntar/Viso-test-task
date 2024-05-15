import MarkerList from "./MarkerList";
import Map from "./Map";
import { useState } from "react";
import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { IMarker } from "./types";

const App = () => {
   const [markers, setMarkers] = useState<IMarker[]>([]);

   const addMarker = (e: MapLayerMouseEvent) => {
      const newMarker = {
         id: markers.length,
         longitude: e.lngLat.lng,
         latitude: e.lngLat.lat,
      };
      setMarkers([...markers, newMarker]);
   };

   const deleteMarker = (id: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setMarkers(markers.filter((marker) => marker.id !== id));
   };

   const onMarkerDragEnd = (e: MarkerDragEvent, id: number) => {
      setMarkers(markers.map((marker) => (marker.id === id ? { ...marker, longitude: e.lngLat.lng, latitude: e.lngLat.lat } : marker)));
   };

   return (
      <main style={{ display: "flex" }}>
         <div style={{ width: "20%", height: "800px", overflow: "auto" }}>
            <h3>Список точок:</h3>
            <ul>
               {markers.map((marker) => (
                  <li key={marker.id}>
                     Точка {marker.id + 1}: ({marker.latitude.toFixed(2)}, {marker.longitude.toFixed(2)})
                  </li>
               ))}
            </ul>
         </div>
         <div style={{ width: "80%" }}>
            <Map markers={markers} addMarker={addMarker} deleteMarker={deleteMarker} onMarkerDragEnd={onMarkerDragEnd} />
         </div>
      </main>
   );
};

export default App;

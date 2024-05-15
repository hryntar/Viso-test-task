// import MarkerList from "./MarkerList";
import Map from "./Map";
import { useState } from "react";
import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { IMarker } from "./types";
import { db } from "./config/firebase";
import { GeoPoint, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";

const App = () => {
   const [markers, setMarkers] = useState<IMarker[]>([]);

   const addMarker = async (e: MapLayerMouseEvent) => {
      const newMarker = {
        id: markers.length,
        location: new GeoPoint(e.lngLat.lat, e.lngLat.lng),
      };
      setMarkers([...markers, newMarker]);
    
      // Add the new marker to Firestore without a timestamp
      const docRef = await addDoc(collection(db, "quests"), newMarker);
    
      // Update the marker with the server timestamp
      updateDoc(docRef, {
        timestamp: serverTimestamp()
      });
    };

   const deleteMarker = (id: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setMarkers(markers.filter((marker) => marker.id !== id));
   };

   const onMarkerDragEnd = (e: MarkerDragEvent, id: number) => {
      setMarkers(markers.map((marker) => (marker.id === id ? { ...marker, location: new GeoPoint(e.lngLat.lat, e.lngLat.lng) } : marker)));
   };

   return (
      <main style={{ display: "flex" }}>
         <div style={{ width: "20%", height: "800px", overflow: "auto" }}>
            <h3>Список точок:</h3>
            <ul>
               {markers.map((marker) => (
                  <li key={marker.id}>
                     Точка {marker.id + 1}: ({marker.location.latitude}, {marker.location.longitude})
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

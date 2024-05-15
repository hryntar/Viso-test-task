import "./App.css";
import {  useState } from "react";
import Map, { MapLayerMouseEvent, Marker, MarkerDragEvent, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; 

interface IViewState extends ViewState {
   latitude: number;
   longitude: number;
   zoom: number;
 }
 
 interface IMarker {
   id: number;
   longitude: number;
   latitude: number;
 }

function App() {
   const [viewState, setViewState] = useState<Partial<IViewState>>({
      longitude: 24.031111,
      latitude: 49.842957,
      zoom: 14,
   }); 

   

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
     setMarkers(
         markers.map((marker) =>
            marker.id === id
            ? { ...marker, longitude: e.lngLat.lng, latitude: e.lngLat.lat }
            : marker
         )
     );
   };

   return (
      <div style={{ width: "100%" }}>
      <Map
        mapboxAccessToken={ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={addMarker}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            draggable
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onDragEnd={(event) => onMarkerDragEnd(event, marker.id)}
          >
            <div onClick={(e) => deleteMarker(marker.id, e)}>
              <img width={40} src="/marker.svg" />
              <span style={{ position: 'absolute', top: '12%', left: '40%', color: 'white', fontWeight: 'bold' }}>{marker.id + 1}</span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
   );
}

export default App;

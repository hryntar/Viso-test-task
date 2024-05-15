import "./App.css";
import {  useState } from "react"; 
import { MapLayerMouseEvent, Map as MapWrapper, Marker, MarkerDragEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import { IMarker, IViewState } from "./types";

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; 

interface Props {
   markers: IMarker[];
   addMarker: (e: MapLayerMouseEvent) => void;
   deleteMarker: (id: number, event: React.MouseEvent) => void;
   onMarkerDragEnd: (e: MarkerDragEvent, id: number) => void;
}

const Map = ({ markers, addMarker, deleteMarker, onMarkerDragEnd }: Props) => {
   const [viewState, setViewState] = useState<Partial<IViewState>>({
      longitude: 24.031111,
      latitude: 49.842957,
      zoom: 14,
   });

   return (
      <div style={{ width: "100%" }}>
      <MapWrapper
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
      </MapWrapper>
    </div>
   );
}

export default Map;

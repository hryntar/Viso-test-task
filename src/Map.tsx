import "./App.css";
import {  useState } from "react"; 
import { MapLayerMouseEvent, Map as MapWrapper, MarkerDragEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import { IMarker, IViewState } from "./types";
import MapMarker from "./MapMarker";

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; 

interface Props {
   markers: IMarker[] | undefined;
   addMarker: (e: MapLayerMouseEvent) => void;
   deleteMarker: (id: number, event: React.MouseEvent) => void;
   onMarkerDragEnd: (e: MarkerDragEvent, questId: number) => void;
}

const Map = ({ markers, addMarker, deleteMarker, onMarkerDragEnd }: Props) => {
   const [viewState, setViewState] = useState<Partial<IViewState>>({
      longitude: 24.031111,
      latitude: 49.842957,
      zoom: 14,
   });

   return (
      <div className="map">
      <MapWrapper
        mapboxAccessToken={ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={addMarker}
      >
        {markers?.map((marker) => (
          <MapMarker key={marker.id} marker={marker} deleteMarker={deleteMarker} onMarkerDragEnd={onMarkerDragEnd} />
        ))}
      </MapWrapper>
    </div>
   );
}

export default Map;

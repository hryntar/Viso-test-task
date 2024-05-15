import { Marker, MarkerDragEvent } from "react-map-gl";
import { IMarker } from "../types";

interface MapMarkerProps {
   marker: IMarker;
   deleteMarker: (id: string, event: React.MouseEvent) => void;
   onMarkerDragEnd: (e: MarkerDragEvent, questId: string) => void;
}

const MapMarker = ({ marker, deleteMarker, onMarkerDragEnd }: MapMarkerProps) => {
   return (
      <Marker
         key={marker.id}
         draggable
         longitude={marker.location.longitude}
         latitude={marker.location.latitude}
         anchor="bottom"
         onDragEnd={(event) => onMarkerDragEnd(event, marker.id)}
      >
         <div className="marker-container" onClick={(e) => deleteMarker(marker.id, e)}>
            <img width={40} src="/marker.svg" />
            <span style={{ position: 'absolute', top: '12%', left: '40%', color: 'white', fontWeight: 'bold' }}>{marker.number}</span>
            <div className="delete-marker">❌</div>
         </div>
      </Marker>
   );
};

export default MapMarker;
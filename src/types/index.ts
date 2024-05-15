// import { GeoPoint } from "firebase/firestore";
import { ViewState } from "react-map-gl";

export interface IViewState extends ViewState {
   latitude: number;
   longitude: number;
   zoom: number;
}

export interface IMarker {
   id: number;
   location: {
      latitude: number;
      longitude: number;
   };
}

export interface IQuest {
   id: number;
   name: string;
   markers: IMarker[];
}
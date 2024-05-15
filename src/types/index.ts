import { GeoPoint } from "firebase/firestore";
import { ViewState } from "react-map-gl";

export interface IViewState extends ViewState {
   latitude: number;
   longitude: number;
   zoom: number;
}

export interface IMarker {
   id: string;
   number: number;
   location: GeoPoint;
   timestamp: Date;
}

export interface IQuest {
   id: string;
   name: string;
   markers: IMarker[];
}
import MarkerList from "./MarkerList";
import Map from "./Map";
import { useState } from "react";
import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { GeoPoint } from "firebase/firestore";
import { IMarker, IQuest } from "./types";

const App = () => {
   const [quests, setQuests] = useState<IQuest[]>([
      {
         id: 0,
         name: "Quest 1",
         markers: [
            { id: 0, location: { latitude: 49.842957, longitude: 24.031111 } },
            { id: 1, location: { latitude: 49.843257, longitude: 24.031111 } },
            { id: 2, location: { latitude: 49.843357, longitude: 24.031111 } },
         ],
      },
      {
         id: 1,
         name: "Quest 2",
         markers: [
            { id: 0, location: { latitude: 49.842957, longitude: 24.031111 } },
            { id: 1, location: { latitude: 49.843257, longitude: 24.031111 } },
            { id: 2, location: { latitude: 49.843357, longitude: 24.031111 } },
         ],
      },
   ]);

   const [markers, setMarkers] = useState<IMarker[]>(); // Стан для маркерів
   const [activeQuestId, setActiveQuestId] = useState<number | null>(0); // Стан для активного квесту

   const addMarkerToQuest = async (e: MapLayerMouseEvent) => {
      if (activeQuestId === null) return; // Якщо жоден квест не активний, не додаємо маркер

      setQuests((prevQuests) => {
         return prevQuests.map((quest) => {
            if (quest.id === activeQuestId) {
               const newMarker = {
                  id: quest.markers.length,
                  location: new GeoPoint(e.lngLat.lat, e.lngLat.lng),
               };
               return { ...quest, markers: [...quest.markers, newMarker] };
            } else {
               return quest;
            }
         });
      });
   };

   const deleteMarker = (id: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setMarkers(markers?.filter((marker) => marker.id !== id));
   };

   const onMarkerDragEnd = (e: MarkerDragEvent, id: number) => {
      setMarkers(markers?.map((marker) => (marker.id === id ? { ...marker, location: new GeoPoint(e.lngLat.lat, e.lngLat.lng) } : marker)));
   };

   const activeQuest = quests.find((quest) => quest.id === activeQuestId);

   return (
      <main className="container">
         <MarkerList activeQuestId={activeQuestId} quests={quests} setQuests={setQuests} setActiveQuestId={setActiveQuestId} />
         <div style={{ width: "80%" }}>
            <Map markers={activeQuest?.markers} addMarker={addMarkerToQuest} deleteMarker={deleteMarker} onMarkerDragEnd={onMarkerDragEnd} />
         </div>
      </main>
   );
};

export default App;

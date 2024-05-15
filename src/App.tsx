import MarkerList from "./components/MarkerList";
import Map from "./components/Map";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapRef, MarkerDragEvent } from "react-map-gl";
import { IQuest } from "./types";
import { fetchQuestsFromFirestore } from "./firebaseActions";
import { addMarkerToQuest, deleteMarker, onMarkerDragEnd } from "./questActions";

const App = () => {
   const mapRef = useRef<MapRef>(null);
   const [quests, setQuests] = useState<IQuest[]>([]);
   const [activeQuestId, setActiveQuestId] = useState<string | null>("");
   const activeQuest = useMemo(() => quests.find((quest) => quest.id === activeQuestId), [quests, activeQuestId]);

   const onSelectMarker = useCallback(({ longitude, latitude }: Record<string, number>) => {
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
   }, []);

   const addMarker = useCallback(addMarkerToQuest(activeQuestId, setQuests), [activeQuestId, setQuests]);

   const deleteMarkerFromQuest = useCallback((markerId: string, event: React.MouseEvent) => {
      if (activeQuest) {
         deleteMarker(setQuests)(markerId, activeQuest.id, event);
      }
   }, [activeQuest, setQuests]);

   const handleMarkerDragEnd = useCallback((e: MarkerDragEvent, markerId: string) => {
      if (activeQuest) {
         onMarkerDragEnd(activeQuestId, setQuests)(e, markerId);
      }
   }, [activeQuestId, setQuests, activeQuest]);

   useEffect(() => {
      const fetchAndSetQuests = async () => {
         const questsFromFirestore = await fetchQuestsFromFirestore();
         setQuests(questsFromFirestore as IQuest[]);
         if (questsFromFirestore.length > 0) {
            setActiveQuestId(questsFromFirestore[0].id);
         }
      };
      fetchAndSetQuests();
   }, []);

   return (
      <main className="container">
         <MarkerList
            onSelectMarker={onSelectMarker}
            activeQuestId={activeQuestId || null}
            quests={quests}
            setQuests={setQuests}
            setActiveQuestId={setActiveQuestId}
         />
         <div className="mapWrapper">
            <Map
               ref={mapRef}
               markers={activeQuest?.markers}
               addMarker={addMarker}
               deleteMarker={deleteMarkerFromQuest}
               onMarkerDragEnd={handleMarkerDragEnd}
            />
         </div>
      </main>
   );
};

export default App;

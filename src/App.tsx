import MarkerList from "./MarkerList";
import Map from "./Map";
import { useEffect, useState } from "react";
import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { GeoPoint } from "firebase/firestore";
import { IQuest } from "./types";
import { fetchQuestsFromFirestore, updateQuestInFirestore } from "./firebaseActions";
import { v4 as uuidv4 } from "uuid";

const App = () => {
   const [quests, setQuests] = useState<IQuest[]>([]);

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

   const [activeQuestId, setActiveQuestId] = useState<string | null>("");

   const addMarkerToQuest = async (e: MapLayerMouseEvent) => {
      if (activeQuestId === null) return;

      setQuests((prevQuests) => {
         const updatedQuests = prevQuests.map((quest) => {
            if (quest.id === activeQuestId) {
               const newMarker = {
                  id: uuidv4(),
                  number: quest.markers.length + 1,
                  location: new GeoPoint(e.lngLat.lat, e.lngLat.lng),
                  timestamp: new Date(),
               };
               return { ...quest, markers: [...quest.markers, newMarker] };
            } else {
               return quest;
            }
         });

         const updatedQuest = updatedQuests.find((quest) => quest.id === activeQuestId);
         if (updatedQuest) {
            updateQuestInFirestore(updatedQuest);
         }

         return updatedQuests;
      });
   };

   const deleteMarker = (markerId: string, questId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setQuests((prevQuests) => {
         const updatedQuests = prevQuests.map((quest) => {
            if (quest.id === questId) {
               return { ...quest, markers: quest.markers.filter((marker) => marker.id !== markerId) };
            } else {
               return quest;
            }
         });

         const updatedQuest = updatedQuests.find((quest) => quest.id === questId);
         if (updatedQuest) {
            updateQuestInFirestore(updatedQuest);
         }

         return updatedQuests;
      });
   };

   const onMarkerDragEnd = (e: MarkerDragEvent, markerId: string) => {
      setQuests((prevQuests) => {
         const updatedQuests = prevQuests.map((quest) => {
            if (quest.id === activeQuestId) {
               return {
                  ...quest,
                  markers: quest.markers.map((marker) =>
                     marker.id === markerId ? { ...marker, location: new GeoPoint(e.lngLat.lat, e.lngLat.lng) } : marker
                  ),
               };
            } else {
               return quest;
            }
         });

         const updatedQuest = updatedQuests.find((quest) => quest.id === activeQuestId);
         if (updatedQuest) {
            updateQuestInFirestore(updatedQuest);
         }

         return updatedQuests;
      });
   };

   const activeQuest = quests.find((quest) => quest.id === activeQuestId);

   return (
      <main className="container">
         <MarkerList activeQuestId={activeQuestId || null} quests={quests} setQuests={setQuests} setActiveQuestId={setActiveQuestId} />
         <div className="mapWrapper">
            <Map
               markers={activeQuest?.markers}
               addMarker={addMarkerToQuest}
               deleteMarker={(markerId, event) => deleteMarker(markerId, activeQuest?.id || '', event)}
               onMarkerDragEnd={onMarkerDragEnd}
            />
         </div>
      </main>
   );
};

export default App;

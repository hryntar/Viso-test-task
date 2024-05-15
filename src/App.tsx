import MarkerList from "./MarkerList";
import Map from "./Map";
import { useEffect, useState } from "react";
import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { GeoPoint } from "firebase/firestore";
import { IQuest } from "./types";
import { fetchQuestsFromFirestore, updateQuestInFirestore } from "./firebaseActions";

const App = () => {
   const [quests, setQuests] = useState<IQuest[]>([]);

   useEffect(() => {
      const fetchAndSetQuests = async () => {
         const questsFromFirestore = await fetchQuestsFromFirestore();
         setQuests(questsFromFirestore as IQuest[]);
         console.log(questsFromFirestore);
      };

      fetchAndSetQuests();
   }, []);

   const [activeQuestId, setActiveQuestId] = useState<number | null>(0);

   const addMarkerToQuest = async (e: MapLayerMouseEvent) => {
      if (activeQuestId === null) return;

      setQuests((prevQuests) => {
         const updatedQuests = prevQuests.map((quest) => {
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

         const updatedQuest = updatedQuests.find((quest) => quest.id === activeQuestId);
         if (updatedQuest) {
            updateQuestInFirestore(updatedQuest);
         }

         return updatedQuests;
      });
   };

   const deleteMarker = (markerId: number, questId: number, event: React.MouseEvent) => {
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

   const onMarkerDragEnd = (e: MarkerDragEvent, markerId: number) => {
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
         <MarkerList activeQuestId={activeQuestId} quests={quests} setQuests={setQuests} setActiveQuestId={setActiveQuestId} />
         <div style={{ width: "80%" }}>
            <Map
               markers={activeQuest?.markers}
               addMarker={addMarkerToQuest}
               deleteMarker={(markerId, event) => deleteMarker(markerId, activeQuest?.id as number, event)}
               onMarkerDragEnd={onMarkerDragEnd}
            />
         </div>
      </main>
   );
};

export default App;

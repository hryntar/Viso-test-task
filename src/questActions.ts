import { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import { GeoPoint } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { IQuest } from "./types";
import { updateQuestInFirestore } from "./firebaseActions";

export const addMarkerToQuest = (
   activeQuestId: string | null, 
   setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>
) => async (e: MapLayerMouseEvent) => {
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

export const deleteMarker = (
   setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>
) => (markerId: string, questId: string, event: React.MouseEvent) => {
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

export const onMarkerDragEnd = (
   activeQuestId: string | null, 
   setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>
) => (e: MarkerDragEvent, markerId: string) => {
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

import { IQuest } from "../types";

interface Props {
   quest: IQuest;
   activeQuestId: string | null;
   setActiveQuestId: React.Dispatch<React.SetStateAction<string | null>>;
   deleteQuest: (id: string) => void;
   onSelectMarker: (location: { longitude: number; latitude: number }) => void;
}

const QuestItem = ({ quest, activeQuestId, setActiveQuestId, deleteQuest, onSelectMarker }: Props) => {
   return (
      <li key={quest.id}>
         <h4>
            <button
               className={`questBtn ${quest.id === activeQuestId ? "_active" : ""}`}
               onClick={() => setActiveQuestId(quest.id === activeQuestId ? null : quest.id)}
            >
               {quest.name}
               <span onClick={() => deleteQuest(quest.id)}>✖</span>
            </button>
         </h4>
         {quest.id === activeQuestId ? (
            quest.markers.length > 0 ? (
               <ul>
                  {quest.markers.map((marker) => (
                     <li onClick={() => onSelectMarker({longitude: marker.location.longitude, latitude: marker.location.latitude,})} className="marker" key={marker.id}>
                        <span>
                           Marker {marker.number}: <br />
                           {marker.location.latitude.toFixed(4)}, {marker.location.longitude.toFixed(4)}
                        </span>
                     </li>
                  ))}
               </ul>
            ) : (
               <p className="info-text">Click on map to add marker</p>
            )
         ) : null}
      </li>
   );
};

export default QuestItem;

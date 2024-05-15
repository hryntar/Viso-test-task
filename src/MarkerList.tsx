import { useState } from "react";
import { IQuest } from "./types";
import { addQuestToFirestore, deleteQuestFromFirestore } from "./firebaseActions";
import { v4 as uuidv4 } from 'uuid';

interface Props {
   setActiveQuestId: React.Dispatch<React.SetStateAction<string | null>>;
   setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>;
   quests: IQuest[];
   activeQuestId: string | null;
}

const MarkerList = ({ activeQuestId, setActiveQuestId, setQuests, quests }: Props) => {
   const [newQuestName, setNewQuestName] = useState("");

   const addQuest = () => {
      const newQuest = {
         id: uuidv4(),
         name: newQuestName,
         markers: [],
      };
      setQuests([...quests, newQuest]);
      setNewQuestName("");
      addQuestToFirestore(newQuest);
      setActiveQuestId(newQuest.id);
   };

   const deleteQuest = (questId: string) => {
      setQuests(quests.filter((q) => q.id !== questId));
      deleteQuestFromFirestore(questId);
   };

   return (
      <div>
         <h3>Quests list:</h3>
         <div>
            <input
               className="addQuestInp"
               type="text"
               placeholder="Quest name"
               value={newQuestName}
               onChange={(e) => setNewQuestName(e.target.value)}
            />
            <button className="addQuestBtn" type="button" onClick={addQuest}>
               Add quest
            </button>
         </div>
         <ul>
            {quests.map((quest) => (
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
                        <ol>
                           {quest.markers.map((marker) => (
                              <li className="marker" key={marker.id}>
                                 <span>
                                    {marker.location.latitude.toFixed(4)}, {marker.location.longitude.toFixed(4)}
                                 </span>
                              </li>
                           ))}
                        </ol>
                     ) : (
                        <p className="info-text">Натисніть на карту, щоб додати маркер</p>
                     )
                  ) : null}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default MarkerList;

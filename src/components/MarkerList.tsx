import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IQuest } from "../types";
import { addQuestToFirestore, deleteQuestFromFirestore } from "../firebaseActions";
import QuestForm from "./QuestForm";
import QuestItem from "./QuestItem";

interface Props {
   setActiveQuestId: React.Dispatch<React.SetStateAction<string | null>>;
   setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>;
   quests: IQuest[];
   activeQuestId: string | null;
   onSelectMarker: (location: { longitude: number; latitude: number }) => void;
}

const MarkerList = ({ activeQuestId, setActiveQuestId, setQuests, quests, onSelectMarker }: Props) => {
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
         <QuestForm addQuest={addQuest} newQuestName={newQuestName} setNewQuestName={setNewQuestName} />
         <ul className="questList">
            {quests.map((quest) => (
               <QuestItem onSelectMarker={onSelectMarker} key={quest.id} quest={quest} deleteQuest={deleteQuest} activeQuestId={activeQuestId} setActiveQuestId={setActiveQuestId} />
            ))}
         </ul>
      </div>
   );
};

export default MarkerList;

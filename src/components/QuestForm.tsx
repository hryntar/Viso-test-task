
interface Props {
   addQuest: () => void;
   newQuestName: string;
   setNewQuestName: (name: string) => void;
}

const QuestForm = ({addQuest, newQuestName, setNewQuestName}: Props) => {
   return (
      <div>
         <input className="addQuestInp" type="text" placeholder="Quest name" value={newQuestName} onChange={(e) => setNewQuestName(e.target.value)} />
         <button className="addQuestBtn" type="button" onClick={addQuest}>
            Add quest
         </button>
      </div>
   );
};

export default QuestForm;

import { collection, updateDoc, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { IQuest } from "./types";
import { db } from "./config/firebase";

const questsCollection = collection(db, "quests"); 

export const addQuestToFirestore = async (quest: IQuest) => {
   try {
      const questDoc = doc(collection(db, "quests"), quest.id.toString());
      await setDoc(questDoc, quest);
   } catch (e) {
      console.error("Error adding document: ", e);
   }
};

export const updateQuestInFirestore = async (quest: IQuest) => {
   try {
      const questDoc = doc(db, "quests", quest.id.toString());
      await updateDoc(questDoc, { ...quest });
   } catch (e) {
      console.error("Error updating document: ", e);
   }
};

export const deleteQuestFromFirestore = async (questId: number) => {
   try {
      const questDoc = doc(db, "quests", questId.toString());
      await deleteDoc(questDoc);
   } catch (e) {
      console.error("Error deleting document: ", e);
   }
};

export const fetchQuestsFromFirestore = async () => {
   const questSnapshot = await getDocs(questsCollection);
   const questList = questSnapshot.docs.map(doc => doc.data());
   return questList;
};

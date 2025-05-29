import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc , setDoc} from 'firebase/firestore';
import { auth } from './firebase'; // Assurez-vous d'importer auth
import { addExercisesToFirebase } from './exerciceService';

// Fonction pour créer un nouvel entraînement
export const createWorkout = async (workoutData) => {
  try {
    const userId = auth.currentUser.uid; // Récupérer l'UID de l'utilisateur connecté
    const workoutRef = collection(db, 'workouts'); // Référence à la collection des entraînements
    const newWorkout = {
      ...workoutData,
      userId, // Ajouter l'UID de l'utilisateur
      dateCreated: new Date().toISOString(), // Date de création
    };
    const docRef = await addDoc(workoutRef, newWorkout); // Ajouter le nouvel entraînement
    console.log("Workout created with ID:", docRef.id);
    return docRef.id; // Retourner l'ID du nouvel entraînement
  } catch (error) {
    console.error("Error creating workout:", error);
    throw error; // Propager l'erreur
  }
};

export const getUserWorkoutById = async (workoutId) => {
  console.log("Fetching workout with ID:", workoutId);

    const userId = auth.currentUser.uid; // Récupérer l'UID de l'utilisateur connecté
    const workoutRef = doc(db, 'workouts', workoutId); // Référence à l'entraînement
    const workoutDoc = await getDoc(workoutRef); // Récupérer le document de l'entraînement
    
    if (workoutDoc.exists()) {
      const workoutData = { id: workoutDoc.id, ...workoutDoc.data() }; // Ajouter l'ID aux données de l'entraînement
      if (workoutData.userId === userId) { // Vérifier si l'utilisateur est le propriétaire
        return workoutData; // Retourner les données de l'entraînement
      } else {
        console.error("Workout does not belong to the current user");
        return null; // L'entraînement n'appartient pas à l'utilisateur
      }
    } else {
      console.error("Workout not found");
      return null; // Entraînement non trouvé
    }
 
}

// Fonction pour récupérer tous les entraînements d'un utilisateur
export const getUserWorkouts = async () => {
  try {
    const userId = auth.currentUser.uid; // Récupérer l'UID de l'utilisateur connecté
    const workoutsRef = collection(db, 'workouts'); // Référence à la collection des entraînements
    const q = query(workoutsRef, where("userId", "==", userId)); // Requête pour récupérer les entraînements de l'utilisateur
    const querySnapshot = await getDocs(q);
    
    const workouts = [];
    querySnapshot.forEach((doc) => {
      workouts.push({ id: doc.id, ...doc.data() }); // Ajouter chaque entraînement à la liste
    });
    return workouts; // Retourner la liste des entraînements
  } catch (error) {
    console.error("Error retrieving workouts:", error);
    throw error; // Propager l'erreur
  }
};

// Fonction pour récupérer les détails d'une séance spécifique
export const getWorkoutById = async (workoutId) => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    const workoutDoc = await getDoc(workoutRef);
    
    if (workoutDoc.exists()) {
      return { id: workoutDoc.id, ...workoutDoc.data() };
    } else {
      console.error("Workout not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving workout:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un entraînement
export const updateWorkout = async (workoutId, updatedData) => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId); // Référence à l'entraînement à mettre à jour
    console.log("Updating workout with ID:", updatedData);
    await setDoc(workoutRef, updatedData, { merge: true }); // Mettre à jour l'entraînement
    console.log("Workout updated successfully:", workoutId);
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error; // Propager l'erreur
  }
}; 
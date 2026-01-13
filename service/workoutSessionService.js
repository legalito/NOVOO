import { db } from './firebase';
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from './firebase';

// Fonction pour démarrer une nouvelle session d'entraînement
export const startWorkoutSession = async (workoutId) => {
  try {
    const userId = auth.currentUser.uid;
    const sessionsRef = collection(db, 'workout_sessions');
    const newSession = {
      workoutId,
      userId,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'in_progress',
      exercises: [],
    };
    console.log("Starting new workout session:", newSession);
    await addDoc(sessionsRef, newSession);
    console.log("New workout session started:", newSession);
    return newSession;
  } catch (error) {
    console.error("Error starting workout session:", error);
    throw error;
  }
};

// Fonction pour terminer une session d'entraînement
export const endWorkoutSession = async (exerciceProgress) => {
  try {
    const sessionRef = collection(db, 'workout_sessions');
    
    const docRef = await addDoc(sessionRef, exerciceProgress);
    console.log("Workout session ended:", docRef.id);
  } catch (error) {
    console.error("Error ending workout session:", error);
    throw error;
  }
};

// Fonction pour ajouter un exercice à une session d'entraînement
export const addExerciseToSession = async (sessionId, exerciseData) => {
  try {
    const sessionRef = doc(db, 'workout_sessions', sessionId);
    
    // Vérifier si la session existe
    const sessionDoc = await getDoc(sessionRef);
    if (!sessionDoc.exists()) {
      throw new Error("Session not found");
    }
    
    // Ajouter l'exercice à la liste des exercices de la session
    await updateDoc(sessionRef, {
      exercises: arrayUnion({
        ...exerciseData,
        timestamp: new Date().toISOString(),
      }),
    });
    
    console.log("Exercise added to session:", exerciseData);
  } catch (error) {
    console.error("Error adding exercise to session:", error);
    throw error;
  }
};

// Fonction pour récupérer les détails d'une session d'entraînement
export const getWorkoutSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'workout_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (sessionDoc.exists()) {
      return { id: sessionDoc.id, ...sessionDoc.data() };
    } else {
      console.error("Session not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving workout session:", error);
    throw error;
  }
};

// Fonction pour récupérer toutes les sessions d'un utilisateur
export const getUserWorkoutSessions = async () => {
  try {
    const userId = auth.currentUser.uid;
    const sessionsRef = collection(db, 'workout_sessions');
    const q = query(sessionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return sessions;
  } catch (error) {
    console.error("Error retrieving user workout sessions:", error);
    throw error;
  }
};

const finishWorkout = async () => {
  if (sessionId) {
    try {
      // Envoyer les données d'exercice à Firebase
      for (const progress of exerciseProgress) {
        await addExerciseToSession(sessionId, {
          workout_id: workout.id,
          exercise_id: progress.exerciseId,
          sets: progress.sets,
          reps: progress.reps,
          weight: progress.weight,
          duration: progress.duration
        });
      }

      await endWorkoutSession(sessionId);
      Alert.alert(
        "Entraînement terminé",
        "Félicitations ! Votre entraînement a été enregistré.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error ending workout session:", error);
      Alert.alert("Erreur", "Impossible de terminer la session d'entraînement");
    }
  }
}; 
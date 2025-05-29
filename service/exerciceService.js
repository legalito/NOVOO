import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from 'firebase/firestore';
import exercisesData from './data/exercices.json'; // Assure-toi que le fichier JSON est bien placé

const db = getFirestore();


export const addExercisesToFirebase = async () => {
    try {
        const exercisesCollection = collection(db, "exercises");
        const promises = exercisesData.map(exercise => 
            addDoc(exercisesCollection, {
                ...exercise
            })
        );
        await Promise.all(promises);
        console.log("Tous les exercices ont été ajoutés avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout des exercices :", error);
    }
};

export const getAllExercises = async () => {
    try {
        const exercisesCollection = collection(db, "exercises");
        const querySnapshot = await getDocs(exercisesCollection);
        const exercises = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return exercises;
    } catch (error) {
        console.error("Erreur lors de la récupération des exercices :", error);
        return [];
    }
};

export const getExerciseById = async (exerciseId) => {
    try {
        const exerciseRef = doc(db, "exercises", exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);

        if (exerciseSnap.exists()) {
            return { id: exerciseSnap.id, ...exerciseSnap.data() };
        } else {
            console.log("Aucun exercice trouvé avec cet ID !");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice :", error);
        return null;
    }
};

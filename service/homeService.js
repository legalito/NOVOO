import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc , setDoc} from 'firebase/firestore';
import { auth } from './firebase'; // Assurez-vous d'importer auth



export const getQuickStats = async () => {
    try {
        // Vérifier si l'utilisateur est connecté
        const user = auth.currentUser;
        if (!user) {
            console.error("Aucun utilisateur connecté");
            return { nombreSeances: 0, TempsTotal: 0, nombreExercices: 0 };
        }
        
        const userId = user.uid;
        
        // Créer directement la requête (erreur corrigée: workoutsRef doit être une référence à la collection)
        const workoutsRef = collection(db, 'workout_sessions');
        const q = query(workoutsRef, where("userId", "==", userId));
        
        // Exécuter la requête
        const querySnapshot = await getDocs(q);
        
        // Initialiser les statistiques
        let nombreSeances = 0;
        let TempsTotal = 0;
        let nombreExercices = 0;
        
        // Analyser les documents (un seul parcours au lieu de deux)
        querySnapshot.forEach((doc) => {
            const workoutData = doc.data();
            nombreSeances++;
            // Vérification des valeurs pour éviter les NaN
            TempsTotal += workoutData.duration || 0;
            nombreExercices += (workoutData.exercices?.length || 0);
            // Convertir TempsTotal en heures et minutes
            const heures = Math.floor(TempsTotal / 60);
            const minutesRestantes = TempsTotal % 60;

        });

        // Créer l'objet statistiques
        const stats = {
            nombreSeances,
            TempsTotal,
            nombreExercices,
        };

        return stats;
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        return { nombreSeances: 0, TempsTotal: 0, nombreExercices: 0, error: error.message };
    }
};
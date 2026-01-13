import { addDoc, collection } from 'firebase/firestore';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebase';

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Vérifier si l'utilisateur est connecté avant d'ajouter des données
    if (auth.currentUser) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        dateInscription: new Date(),
      });
      console.log("User data added to Firestore successfully.");
    } else {
      console.error("User is not authenticated. Cannot save data.");
    }

    return userCredential.user; // Retourner l'utilisateur
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Propager l'erreur
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Retourner l'utilisateur
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error; // Propager l'erreur
  }
}; 
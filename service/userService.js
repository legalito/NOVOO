import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from './firebase'; // Assurez-vous d'importer auth

export const saveUserData = async (data) => {
  try {
    console.log("Data to save:", data);
    const userUid = auth.currentUser.uid; // Récupérer l'UID de l'utilisateur connecté
    console.log("User UID:", userUid);

    // Rechercher le document qui contient l'UID de l'utilisateur
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("uid", "==", userUid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No such document found!");
      return; // Sortir si aucun document n'est trouvé
    }

    // Récupérer l'ID du premier document trouvé
    let documentId;
    querySnapshot.forEach((doc) => {
      documentId = doc.id; // Récupérer l'ID du document
      console.log("Document ID found:", documentId);
    });

    const userRef = doc(db, 'users', documentId); // Créer une référence à l'utilisateur avec l'ID du document
    const userDoc = await getDoc(userRef); // Récupérer le document utilisateur
    if (userDoc.exists()) {
      console.log("User data before update:", userDoc.data()); // Afficher les données existantes
    } else {
      console.log("No such document!");
    }
    console.log("Data to save:", typeof data, data);
    await setDoc(userRef, data, { merge: true }); // Enregistrer les données avec fusion
    console.log("User data saved successfully:", data);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error; // Propager l'erreur
  }
};
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import {
  createWorkout,
  getUserWorkouts,
  getUserWorkoutById,
  updateWorkout,
} from "../../service/workoutService";
import AddExerciseScreen from "../../components/WorkoutCalendar/add-exercise";
import { Exercise } from "../../components/WorkoutCalendar/add-exercise";
import { useLocalSearchParams } from "expo-router";

export default function CreateWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  interface Workout {
    id: string;
    name: string;
    description: string;
    dateCreated: string; // ISO string
    userId: string;
    exercises: Exercise[];
  }

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const workoutData: Workout[] = await getUserWorkouts();
        // Find the workout with the given ID
        const workout: Workout | undefined = workoutData.find(
          (workout) => workout.id === id
        );
        console.log("Workout data:", workoutData);
        console.log("Selected workout:", workout);
        setWorkoutName(workout?.name || "");
        setWorkoutDescription(workout?.description || "");
        // If found, set the workout name and description
        if (workout) {
          workout.exercises.forEach((exercise) => {
            setSelectedExercises((prevExercises) => [
              ...prevExercises,
              {
                id: exercise.id,
                name: exercise.name,
                muscles: exercise.muscles,
                isSelected: true,
              },
            ]);
          });
        }
      } catch (error) {
        console.error("Error fetching workout details:", error);
      }
    };

    fetchWorkoutDetails();
  }, [id]);

  const handleExercisesSelected = (exercises: Exercise[]) => {
    setSelectedExercises((prevExercises) => [...prevExercises, ...exercises]);
    setShowAddExercise(false);
  };

  const saveWorkout = async () => {
    const workoutData = {
      name: workoutName,
      description: workoutDescription,
      exercises: selectedExercises,
    };

    try {
      if (id) {
        const findWorkout = await getUserWorkoutById(id);
        if (findWorkout) {
          console.log("worjoutData", workoutData);
          await updateWorkout(id, workoutData);
          router.back();
          return;
        } 
      }else {
        console.log("workoutData", workoutData);
        await createWorkout(workoutData);
        router.back();
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {showAddExercise && (
        <View style={styles.addExerciseOverlay}>
          <AddExerciseScreen onExercisesSelected={handleExercisesSelected} />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
<<<<<<< HEAD
          <ThemedText style={styles.backButton}>← Retour</ThemedText>
=======
          <ThemedText>← Retour</ThemedText>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
        </TouchableOpacity>
        <ThemedText style={styles.title}>Nouvelle séance</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.inputGroup}>
<<<<<<< HEAD
          <ThemedText  style={styles.label}>Nom de la séance</ThemedText>
=======
          <ThemedText style={styles.label}>Nom de la séance</ThemedText>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
          <TextInput
            style={styles.input}
            placeholder="Ex: Séance Dos & Biceps"
            placeholderTextColor="#999"
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description de la séance"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={workoutDescription}
            onChangeText={setWorkoutDescription}
          />
        </View>

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowAddExercise(true)}
        >
          <ThemedText style={styles.addExerciseText}>
            + Ajouter des exercices
          </ThemedText>
        </TouchableOpacity>

        {/* Liste des exercices sélectionnés */}
        {selectedExercises.length > 0 && (
          <View style={styles.selectedExercisesContainer}>
            <ThemedText style={styles.selectedExercisesTitle}>
              Exercices sélectionnés ({selectedExercises.length})
            </ThemedText>
            {selectedExercises.map((exercise) => (
              <View key={exercise.id} style={styles.selectedExerciseItem}>
                <ThemedText style={styles.selectedExerciseName}>
                  {exercise.name}
                </ThemedText>
                <ThemedText style={styles.selectedExerciseMuscle}>
                  {exercise.muscles}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
          <ThemedText style={styles.saveButtonText}>
            Enregistrer la séance
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    padding: 20,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 0,
  },
  addExerciseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  addExerciseButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  addExerciseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedExercisesContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  selectedExercisesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  selectedExerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  selectedExerciseName: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedExerciseMuscle: {
    fontSize: 14,
    opacity: 0.7,
  },
<<<<<<< HEAD
  backButton: {
    color: "#FFFFFF",
  },
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
});

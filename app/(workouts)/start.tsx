import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { getWorkoutById } from '../../service/workoutService';
import { startWorkoutSession, endWorkoutSession, addExerciseToSession } from '../../service/workoutSessionService';
import { Exercise } from '../../components/WorkoutCalendar/add-exercise';
import { auth } from '../../service/firebase'; // Assurez-vous d'importer auth

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  dateCreated: string;
  userId: string;
}

interface ExerciseProgress {
  exerciseId?: string;
  name?: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  completed: boolean;
}

interface WorkoutProgress {
  id: string | undefined;
  userId: string | undefined;
  date: string;
  duration: number;
  notes: string;
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      reps: number;
      weight: number | null;
    }[];
  }[];
}

export default function StartWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<WorkoutProgress | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(90); // 90 secondes de repos par défaut
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentDuration, setCurrentDuration] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userId = auth?.currentUser?.uid; // Récupérer l'UID de l'utilisateur connecté

  // Charger les détails de l'entraînement
  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        setLoading(true);
        const workoutData = await getWorkoutById(id);
        console.log("Workout data:", workoutData);
        if (workoutData) {
          setWorkout(workoutData as Workout);
          
          // Initialiser le progrès des exercices
          const progress = (workoutData as Workout).exercises.map(exercise => ({
            exerciseId: exercise.id,
            name: exercise.name,
            sets: 3, // Valeur par défaut
            reps: 10, // Valeur par défaut
            weight: 0,
            duration: 0,
            completed: false
          }));
          
          setExerciseProgress({
            id: workoutData.id,
            userId: workoutData.userId,
            date: new Date().toISOString().split('T')[0],
            duration: 0,
            notes: "",
            exercises: progress.map(p => ({
              exerciseId: p.exerciseId,
              name: p.name,
              sets: [{ reps: p.reps, weight: p.weight }]
            }))
          });
        }
      } catch (error) {
        console.error("Error fetching workout details:", error);
        Alert.alert("Erreur", "Impossible de charger les détails de l'entraînement");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [id]);

  // Démarrer le chronomètre lorsque le composant est monté
  useEffect(() => {
    setIsTimerRunning(true);

    // Nettoyage pour arrêter le chronomètre lorsque le composant est démonté
    return () => {
      setIsTimerRunning(false);
    };
  }, []);

  // Gérer le chronomètre
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Gérer le chronomètre de repos
  useEffect(() => {
    if (isResting) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsResting(false);
            return 90; // Réinitialiser à 90 secondes
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [isResting]);

  // Formater le temps en minutes:secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Démarrer/arrêter le chronomètre
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Passer à l'exercice suivant
  const nextExercise = () => {
    if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setCurrentReps('');
      setCurrentWeight('');
      setCurrentDuration('');
      setIsResting(true);
    } else {
      // Terminer l'entraînement
      finishWorkout();
    }
  };

  // Terminer l'entraînement
  const finishWorkout = async () => {
    console.log("Finishing workout...");
    try {
      console.log("Finishing workout session...");
      console.log("Session workout finish data:", exerciseProgress);

      // Calculate the total duration in minutes
      const totalDuration = Math.floor(timer / 60); // Convert seconds to minutes
      const userId = auth?.currentUser?.uid; // Récupérer l'UID de l'utilisateur connecté

      // Prepare the workout session data
      const workoutSessionData = {
        workoutId: workout?.id,
        userId: userId, // Replace with the actual user ID
        startTime: new Date().toISOString(), // You may want to set this when starting the session
        endTime: new Date().toISOString(),
        status: 'completed',
        duration: totalDuration,
        exercises: exerciseProgress?.exercises || []
      };

      await endWorkoutSession(workoutSessionData); // Pass the entire object
      Alert.alert(
        "Entraînement terminé",
        "Félicitations ! Votre entraînement a été enregistré.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error ending workout session:", error);
      Alert.alert("Erreur", "Impossible de terminer la session d'entraînement");
    }
  };

  // Enregistrer un set d'exercice
  const saveSet = async () => {
    
    console.log("Saving set...");

    const currentExercise = workout?.exercises[currentExerciseIndex];
    const exerciseData = {
      workout_id: workout?.id,
      exercise_id: currentExercise?.id || "",
      sets: currentSet,
      reps: parseInt(currentReps) || 0,
      weight: parseFloat(currentWeight) || 0,
      duration: parseInt(currentDuration) || 0
    };
    console.log("Exercise data:", exerciseData);
    
    // Stocker les données localement dans l'état
    setExerciseProgress((prevProgress) => {
      const updatedProgress: WorkoutProgress = {
        id: workout?.id,
        userId: userId , // Replace with the actual user ID
        date: new Date().toISOString().split('T')[0],
        duration: 55, // Replace with actual duration if available
        notes: "Bonne séance", // Replace with notes if necessary
        exercises: prevProgress?.exercises || [] // Initialize with previous exercises or empty array
      };

      // Check if the current exercise already exists
      const existingExerciseIndex = updatedProgress.exercises.findIndex(ex => ex.exerciseId === currentExercise?.id);
      if (existingExerciseIndex === -1) {
        // If the exercise does not exist, add it
        updatedProgress.exercises.push({
          exerciseId: currentExercise?.id || "",
          name: currentExercise?.name || "",
          sets: [{
            reps: parseInt(currentReps) || 0,
            weight: parseFloat(currentWeight) || 0
          }]
        });
      } else {
        // If the exercise exists, add the set to the existing exercise
        updatedProgress.exercises[existingExerciseIndex].sets.push({
          reps: parseInt(currentReps) || 0,
          weight: parseFloat(currentWeight) || 0
        });
      }

      return updatedProgress; // Return the updated workout progress
    });
    
    // Passer au set suivant ou à l'exercice suivant
    if (currentSet < 3) { // Supposons 3 sets par exercice
      setCurrentSet(currentSet + 1);
      setCurrentReps('');
      setCurrentWeight('');
      setCurrentDuration('');
      setIsResting(true);
    } else {
      nextExercise();
    }
  };

  // Annuler le repos
  const skipRest = () => {
    setIsResting(false);
    setRestTimer(90);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Chargement de l'entraînement...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!workout) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Entraînement non trouvé</ThemedText>
          <ThemedText style={styles.errorSubtext}>Cet entraînement n'existe pas ou a été supprimé</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText>← Retour</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>{workout.name}</ThemedText>
      </View>

      <View style={styles.timerContainer}>
        <ThemedText style={styles.timerText}>{formatTime(timer)}</ThemedText>
        <TouchableOpacity 
          style={[styles.timerButton, isTimerRunning ? styles.stopButton : styles.startButton]}
          onPress={toggleTimer}
        >
          <ThemedText style={styles.timerButtonText}>
            {isTimerRunning ? "Pause" : "Démarrer"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {isResting ? (
        <View style={styles.restContainer}>
          <ThemedText style={styles.restTitle}>Temps de repos</ThemedText>
          <ThemedText style={styles.restTimer}>{formatTime(restTimer)}</ThemedText>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={skipRest}
          >
            <ThemedText style={styles.skipButtonText}>Passer le repos</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.exerciseContainer}>
          <ThemedText style={styles.exerciseTitle}>
            Exercice {currentExerciseIndex + 1}/{workout.exercises.length}
          </ThemedText>
          <ThemedText style={styles.exerciseName}>{currentExercise.name}</ThemedText>
          <ThemedText style={styles.exerciseMuscle}>{currentExercise.muscles}</ThemedText>
          
          <View style={styles.setContainer}>
            <ThemedText style={styles.setTitle}>Set {currentSet}/3</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Répétitions</ThemedText>
              <TextInput
                style={styles.input}
                value={currentReps}
                onChangeText={setCurrentReps}
                keyboardType="number-pad"
                placeholder="10"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Poids (kg)</ThemedText>
              <TextInput
                style={styles.input}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                keyboardType="number-pad"
                placeholder="0"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Durée (sec)</ThemedText>
              <TextInput
                style={styles.input}
                value={currentDuration}
                onChangeText={setCurrentDuration}
                keyboardType="number-pad"
                placeholder="0"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveSet}
            >
              <ThemedText style={styles.saveButtonText}>Enregistrer le set</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.finishButton}
        onPress={finishWorkout}
      >
        <ThemedText style={styles.finishButtonText}>Terminer l'entraînement</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    paddingTop: 40,
    marginBottom: 10,
  },
  timerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  timerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  restContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginBottom: 20,
  },
  restTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  restTimer: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseMuscle: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 20,
  },
  setContainer: {
    marginTop: 20,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    opacity: 0.7,
  },
}); 
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { getWorkoutById } from '../../service/workoutService';
import { Exercise } from '../../components/WorkoutCalendar/add-exercise';
import { useFocusEffect } from '@react-navigation/native';

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  dateCreated: string;
  userId: string;
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("Workout ID:", id);
  
  useFocusEffect(
    React.useCallback(() => {
      const fetchWorkoutDetails = async () => {
        try {
          setLoading(true);
          const workoutData = await getWorkoutById(id as string);
          if (workoutData) {
            setWorkout(workoutData as Workout);
          }
        } catch (error) {
          console.error("Error fetching workout details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWorkoutDetails();
    }, [id])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText>← Retour</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Chargement de la séance...</ThemedText>
        </View>
      ) : workout ? (
        <>
          <ThemedText style={styles.title}>{workout.name}</ThemedText>
          <ThemedText style={styles.subtitle}>{workout.description}</ThemedText>

          <ThemedText style={styles.sectionTitle}>Exercices</ThemedText>

          <ScrollView style={styles.exerciseList}>
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                  <View style={styles.exerciseImageContainer}>
                    <Image
                      source={require('../../assets/images/icon.png')}
                      style={styles.exerciseImage}
                    />
                  </View>
                  <View style={styles.exerciseDetails}>
                    <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
                    <View style={styles.exerciseTime}>
                      <ThemedText style={styles.restTime}>1m30s repos</ThemedText>
                    </View>
                    <View style={styles.exerciseStats}>
                      <ThemedText>3 séries</ThemedText>
                      <ThemedText>10-12 reps</ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => {
                      // Implement delete logic here
                      console.log('Delete exercise:', exercise.name);
                    }}
                  >
                    <ThemedText style={styles.deleteButtonText}>×</ThemedText>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>Aucun exercice dans cette séance</ThemedText>
                <ThemedText style={styles.emptySubtext}>Ajoutez des exercices pour commencer</ThemedText>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={() => router.push(`/(workouts)/create?id=${id}`)}
          >
            <ThemedText style={styles.addExerciseText}>
              Ajouter exercice
            </ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Séance non trouvée</ThemedText>
          <ThemedText style={styles.errorSubtext}>Cette séance n'existe pas ou a été supprimée</ThemedText>
        </View>
      )}
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
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  exerciseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#333333',
    marginRight: 16,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restTime: {
    fontSize: 14,
    opacity: 0.7,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addExerciseText: {
    color: 'white',
    fontSize: 16,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
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
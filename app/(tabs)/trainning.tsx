import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { getUserWorkouts } from '../../service/workoutService';
import { Exercise } from '../../components/WorkoutCalendar/add-exercise';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Définition de l'interface Workout
interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  dateCreated: string;
  userId: string;
}

export default function TrainningScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const days = ['L', 'M', 'Mer', 'J', 'V', 'S', 'D'];
  const currentWeek = [3, 4, 5, 6, 7, 8, 9];
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const userWorkouts = await getUserWorkouts();
        setWorkouts(userWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        setLoading(true);
        try {
          const userWorkouts = await getUserWorkouts();
          setWorkouts(userWorkouts);
        } catch (error) {
          console.error("Error fetching workouts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWorkouts();
    }, [])
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>Mes séances</ThemedText>
      <ThemedText style={styles.subtitle}>Commence un entrainement</ThemedText>

      {/* Calendar Section */}
      <View style={[styles.calendarContainer, { backgroundColor: colors.secondary }]}>
        <ThemedText style={styles.sectionTitle}>Workouts</ThemedText>
        <View style={styles.daysRow}>
          {days.map((day, index) => (
            <View key={day} style={styles.dayColumn}>
              <ThemedText style={styles.dayText}>{day}</ThemedText>
              <View style={[
                styles.dateCircle,
                currentWeek[index] === 3 || currentWeek[index] === 4 || currentWeek[index] === 5 || currentWeek[index] === 8
                  ? { backgroundColor: colors.primary } : { backgroundColor: colors.accent }
              ]}>
                <ThemedText style={styles.dateText}>{currentWeek[index]}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Workouts List */}
      <ScrollView style={styles.workoutsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={styles.loadingText}>Chargement des séances...</ThemedText>
          </View>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => (
            <TouchableOpacity 
              key={workout.id}
              style={[styles.workoutCard, { backgroundColor: colors.secondary }]}
              onPress={() => router.push(`/(workouts)/${workout.id}`)}
            >
              <View>
                <ThemedText style={styles.workoutTitle}>{workout.name}</ThemedText>
                <ThemedText style={styles.workoutSubtitle}>{workout.description}</ThemedText>
                <View style={styles.workoutStats}>
                  <View style={styles.stat}>
                    <ThemedText>{workout.exercises?.length || 0} exercices</ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <ThemedText>{new Date(workout.dateCreated).toLocaleDateString()}</ThemedText>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push(`/(workouts)/start?id=${workout.id}`)}
              >
                <ThemedText style={{ color: colors.secondary }}>▶</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Aucune séance trouvée</ThemedText>
            <ThemedText style={styles.emptySubtext}>Créez votre première séance d'entraînement</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Add Workout Button */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(workouts)/create')}
      >
        <ThemedText style={[styles.addButtonText, { color: colors.secondary }]}>+ Créer une séance</ThemedText>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  calendarContainer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayText: {
    marginBottom: 8,
    fontSize: 16,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  workoutsList: {
    flex: 1,
  },
  workoutCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    opacity: 0.7,
  },
});

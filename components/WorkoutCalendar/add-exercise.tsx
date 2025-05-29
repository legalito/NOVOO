import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/service/firebase';

export type Exercise = {
  id: string;
  name: string;
  muscles?: string[];
  isSelected?: boolean;
};

interface AddExerciseScreenProps {
  onExercisesSelected: (exercises: Exercise[]) => void; // Callback pour passer les exercices sélectionnés
}

export default function AddExerciseScreen({ onExercisesSelected }: AddExerciseScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "exercises"));
        const exercisesList: Exercise[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          isSelected: false,
          ...doc.data(),
        })) as Exercise[];
        
        setExercises(exercisesList);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleExerciseSelection = (exerciseId: string) => {
    setExercises((prevExercises) => {
      return prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSelected = !exercise.isSelected;
          setSelectedCount(prev => newSelected ? prev + 1 : prev - 1);
          return { ...exercise, isSelected: newSelected };
        }
        return exercise;
      });
    });
  };

  const handleAddExercises = () => {
    const selectedExercises = exercises.filter(ex => ex.isSelected);
    onExercisesSelected(selectedExercises); // Appel du callback avec les exercices sélectionnés
  };

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <ThemedText>✕</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <ThemedText style={styles.tabText}>Exercices récents</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'equipment' && styles.activeTab]}
          onPress={() => setActiveTab('equipment')}
        >
          <ThemedText style={styles.tabText}>Equipements</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'muscles' && styles.activeTab]}
          onPress={() => setActiveTab('muscles')}
        >
          <ThemedText style={styles.tabText}>Muscles</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <ScrollView style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <TouchableOpacity 
            key={exercise.id}
            style={[styles.exerciseItem, exercise.isSelected && styles.selectedExercise]}
            onPress={() => toggleExerciseSelection(exercise.id)}
          >
            <View style={styles.exerciseImageContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.exerciseImage}
              />
            </View>
            <View style={styles.exerciseInfo}>
              <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
              <ThemedText style={styles.exerciseMuscle}>{exercise.muscles}</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.addButton, exercise.isSelected && styles.selectedButton]}
            >
              <ThemedText style={styles.addButtonText}>
                {exercise.isSelected ? '✓' : '+'}
              </ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <TouchableOpacity 
        style={styles.addExercisesButton}
        onPress={handleAddExercises}
      >
        <ThemedText style={styles.addExercisesText}>
          Ajouter {selectedCount} exercice{selectedCount > 1 ? 's' : ''}
        </ThemedText>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 14,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  selectedExercise: {
    backgroundColor: '#E3F2FD',
  },
  exerciseImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    marginRight: 16,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMuscle: {
    fontSize: 14,
    opacity: 0.7,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  addExercisesButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addExercisesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
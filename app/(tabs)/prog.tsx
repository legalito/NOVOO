import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WorkoutCalendar } from '@/components/WorkoutCalendar/index';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { getQuickStats } from '@/service/homeService'; // Hypothetical service to fetch quick stats
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

interface QuickStat {
  nombreSeances: number | undefined;
  TempsTotal: number;
  nombreExercices: number;
}

<<<<<<< HEAD
type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
};

const StatCard = ({ title, value, unit }: StatCardProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.statCardNeed}>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <View style={styles.statValueContainer}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        {unit && <ThemedText style={styles.statUnit}>{unit}</ThemedText>}
      </View>
    </View>
  );
};
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [quickStatsDB, setQuickStatsDB] = useState<QuickStat>();

  const workoutPrograms = [
    { id: 1, name: 'Full Body', duration: '60 min', difficulty: 'Intermédiaire', icon: 'figure.walk' },
    { id: 2, name: 'Upper Body', duration: '45 min', difficulty: 'Débutant', icon: 'figure.arms.open' },
    { id: 3, name: 'Lower Body', duration: '50 min', difficulty: 'Avancé', icon: 'figure.run' },
  ];

  

  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching data
      try {
        const stats = await getQuickStats();
        setQuickStatsDB(stats);
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    }
    fetchData();
  }, []);
 
  console.log('quickStatsDB', JSON.stringify(quickStatsDB, null, 2));
  
  const quickStats = [
<<<<<<< HEAD
    { title: 'Séances', value: quickStatsDB?.nombreSeances || 0, icon: 'flame.fill', color: '#FF9500' },
    { title: 'Temps total', value: quickStatsDB?.TempsTotal || 0, icon: 'clock.fill', color: '#5856D6' },
=======
    { title: 'Séances', value: quickStatsDB?.nombreSeances || 0, icon: 'flame.fill', color: colors.detail },
    { title: 'Temps total', value: quickStatsDB?.TempsTotal || 0, icon: 'clock.fill', color: colors.primary },
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    { 
      title: 'Durée moyenne', 
      value: quickStatsDB?.nombreSeances > 0 
        ? Math.round((quickStatsDB.TempsTotal / quickStatsDB.nombreSeances) * 10) / 10 
        : 0, // Calculate average duration
      icon: 'chart.bar.fill', 
<<<<<<< HEAD
      color: '#34C759' 
=======
      color: colors.accent 
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
<<<<<<< HEAD
          <ThemedText style={[styles.welcomeText, { color: '#FFFFFF' }]}>Bonjour,</ThemedText>
          <ThemedText style={[styles.nameText, { color: '#FFFFFF' }]}>Hugo</ThemedText>
=======
          <ThemedText style={styles.welcomeText}>Bonjour,</ThemedText>
          <ThemedText style={styles.nameText}>Hugo</ThemedText>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
<<<<<<< HEAD
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: colors.background }]}
            >
              <IconSymbol name={stat.icon as any} size={24} color={colors.accent} />
              <ThemedText style={[styles.statValue, { color: '#FFFFFF' }]}>{stat.value}</ThemedText>
              <ThemedText style={[styles.statTitle, { color: '#FFFFFF' }]}>{stat.title}</ThemedText>
            </View>
=======
            <BlurView
              key={index}
              intensity={80}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={[styles.statCard, { backgroundColor: colors.secondary }]}
            >
              <IconSymbol name={stat.icon as any} size={24} color={stat.color} />
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
            </BlurView>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
          ))}
        </View>
        <WorkoutCalendar
          sessions={{
<<<<<<< HEAD
            '2025-06-04': { type: 'workout', completed: true },
            '2025-06-06': { type: 'workout', completed: true },
            // Ajoute ici tous les jours faits
=======
            '2021-09-01': { type: 'full-body', completed: true },
            '2021-09-02': { type: 'upper-body', completed: true },
            '2021-09-03': { type: 'lower-body', completed: true },
            '2021-09-04': { type: 'full-body', completed: true },
            '2021-09-05': { type: 'upper-body', completed: true },
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
          }}
          onDayPress={(date) => console.log('Selected date:', date)}
        />

        {/* Workout Programs */}
        <View style={styles.sectionHeader}>
<<<<<<< HEAD
          <ThemedText style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Tes programmes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/programs')}>
            <ThemedText style={[styles.seeAllText, { color: colors.accent }]}>Voir tout</ThemedText>
=======
          <ThemedText style={styles.sectionTitle}>Tes programmes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/programs')}>
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>Voir tout</ThemedText>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.programsScroll}>
          {workoutPrograms.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
<<<<<<< HEAD
            >
              <View
                style={[styles.programCardContent, ]}
              >
                <IconSymbol name={program.icon as any} size={40} color={colors.accent} />
                <ThemedText style={[styles.programName, { color: '#FFFFFF' }]}>{program.name}</ThemedText>
                <View style={styles.programDetails}>
                  <ThemedText style={[styles.programInfo, { color: '#FFFFFF' }]}>{program.duration}</ThemedText>
                  <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                  <ThemedText style={[styles.programInfo, { color: '#FFFFFF' }]}>{program.difficulty}</ThemedText>
                </View>
              </View>
=======
              //onPress={() => router.push(`/program/${program.id}`)}
            >
              <BlurView
                intensity={80}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={[styles.programCardContent, { backgroundColor: colors.secondary }]}
              >
                <IconSymbol name={program.icon as any} size={40} color={colors.primary} />
                <ThemedText style={styles.programName}>{program.name}</ThemedText>
                <View style={styles.programDetails}>
                  <ThemedText style={styles.programInfo}>{program.duration}</ThemedText>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <ThemedText style={styles.programInfo}>{program.difficulty}</ThemedText>
                </View>
              </BlurView>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/new-workout')}
          >
<<<<<<< HEAD
            <ThemedText style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Démarrer un entraînement</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard title="Calories" value={720} unit="kcal" />
            <StatCard title="Steps" value="10 000" unit="steps" />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="Sleep" value={7} unit="heures" />
            <StatCard title="Water" value={2} unit="litres" />
          </View>
        </View>
=======
            <ThemedText style={styles.actionButtonText}>Démarrer un entraînement</ThemedText>
          </TouchableOpacity>
        </View>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.7,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
  },
  programsScroll: {
    marginBottom: 30,
  },
  programCard: {
    width: 200,
    marginRight: 15,
  },
  programCardContent: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  programName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  programDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programInfo: {
    fontSize: 12,
    opacity: 0.7,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
<<<<<<< HEAD
    fontSize: 16,
    fontWeight: 'bold',
  },
 
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statsGrid: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statUnit: {
    fontSize: 14,
  },
  statCardNeed: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  
  
  
=======
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
});

import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WorkoutCalendar } from '@/components/WorkoutCalendar/index';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { getQuickStats } from '@/service/homeService';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

interface QuickStat {
  nombreSeances: number | undefined;
  TempsTotal: number;
  nombreExercices: number;
}

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
      try {
        const stats = await getQuickStats();
        setQuickStatsDB(stats);
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    }
    fetchData();
  }, []);
 
  const quickStats = [
    { title: 'Séances', value: quickStatsDB?.nombreSeances || 0, icon: 'flame.fill', color: colors.accent },
    { title: 'Temps total', value: quickStatsDB?.TempsTotal || 0, icon: 'clock.fill', color: colors.accent },
    { 
      title: 'Durée moyenne', 
      value: quickStatsDB?.nombreSeances && quickStatsDB?.TempsTotal
        ? Math.round((quickStatsDB.TempsTotal / quickStatsDB.nombreSeances) * 10) / 10 
        : 0,
      icon: 'chart.bar.fill', 
      color: colors.accent 
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.logo}>
          <Image
            source={require('../../assets/images/novoo_logo.png')}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <View>
            <ThemedText style={styles.welcomeText}>Bonjour,</ThemedText>
            <ThemedText style={styles.nameText}>Let's start your day</ThemedText>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: '#252525' }]}
            >
              <IconSymbol name={stat.icon as any} size={24} color={stat.color} />
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
            </View>
          ))}
        </View>

        <WorkoutCalendar
          sessions={{
            '2021-09-01': { type: 'full-body', completed: true },
            '2021-09-02': { type: 'upper-body', completed: true },
            '2021-09-03': { type: 'lower-body', completed: true },
            '2021-09-04': { type: 'full-body', completed: true },
            '2021-09-05': { type: 'upper-body', completed: true },
          }}
          onDayPress={(date) => console.log('Selected date:', date)}
        />

        {/* Workout Programs */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Tes programmes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/programs')}>
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>Voir tout</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.programsScroll}>
          {workoutPrograms.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => router.push(`/program/${program.id}`)}
            >
              <View
                style={[styles.programCardContent, { backgroundColor: '#252525' }]}
              >
                <IconSymbol name={program.icon as any} size={40} color={colors.primary} />
                <ThemedText style={styles.programName}>{program.name}</ThemedText>
                <View style={styles.programDetails}>
                  <ThemedText style={styles.programInfo}>{program.duration}</ThemedText>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <ThemedText style={styles.programInfo}>{program.difficulty}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/new-workout')}
          >
            <ThemedText style={styles.actionButtonText}>Démarrer un entraînement</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 30,
  },
  content: {
    padding: 20,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#0367FC',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  nameText: {
    fontSize: 16,
    opacity: 0.7,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
};

const StatCard = ({ title, value, unit }: StatCardProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
<<<<<<< HEAD
    <View style={styles.statCard}>
=======
    <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <View style={styles.statValueContainer}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        {unit && <ThemedText style={styles.statUnit}>{unit}</ThemedText>}
      </View>
    </View>
  );
};

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const currentDate = new Date();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>Statistiques</ThemedText>

      <ScrollView style={styles.content}>
        {/* Date Section */}
        <View style={styles.dateSection}>
          <ThemedText style={styles.dayText}>{days[currentDate.getDay()]}</ThemedText>
          <ThemedText style={styles.dateText}>
            {currentDate.getDate()} {months[currentDate.getMonth()]}
          </ThemedText>
        </View>

        {/* Weight Progress Section */}
        <View style={styles.weightSection}>
          <View style={styles.weightItem}>
            <ThemedText style={styles.weightLabel}>Start</ThemedText>
            <ThemedText style={styles.weightValue}>94<ThemedText style={styles.weightUnit}>kg</ThemedText></ThemedText>
          </View>
          <View style={styles.weightItem}>
            <ThemedText style={styles.weightLabel}>Current</ThemedText>
            <ThemedText style={styles.weightValue}>84<ThemedText style={styles.weightUnit}>kg</ThemedText></ThemedText>
          </View>
          <View style={styles.weightItem}>
            <ThemedText style={styles.weightLabel}>Target</ThemedText>
            <ThemedText style={styles.weightValue}>80<ThemedText style={styles.weightUnit}>kg</ThemedText></ThemedText>
          </View>
        </View>

        {/* Stats Grid */}
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

        {/* Workouts Section */}
<<<<<<< HEAD
        <View style={styles.workoutsSection}>
          <View style={styles.workoutsHeader}>
            <IconSymbol name="calendar" size={24} color={colors.accent} />
=======
        <View style={[styles.workoutsSection, { backgroundColor: colors.secondary }]}>
          <View style={styles.workoutsHeader}>
            <IconSymbol name="calendar" size={24} color={colors.primary} />
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
            <ThemedText style={styles.workoutsTitle}>Workouts</ThemedText>
          </View>
          <ThemedText style={styles.workoutsSubtitle}>Goal → 4 workouts/week</ThemedText>
          
          {/* Workout Progress Bars */}
          <View style={styles.progressBars}>
            {[4, 3, 2, 3, 2, 1].map((value, index) => (
              <View key={index} style={styles.progressBarContainer}>
<<<<<<< HEAD
                <View style={[styles.progressBar, { height: `${(value / 4) * 100}%` }]} />
=======
                <View style={[styles.progressBar, { 
                  height: `${(value / 4) * 100}%`,
                  backgroundColor: colors.primary 
                }]} />
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
                <ThemedText style={styles.progressBarLabel}>février</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition Section */}
<<<<<<< HEAD
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionHeader}>
            <ThemedText style={styles.nutritionTitle}>What I eat</ThemedText>
            <ThemedText style={[styles.seeAllText, { color: colors.accent }]}>see all</ThemedText>
=======
        <View style={[styles.nutritionSection, { backgroundColor: colors.secondary }]}>
          <View style={styles.nutritionHeader}>
            <ThemedText style={styles.nutritionTitle}>What I eat</ThemedText>
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>see all</ThemedText>
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
          </View>
          
          <View style={styles.nutritionStats}>
            <View style={styles.nutritionStat}>
              <ThemedText style={styles.nutritionLabel}>Prot</ThemedText>
              <ThemedText style={styles.nutritionValue}>100<ThemedText style={styles.nutritionUnit}>/110 g</ThemedText></ThemedText>
            </View>
            <View style={styles.nutritionStat}>
              <ThemedText style={styles.nutritionLabel}>Calories</ThemedText>
              <ThemedText style={styles.nutritionValue}>440<ThemedText style={styles.nutritionUnit}>/680 Cal</ThemedText></ThemedText>
            </View>
            <View style={styles.nutritionStat}>
              <ThemedText style={styles.nutritionLabel}>Water</ThemedText>
              <ThemedText style={styles.nutritionValue}>1.5<ThemedText style={styles.nutritionUnit}>/2.5 L</ThemedText></ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 20,
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  content: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 24,
  },
  dayText: {
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    fontSize: 16,
    opacity: 0.7,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  weightSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  weightValue: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  weightUnit: {
    fontSize: 16,
    opacity: 0.7,
    marginLeft: 4,
<<<<<<< HEAD
    color: "#FFFFFF",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
<<<<<<< HEAD
    color: "#000",
  },
  statCard: {
    backgroundColor: '#F5F5F5',
=======
  },
  statCard: {
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  statTitle: {
<<<<<<< HEAD
    color: "#000",
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    fontSize: 16,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  statUnit: {
    fontSize: 14,
    opacity: 0.7,
  },
  workoutsSection: {
<<<<<<< HEAD
    backgroundColor: '#F5F5F5',
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  workoutsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  workoutsSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  progressBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    alignItems: 'center',
    width: '14%',
  },
  progressBar: {
    width: '100%',
<<<<<<< HEAD
    backgroundColor: '#007AFF',
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  nutritionSection: {
<<<<<<< HEAD
    backgroundColor: '#F5F5F5',
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    borderRadius: 16,
    padding: 16,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
<<<<<<< HEAD
    color: '#007AFF',
  },
  nutritionStats: {
    gap: 16,
  },
  nutritionStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 16,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionUnit: {
    fontSize: 14,
    opacity: 0.7,
=======
  },
  nutritionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionStat: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionUnit: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 2,
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
  },
}); 
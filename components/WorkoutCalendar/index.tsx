import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type WorkoutSession = {
  type: string;
  completed: boolean;
};

type WorkoutCalendarProps = {
  sessions: { [key: string]: WorkoutSession };
  onDayPress: (date: string) => void;
};

export function WorkoutCalendar({ sessions, onDayPress }: WorkoutCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <BlurView
      intensity={80}
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>
          {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </ThemedText>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <IconSymbol name="chevron.right" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <ThemedText key={day} style={styles.dayLabel}>{day}</ThemedText>
        ))}
        {getDaysInMonth().map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.emptyDay} />;
          }

          const dateString = formatDate(date);
          const session = sessions[dateString];
          
          return (
            <TouchableOpacity
              key={dateString}
              style={[
                styles.day,
                session?.completed && styles.completed,
                session && !session.completed && styles.planned,
              ]}
              onPress={() => onDayPress(dateString)}
            >
              <ThemedText style={styles.dayNumber}>{date.getDate()}</ThemedText>
              {session && (
                <View style={[
                  styles.indicator,
                  { backgroundColor: session.completed ? colors.primary : colors.accent }
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayNumber: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  completed: {
    backgroundColor: 'rgba(36, 62, 244, 0.2)',
  },
  planned: {
    backgroundColor: 'rgba(221, 235, 89, 0.2)',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
}); 
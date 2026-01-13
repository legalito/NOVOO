import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { saveUserData } from '@/service/userService';
import { auth } from '@/service/firebase';

type FormData = {
  name?: string;
  age?: string;
  gender?: string;
  goal?: string;
  experience?: string;
  height?: string;
  weight?: string;
  frequency?: string;
  preferredTime?: string;
  equipment?: string[];
  injuries?: string;
};

type Step = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  fields: Array<{
    key: keyof FormData;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'button';
    options?: string[];
  }>;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Bienvenue sur TrainMuscle",
    subtitle: "L'app qui va t'aider à atteindre tes objectifs",
    icon: "figure.walk",
    fields: [
    ]
  },
  {
    id: 2,
    title: "Ton profil physique",
    subtitle: "Pour personnaliser ton programme",
    icon: "figure.stand",
    fields: [
      { key: 'height', label: 'Ta taille (cm)', type: 'number' },
      { key: 'weight', label: 'Ton poids (kg)', type: 'number' },
      { key: 'injuries', label: 'As-tu des blessures ?', type: 'text' }
    ]
  },
  {
    id: 3,
    title: "Tes objectifs",
    subtitle: "Que souhaites-tu accomplir ?",
    icon: "trophy.fill",
    fields: [
      { key: 'goal', label: 'Objectif principal', type: 'select', options: [
        'Prise de masse',
        'Perte de gras',
        'Force',
        'Endurance',
        'Santé générale'
      ]},
      { key: 'experience', label: 'Niveau en musculation', type: 'select', options: [
        'Débutant',
        'Intermédiaire',
        'Avancé'
      ]}
    ]
  },
  {
    id: 4,
    title: "Ta routine",
    subtitle: "Organisons ton planning",
    icon: "calendar",
    fields: [
      { key: 'frequency', label: 'Fréquence d\'entraînement', type: 'select', options: [
        '2-3 fois par semaine',
        '3-4 fois par semaine',
        '4-5 fois par semaine',
        '6+ fois par semaine'
      ]},
      { key: 'preferredTime', label: 'Moment préféré', type: 'select', options: [
        'Matin',
        'Midi',
        'Après-midi',
        'Soir'
      ]},
      { key: 'equipment', label: 'Équipement disponible', type: 'select', options: [
        'Salle de sport',
        'Matériel à domicile',
        'Poids libres uniquement',
        'Pas d\'équipement'
      ]}
    ]
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const colorScheme = useColorScheme();

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    console.log('Button clicked, current step:', currentStep);
    
    if (currentStep < STEPS.length - 1) {
      console.log('Moving to next step');
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Completing onboarding');
      
      // Sauvegarder les données et rediriger vers l'app principale
      const userId = auth.currentUser?.uid; // Obtenir l'ID de l'utilisateur
      const userData = {
        name: formData.name || null,
        age: formData.age || null,
        gender: formData.gender || null,
        goal: formData.goal || null,
        experience: formData.experience || null,
        height: formData.height || null,
        weight: formData.weight || null,
        frequency: formData.frequency || null,
        preferredTime: formData.preferredTime || null,
        equipment: formData.equipment || null,
        injuries: formData.injuries || null,
      };

      try {
        await saveUserData(userData); // Enregistrer les données utilisateur
        router.replace('/(tabs)/prog'); // Rediriger vers le tableau de bord
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field: Step['fields'][0]) => {
    if (field.type === 'button') {
      return (
        <TouchableOpacity
          style={[styles.input, { backgroundColor: '#007AFF' }]}
          onPress={() => handleInputChange(field.key, 'clicked')}
        >
          <ThemedText style={{ color: '#FFFFFF', textAlign: 'center' }}>
            {field.label}
          </ThemedText>
        </TouchableOpacity>
      );
    }
    if (field.type === 'select' && field.options) {
      return (
        <View style={styles.selectContainer}>
          {field.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.selectOption,
                formData[field.key] === option && styles.selectOptionSelected
              ]}
              onPress={() => handleInputChange(field.key, option)}
            >
              <ThemedText style={[
                styles.selectOptionText,
                formData[field.key] === option && styles.selectOptionTextSelected
              ]}>
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        placeholder={field.label}
        placeholderTextColor={colorScheme === 'dark' ? '#ffffff80' : '#00000080'}
        style={[
          styles.input,
          { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }
        ]}
        value={formData[field.key]}
        onChangeText={(value) => handleInputChange(field.key, value)}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {STEPS.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted
              ]}
            />
          ))}
        </View>

        {/* Current Step Content */}
        <Animated.View
          entering={FadeInRight}
          exiting={FadeOutLeft}
          key={currentStep}
          style={styles.stepContainer}
        >
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.stepContent}
          >
            <IconSymbol
              name={STEPS[currentStep].icon as any}
              size={60}
              color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
              style={styles.stepIcon}
            />
            <ThemedText style={styles.stepTitle}>
              {STEPS[currentStep].title}
            </ThemedText>
            <ThemedText style={styles.stepSubtitle}>
              {STEPS[currentStep].subtitle}
            </ThemedText>
            <View style={styles.fieldsContainer}>
              {STEPS[currentStep].fields.map(field => (
                <View key={field.key} style={styles.fieldWrapper}>
                  <ThemedText style={styles.fieldLabel}>{field.label}</ThemedText>
                  {renderField(field)}
                </View>
              ))}
            </View>
          </BlurView>
        </Animated.View>

        {/* Navigation Buttons - Nouvelle structure */}
        <View style={styles.buttonsContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.backButton]}
              onPress={handleBack}
            >
              <ThemedText style={styles.backButtonText}>Retour</ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentStep === STEPS.length - 1 ? 'Terminer' : 'Suivant'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.9)',
      android: 'rgba(255, 255, 255, 0.95)',
    }),
    paddingBottom: 150,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: 40,
    }),
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: '#34C759',
  },
  stepContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minHeight: Platform.select({
      ios: '80%',
      android: '85%',
    }),
    justifyContent: 'center',
  },
  stepIcon: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldsContainer: {
    width: '100%',
    gap: 20,
  },
  fieldWrapper: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.1)',
      android: 'rgba(255, 255, 255, 0.05)',
    }),
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectOptionSelected: {
    backgroundColor: '#007AFF',
  },
  selectOptionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  selectOptionTextSelected: {
    color: '#FFFFFF',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.8)',
      android: 'rgba(255, 255, 255, 0.9)',
    }),
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
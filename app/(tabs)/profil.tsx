import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, type IconSymbolName } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type SettingItemProps = {
  title: string;
  onPress: () => void;
};

const SettingItem = ({ title, onPress }: SettingItemProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getIconForTitle = (title: string): IconSymbolName => {
    const iconMap: { [key: string]: IconSymbolName } = {
      'Profil': 'person.circle.fill',
      'Compte': 'gear',
      'Gérer l\'abonnement': 'star',
      'Notifications': 'bell.fill',
      'Entrainements': 'dumbbell.fill',
      'Confidentialité et réseaux sociaux': 'lock.shield',
      'Unités': 'ruler',
      'Langue': 'globe',
      'Intégrations': 'link',
      'Thème': 'paintbrush',
      'Exporter et importer des données': 'arrow.up.doc',
      'Guide de démarrage': 'book',
      'Aide de routine': 'book',
      'Faire aux questions': 'questionmark.circle',
      'Nous contacter': 'envelope.fill',
      'Evaluer': 'star',
      'À propos': 'info.circle',
      'Découvrir': 'person.2',
    };
    return iconMap[title] || 'gear';
  };

  return (
    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.background, backgroundColor: colors.background }]} onPress={onPress}>
      <View style={styles.settingContent}>
        <IconSymbol name={getIconForTitle(title)} size={24} color={colors.accent} />
        <ThemedText style={[styles.settingText, { color: '#FFFFFF' }]}>{title}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={24} color={colors.accent} />
    </TouchableOpacity>
  );
};

const SectionTitle = ({ title }: { title: string }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <ThemedText style={[styles.sectionTitle, { color: '#FFFFFF' }]}>{title}</ThemedText>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={[styles.profileImage, { backgroundColor: colors.accent }]}>
          <IconSymbol name="person.circle.fill" size={60} color={colors.primary} />
        </View>
        <ThemedText style={[styles.welcomeText, { color: '#FFFFFF' }]}>Hello Hugo !</ThemedText>
        <ThemedText style={[styles.subtitleText, { color: '#FFFFFF' }]}>Let's start your day</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Compte Section */}
        <SectionTitle title="Compte" />
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <SettingItem title="Profil" onPress={() => {}} />
          <SettingItem title="Compte" onPress={() => {}} />
          <SettingItem title="Gérer l'abonnement" onPress={() => {}} />
          <SettingItem title="Notifications" onPress={() => {}} />
        </View>

        {/* Préférences Section */}
        <SectionTitle title="Préférences" />
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <SettingItem title="Entrainements" onPress={() => {}} />
          <SettingItem title="Confidentialité et réseaux sociaux" onPress={() => {}} />
          <SettingItem title="Unités" onPress={() => {}} />
          <SettingItem title="Langue" onPress={() => {}} />
          <SettingItem title="Intégrations" onPress={() => {}} />
          <SettingItem title="Thème" onPress={() => {}} />
          <SettingItem title="Exporter et importer des données" onPress={() => {}} />
        </View>

        {/* Tutoriels Section */}
        <SectionTitle title="Tutoriels" />
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <SettingItem title="Guide de démarrage" onPress={() => {}} />
          <SettingItem title="Aide de routine" onPress={() => {}} />
        </View>

        {/* Aide Section */}
        <SectionTitle title="Aide" />
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <SettingItem title="Faire aux questions" onPress={() => {}} />
          <SettingItem title="Nous contacter" onPress={() => {}} />
          <SettingItem title="Evaluer" onPress={() => {}} />
          <SettingItem title="À propos" onPress={() => {}} />
        </View>

        {/* Coach Section */}
        <SectionTitle title="Coach" />
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <SettingItem title="Découvrir" onPress={() => {}} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.detail }]}
          onPress={() => router.push('/')}
        >
          <ThemedText style={[styles.logoutText, { color: colors.secondary }]}>Se déconnecter</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  section: {
    borderRadius: 12,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
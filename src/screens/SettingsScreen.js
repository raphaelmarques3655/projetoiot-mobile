
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <Text style={styles.headerSubtitle}>
          Informações do Projeto
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons
            name="school-outline"
            size={40}
            color="#0284C7"
            style={styles.icon}
          />

          <Text style={styles.title}>Projeto IoT Mobile</Text>

          <Text style={styles.subtitle}>
            Desenvolvido para a disciplina de IoT
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="server-outline"
              size={20}
              color="#64748B"
            />
            <Text style={styles.infoText}>
              API: http://10.137.11.6
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="code-slash-outline"
              size={20}
              color="#64748B"
            />
            <Text style={styles.infoText}>
              React Native + Expo
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
});

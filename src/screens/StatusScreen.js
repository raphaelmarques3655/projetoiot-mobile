
import React, { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import SensorCard from '../components/SensorCard';

export default function StatusScreen({
  sensores = [],
  onToggle,
  refreshing,
  onRefresh,
  erro,
}) {
  const [filtro, setFiltro] = useState('ativos');

  const sensoresExibidos = sensores.filter((sensor) =>
    filtro === 'ativos'
      ? sensor.status === 1
      : sensor.status === 0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <Text style={styles.headerSubtitle}>
          Filtro de Sensores
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'ativos' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('ativos')}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={filtro === 'ativos' ? '#FFFFFF' : '#10B981'}
          />
          <Text
            style={[
              styles.filterText,
              filtro === 'ativos' && styles.filterTextActive,
            ]}
          >
            Ativos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'desativados' &&
              styles.filterButtonInactive,
          ]}
          onPress={() => setFiltro('desativados')}
        >
          <Ionicons
            name="close-circle-outline"
            size={20}
            color={
              filtro === 'desativados' ? '#FFFFFF' : '#EF4444'
            }
          />
          <Text
            style={[
              styles.filterText,
              filtro === 'desativados' &&
                styles.filterTextActive,
            ]}
          >
            Desativados
          </Text>
        </TouchableOpacity>
      </View>

      {erro ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{erro}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRefresh}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={sensoresExibidos}
        keyExtractor={(item, index) =>
          String(item.codigo ?? index)
        }
        renderItem={({ item }) => (
          <SensorCard item={item} onToggle={onToggle} />
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="hardware-chip-outline"
              size={48}
              color="#CBD5E1"
            />
            <Text style={styles.emptyText}>
              {erro
                ? 'Não foi possível carregar os sensores.'
                : `Nenhum sensor ${
                    filtro === 'ativos' ? 'ativo' : 'desativado'
                  } no momento.`}
            </Text>
          </View>
        }
      />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterButtonInactive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#0284C7',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
});

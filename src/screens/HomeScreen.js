
import React, { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import SensorCard from '../components/SensorCard';

export default function HomeScreen({
  sensores = [],
  onToggle,
  refreshing,
  onRefresh,
  erro,
}) {
  const [searchText, setSearchText] = useState('');

  const sensoresFiltrados = sensores.filter((sensor) =>
    String(sensor.codigo ?? '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel IoT</Text>
        <Text style={styles.headerSubtitle}>
          Visão Geral dos Sensores
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#94A3B8"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar sensor (ex: S1, S2...)"
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText !== '' && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                Keyboard.dismiss();
              }}
              accessibilityLabel="Limpar busca"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          )}
        </View>
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
        data={sensoresFiltrados}
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
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={48}
              color="#CBD5E1"
            />
            <Text style={styles.emptyText}>
              {erro
                ? 'Não foi possível carregar os sensores.'
                : 'Nenhum sensor encontrado.'}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
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

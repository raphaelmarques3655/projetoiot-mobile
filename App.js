
import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getSensores, atualizarStatus } from './api';

import HomeScreen from './src/screens/HomeScreen';
import StatusScreen from './src/screens/StatusScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function normalizarSensores(dados) {
  if (!Array.isArray(dados)) return [];

  return dados
    .filter((sensor) => sensor && sensor.codigo != null)
    .map((sensor) => ({
      ...sensor,
      codigo: String(sensor.codigo),
      tipo: String(sensor.tipo ?? 'Sensor'),
      status:
        sensor.status === true ||
        sensor.status === 1 ||
        sensor.status === '1'
          ? 1
          : 0,
    }));
}

function ConteudoApp() {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const carregarSensores = useCallback(async () => {
    setErro('');

    try {
      const dados = await getSensores();
      setSensores(normalizarSensores(dados));
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      setErro(
        'Não foi possível carregar os sensores. Verifique a API e a rede.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarSensores();
  }, [carregarSensores]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarSensores();
  }, [carregarSensores]);

  const toggleStatus = useCallback(
    async (codigo, statusAtual) => {
      const statusAnterior = statusAtual;
      const novoStatus = statusAtual !== 1;
      const codigoTexto = String(codigo);

      setSensores((anteriores) =>
        anteriores.map((sensor) =>
          sensor.codigo === codigoTexto
            ? { ...sensor, status: novoStatus ? 1 : 0 }
            : sensor
        )
      );

      try {
        await atualizarStatus(codigo, novoStatus);
        setErro('');
      } catch (error) {
        console.error('Erro ao atualizar status:', error);

        setSensores((anteriores) =>
          anteriores.map((sensor) =>
            sensor.codigo === codigoTexto
              ? { ...sensor, status: statusAnterior }
              : sensor
          )
        );

        setErro('Não foi possível atualizar o status do sensor.');
      }
    },
    []
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>
          Conectando ao servidor...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ellipse-outline';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Status') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Sobre') {
              iconName = focused
                ? 'information-circle'
                : 'information-circle-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },

          tabBarActiveTintColor: '#0284C7',
          tabBarInactiveTintColor: '#94A3B8',

          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Home">
          {() => (
            <HomeScreen
              sensores={sensores}
              onToggle={toggleStatus}
              refreshing={refreshing}
              onRefresh={onRefresh}
              erro={erro}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Status">
          {() => (
            <StatusScreen
              sensores={sensores}
              onToggle={toggleStatus}
              refreshing={refreshing}
              onRefresh={onRefresh}
              erro={erro}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Sobre"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ConteudoApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});

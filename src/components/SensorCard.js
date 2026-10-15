
import React, { useState } from 'react';

import {
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { visualizarStatus } from '../../api';

export default function SensorCard({ item, onToggle }) {
  const isLigado = item.status === 1;

  const [consultando, setConsultando] = useState(false);
  const [statusConsultado, setStatusConsultado] = useState(null);
  const [erroConsulta, setErroConsulta] = useState('');

  const getIconByType = (tipo) => {
    switch (String(tipo ?? '').toLowerCase()) {
      case 'luminosidade':
        return 'sunny-outline';
      case 'umidade':
        return 'water-outline';
      case 'temperatura':
        return 'thermometer-outline';
      case 'infravermelho':
        return 'radio-outline';
      case 'rfid':
        return 'card-outline';
      default:
        return 'hardware-chip-outline';
    }
  };

  const consultarStatus = async () => {
    setConsultando(true);
    setErroConsulta('');

    try {
      const resposta = await visualizarStatus(item.codigo);

      if (
        !resposta ||
        ![0, 1, '0', '1', true, false].includes(resposta.status)
      ) {
        throw new Error('A API retornou um status inválido.');
      }

      const status = (
        resposta.status === 1 ||
        resposta.status === '1' ||
        resposta.status === true
      ) ? 1 : 0;

      setStatusConsultado(status);
    } catch (error) {
      console.error(
        `Erro ao consultar o sensor ${item.codigo}:`,
        error
      );

      setStatusConsultado(null);
      setErroConsulta('Falha ao consultar. Tente novamente.');
    } finally {
      setConsultando(false);
    }
  };

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isLigado ? '#E0F2FE' : '#F1F5F9',
          },
        ]}
      >
        <Ionicons
          name={getIconByType(item.tipo)}
          size={24}
          color={isLigado ? '#0284C7' : '#94A3B8'}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.codigo}>{item.codigo}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>

        <Text
          style={[
            styles.statusText,
            { color: isLigado ? '#10B981' : '#EF4444' },
          ]}
        >
          {isLigado ? 'ON' : 'OFF'}
        </Text>
      </View>

      <View style={styles.controls}>
        <Switch
          trackColor={{
            false: '#E2E8F0',
            true: '#A7F3D0',
          }}
          thumbColor={isLigado ? '#10B981' : '#F8FAFC'}
          ios_backgroundColor="#E2E8F0"
          value={isLigado}
          onValueChange={() => onToggle(item.codigo, item.status)}
          accessibilityLabel={`Ativar ou desativar sensor ${item.codigo}`}
        />

        <Pressable
          onPress={consultarStatus}
          disabled={consultando}
          style={({ pressed }) => [
            styles.viewButton,
            pressed && styles.viewButtonPressed,
            consultando && styles.viewButtonDisabled,
          ]}
        >
          {consultando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name="eye-outline"
              size={17}
              color="#FFFFFF"
            />
          )}

          <Text style={styles.viewButtonText}>
            {consultando ? 'Consultando' : 'Visualizar status'}
          </Text>
        </Pressable>

        {statusConsultado !== null && (
          <Text
            style={[
              styles.resultText,
              {
                color: statusConsultado === 1 ? '#059669' : '#DC2626',
              },
            ]}
          >
            API: {statusConsultado === 1 ? 'Ligado' : 'Desligado'}
          </Text>
        )}

        {erroConsulta !== '' && (
          <Text style={styles.errorText}>{erroConsulta}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    minWidth: 60,
  },
  codigo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  tipo: {
    fontSize: 13,
    color: '#64748B',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },
  controls: {
    alignItems: 'flex-end',
    gap: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  viewButtonPressed: {
    opacity: 0.8,
  },
  viewButtonDisabled: {
    opacity: 0.6,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    textAlign: 'right',
  },
});

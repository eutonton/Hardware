import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const { latitude, longitude } = location.coords;

      // Fazendo requisição para a API local
      try {
        const response = await fetch(
          `http://localhost:3000/endereco?latitude=${latitude}&longitude=${longitude}`
        );
        const data = await response.json();

        if (data.endereco) {
          setAddress(data.endereco);
        } else {
          setAddress('Endereço não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        setAddress('Erro ao buscar endereço.');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização Atual:</Text>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text style={styles.coords}>
            Latitude: {location.coords.latitude.toFixed(6)}, Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.address}>Endereço: {address}</Text>
        </>
      ) : (
        <Text>Carregando localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
  coords: {
    marginTop: 10,
    fontSize: 16,
  },
  address: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

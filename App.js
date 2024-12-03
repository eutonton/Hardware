import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      
      let geocodedAddress = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocodedAddress.length > 0) {
        setAddress(geocodedAddress[0]); 
      }
    })();
  }, []);

  let locationText = 'Aguardando localização...';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`;
  }

  let addressText = 'Aguardando endereço...';
  if (address) {
    addressText = `${address.street}, ${address.streetNumber}\n${address.city} - ${address.region}, ${address.postalCode}\n${address.country}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização Atual</Text>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{locationText}</Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>Endereço:</Text>
        <Text style={styles.addressDetails}>{addressText}</Text>
      </View>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  locationContainer: {
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3d9ff',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  addressContainer: {
    padding: 15,
    backgroundColor: '#eafbe7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c1eac2',
    marginBottom: 20,
  },
  addressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addressDetails: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

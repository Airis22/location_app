/* import { getCurrentPositionAsync, LocationObject, useForegroundPermissions } from "expo-location";
import { router } from "expo-router";
import { auth, firebase_db } from '@/lib/firebase'
import { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import MapView, { Camera, Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

export function LocationView() {
  const [permission, requestPermission] = useForegroundPermissions();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function showLocation() {
      if (!location || !mapRef.current) return;
      const camera = await mapRef.current.getCamera();
      camera.center = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      camera.zoom = 15;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
    showLocation();
  }, [location]);

  const date = new Date();

  const iniciarSesion = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, "icemalu22@gmail.com", "holamundo");
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  };

  async function agregarDatos() {
    if (!location) {
      Alert.alert("Error:", "No se ha podido obtener la ubicación.");
      return;
    }
    try {
      const docRef = await addDoc(collection(firebase_db, "locations"), {
        fecha: date,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert("Documento agregado con ID:", docRef.id);
    } catch (e) {
      Alert.alert("Error al agregar documento:", String(e));
    }
  }

  useEffect(() => {
    async function getCurrentLocation() {
      if (permission?.granted) {
        const user = await iniciarSesion();
        if (!user) {
          Alert.alert("Error:", "No se pudo autenticar al usuario.");
          return;
        }
        const result = await getCurrentPositionAsync();
        setLocation(result);
      }
    }
    getCurrentLocation();
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.permission}>
        <Text style={styles.text}>Debes permitir el acceso a la ubicación</Text>
        <Button onPress={requestPermission} title="Permitir ubicación" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ubicationLabel}>UBICACIÓN</Text>
      <View style={styles.locationTex}>
        <View>
          <Text>{`Latitud: ${location?.coords?.latitude ?? 'N/A'}`}</Text>
          <Text>{`Longitud: ${location?.coords?.longitude ?? 'N/A'}`}</Text>
        </View>
        <TouchableOpacity style={styles.buttonhistori} onPress={() => router.push("/history")}>
          <MaterialIcons name="history-toggle-off" size={48} color="black" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 18.5955558,
          longitude: -98.4907685,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomEnabled
      >
        {location && (
          <Marker
            coordinate={location.coords}
            pinColor="green"
            title="Posición actual"
            description={`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { width: '100%', height: '100%' },
  ubicationLabel: { textAlign: 'center', fontSize: 20, color: 'red', fontWeight: 'bold' },
  locationTex: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    bottom: 10,
    padding: 10,
    position: "absolute",
    left: 20,
    zIndex: 50,
    flexDirection: "row",
    gap: 60,
  },
  buttonhistori: {
    alignItems: "center",
    justifyContent: "center",
  },
  permission: { alignItems: "center", width: "100%", justifyContent: "center", gap: 7, flex: 1 },
  text: { fontFamily: "monospace", fontWeight: "800" },
});
 */

import { getCurrentPositionAsync, LocationObject, useForegroundPermissions } from "expo-location";
import { router } from "expo-router";
import { auth, firebase_db } from '@/lib/firebase';
import { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import MapView, { Camera, Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

export function LocationView() {
  const [permission, requestPermission] = useForegroundPermissions();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    async function showLocation() {
      if (!location || !mapRef.current) return;
      const camera = await mapRef.current.getCamera();
      camera.center = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      camera.zoom = 15;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
    showLocation();
  }, [location]);

  const iniciarSesion = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, "icemalu22@gmail.com", "holamundo");
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  };

  useEffect(() => {
    async function getCurrentLocationAndSave() {
      if (permission?.granted) {
        const user = await iniciarSesion();
        if (!user) {
          Alert.alert("Error:", "No se pudo autenticar al usuario.");
          return;
        }

        const result = await getCurrentPositionAsync();
        setLocation(result);

        // GUARDAR AUTOMÁTICAMENTE AL INICIAR
        try {
          const date = new Date();
          await addDoc(collection(firebase_db, "locations"), {
            fecha: date,
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          });
          console.log("Ubicación guardada automáticamente al iniciar.");
        } catch (e) {
          console.error("Error al guardar ubicación:", e);
        }
      }
    }
    getCurrentLocationAndSave();
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.permission}>
        <Text style={styles.text}>Debes permitir el acceso a la ubicación</Text>
        <Button
          onPress={requestPermission}
          title="Permitir ubicación"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ubicationLabel}>UBICACIÓN</Text>
      <View style={styles.locationText}>
        <View>
          <Text>{`Latitud: ${location?.coords?.latitude ?? 'N/A'}`}</Text>
          <Text>{`Longitud: ${location?.coords?.longitude ?? 'N/A'}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonHistory}
          onPress={() => router.push("/history")}
        >
          <MaterialIcons
            name="history-toggle-off"
            size={48}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <MapView
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        initialRegion={{
          latitude: 18.5955558,
          longitude: -98.4907685,
          latitudeDelta: 0.00005,
          longitudeDelta: 0.00005,
        }}
        initialCamera={{
          center: {
            latitude: 18.5955558,
            longitude: -98.4907685,
          },
          pitch: 20,
          heading: 90,
          altitude: 1000,
          zoom: 10,
        }}
        zoomControlEnabled
        pitchEnabled
        zoomEnabled
        zoomTapEnabled
      >
        {location && (
          <Marker
            coordinate={location.coords}
            pinColor="green"
            title="Posición actual"
            description={`Lon: ${location.coords.longitude || ""}, Lat: ${location.coords.latitude || ""}`}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 40
  },
  map: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  ubicationLabel: {
    textAlign: 'center',
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  locationText: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    bottom: 10,
    padding: 10,
    position: "absolute",
    left: 20,
    zIndex: 50,
    flexDirection: "row",
    gap: 60,
  },
  buttonHistory: {},
  permission: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    gap: 7,
    flex: 1,
  },
  text: {
    fontFamily: "monospace",
    fontWeight: "800",
  },
});

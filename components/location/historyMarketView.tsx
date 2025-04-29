import { firebase_db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Camera, Marker } from "react-native-maps";
import { LocationType } from "./entities/log";

export function HistoryMarkersView() {
  const mapRef = useRef<MapView>(null);
  const [marks, setMarks] = useState<LocationType[]>([]);

  const getLocations = () => {
    const q = query(collection(firebase_db, "locations"));
    return onSnapshot(q, (querySnapshot) => {
      const records: LocationType[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          date: data.fecha,
        };
      });
      setMarks(records);
    });
  };

  useEffect(() => {
    async function showLocation() {
      if (!marks.length || !mapRef.current) return;
      const camera = await mapRef.current.getCamera();
      camera.center = {
        latitude: marks[0].latitude,
        longitude: marks[0].longitude,
      };
      camera.zoom = 10;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
    showLocation();
  }, [marks]);

  useEffect(() => {
    const unsubscribe = getLocations();
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.margen}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: 18.5955558,
          longitude: -98.4907685,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        style={styles.map}
      >
        {marks.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="red"
            title="Marca"
            description={`Lat: ${location.latitude}, Lon: ${location.longitude}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  margen: {
    flex: 1,
    backgroundColor: "pink",
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

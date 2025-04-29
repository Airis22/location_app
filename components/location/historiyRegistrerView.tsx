import { auth, firebase_db } from "@/lib/firebase";
import { collection, deleteDoc, doc, onSnapshot, query, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { LocationType } from "./entities/log";
import { Timestamp } from "firebase/firestore";

export function HistoryRegistrerView() {
  const [marks, setMarks] = useState<LocationType[]>([]);

  const getLocations = (uid: string) => {
    const q = query(collection(firebase_db, "locations"), limit(15));
    return onSnapshot(q, (querySnapshot) => {
      const records: LocationType[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const fechaFirebase = data.fecha as Timestamp;
        return {
          id: doc.id,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          date: fechaFirebase.toDate(),
        };
      });
      setMarks(records);
    });
  };

  const borrarDocumento = async (documentId: string) => {
    try {
      const documentRef = doc(firebase_db, "locations", documentId);
      await deleteDoc(documentRef);
      setMarks(marks.filter((item) => item.id !== documentId));
      Alert.alert("Documento borrado correctamente!");
    } catch (error) {
      console.error("Error al borrar el documento:", error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribe = getLocations(user.uid);
        return unsubscribe;
      } else {
        setMarks([]);
        Alert.alert("No hay un usuario autenticado");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const renderLogs = ({ item }: { item: LocationType }) => (
    <TouchableOpacity style={styles.row} onLongPress={() => borrarDocumento(item.id)}>
      <Text style={styles.cell}>{item.date.toLocaleString()}</Text>
      <Text style={styles.cell}>{item.latitude.toFixed(5) || "Desconocido"}</Text>
      <Text style={styles.cell}>{item.longitude.toFixed(5) || "Desconocido"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.margen}>
      <Text style={styles.title}>Historial</Text>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.header]}>Fecha</Text>
          <Text style={[styles.cell, styles.header]}>Latitud</Text>
          <Text style={[styles.cell, styles.header]}>Longitud</Text>
        </View>
        <FlatList
          data={marks}
          renderItem={renderLogs}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  margen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 100,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f1f1f1",
  },
  container: {
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 12,
    overflow: "hidden",
    width: "95%",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 0,
    color: "black",
  },
});

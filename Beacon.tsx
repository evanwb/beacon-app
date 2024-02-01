import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { generateRandomBeaconInfo, BeaconInfo, MarkerInfo } from "./util";
import MapView, { Details, Marker, Region } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

const Beacon = () => {
  const [id, setId] = useState("");
  const [avail, setAvail] = useState<number[]>([]);
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);

  useEffect(() => {
    (async () => {
      const res = await generateRandomBeaconInfo();
      console.log(res);
      setId(`${res.id}`);
      res.available[res.id] = 1;
      setAvail(res.available);
      setMarkers(res.markers);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 10,
        }}
      >
        <Text style={styles.topText}>Beacon ID: {id}</Text>
        <Text style={styles.topText}>Battery: 96%</Text>
      </View>

      <Text style={styles.centeredText}>Available Beacons</Text>
      <View>
        {avail.map((up, idx) => {
          return (
            <View
              key={idx}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons
                name={up > 0 ? "wifi" : "wifi-outline"}
                size={20}
                color={up > 0 ? "blue" : "black"}
              />
              <Text style={{}}>{`Beacon ${idx} is ${
                up > 0 ? `available` : "not available"
              } `}</Text>
            </View>
          );
        })}
      </View>
      <View style={{ padding: 10 }} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.5,
          longitude: -80.8,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
        onRegionChange={(region: Region, details: Details) => {
          //console.log(region, details);
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            pinColor="blue"
            key={index}
            coordinate={marker.coord}
            title={marker.title}
            description={marker.desc}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
  },
  centeredText: {
    fontSize: 22,
    textAlign: "center",
    margin: 10,
  },
  topText: {
    fontSize: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Beacon;

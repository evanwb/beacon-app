import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { generateRandomBeaconInfo, BeaconInfo, MarkerInfo } from "./util";
import MapView, { Details, Marker, Region } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";

const Beacon = () => {
  const [id, setId] = useState("");
  const [avail, setAvail] = useState<number[]>([]);
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [location, setLocation] = useState("");
  const [area, setArea] = useState({
    minLat: 0,
    minLon: 0,
    latDelta: 0,
    lonDelta: 0,
  });

  useEffect(() => {
    (async () => {
      const c = await Location.getLastKnownPositionAsync();
      const lat = c?.coords.latitude ?? 0;
      const lon = c?.coords.longitude ?? 0;
      let ms = [];
      setMarkers((m) => [
        ...m,
        {
          coord: {
            latitude: lat,
            longitude: lon,
          },
          desc: "",
          title: "You",
        },
      ]);
      const res = await generateRandomBeaconInfo({
        lat: lat,
        lon: lon,
      });
      setId(`${res.id}`);
      res.available[res.id] = 1;
      setAvail(res.available);
      setMarkers((m) => {
        ms = [...m, ...res.markers];
        return [...m, ...res.markers];
      });

      const findMinMaxLatLon = (markerList: MarkerInfo[]) => {
        if (markerList.length === 0) {
          return {
            minLat: 0,
            maxLat: 0,
            minLon: 0,
            maxLon: 0,
          }; // Return null for an empty list
        }

        let minLat = markerList[0].coord.latitude;
        let maxLat = markerList[0].coord.latitude;
        let minLon = markerList[0].coord.longitude;
        let maxLon = markerList[0].coord.longitude;

        for (const marker of markerList) {
          const { latitude, longitude } = marker.coord;

          // Update minimum and maximum values
          minLat = Math.min(minLat, latitude);
          maxLat = Math.max(maxLat, latitude);
          minLon = Math.min(minLon, longitude);
          maxLon = Math.max(maxLon, longitude);
        }

        console.log(minLat, maxLat, minLon, maxLon);
        return {
          minLat,
          latDelta: 3 * Math.abs(minLat - maxLat),
          minLon,
          lonDelta: 3 * Math.abs(minLon - maxLon),
        };
      };

      setArea(findMinMaxLatLon(ms));
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
        region={{
          latitude: area.minLat - 0.01,
          longitude: area.minLon + 0.02,
          latitudeDelta: area.latDelta,
          longitudeDelta: area.lonDelta,
        }}
        onRegionChange={(region: Region, details: Details) => {
          console.log(region, area);
        }}
        reg
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

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  generateRandomBeaconInfo,
  BeaconInfo,
  MarkerInfo,
  getBeaconInfo,
  scan,
} from "./util";
import MapView, { Details, Marker, Region } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import Header from "./Header";

const Beacon = ({ navigation }) => {
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    // Set refreshing to true to show the refresh indicator
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);
  const getData = async () => {
    const res = await getBeaconInfo(); //await generateRandomBeaconInfo({
    //   lat: lat,
    //   lon: lon,
    // });
    if (!res) {
      setId("N/A");
      return;
    }
    //Alert.alert("Beacon Info", res.available);
    setId(`${res.id}`);
    //res.available[res.id] = '1';
    setAvail(res.available);
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
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

      ms.push({
        coord: {
          latitude: lat,
          longitude: lon,
        },
        desc: "",
        title: "You",
      });

      await getData();

      // setMarkers((m) => {
      //   ms = [...m, ...res.markers];
      //   return [...m, ...res.markers];
      // });

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
      <Header text="Beacon" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 10,
        }}
      >
        <Text style={styles.topText}>Beacon ID: {id}</Text>
        <View style={{ flexDirection: "row" }}>
          <Button
            color="gray"
            title="Scan"
            onPress={async () => {
              console.log(await scan());
              setTimeout(() => {
                getData();
              }, 3000);
            }}
          />
          <Button
            color="gray"
            title="Reload"
            onPress={async () => {
              await getData();
            }}
          />
        </View>
        {/* <Text style={styles.topText}>Battery: 96%</Text> */}
      </View>

      <Text style={styles.centeredText}>Available Beacons</Text>
      <View>
        {avail.length == 0 ? (
          <View>
            <Text>No available beacons, are you connected?</Text>
            {/* <Button title="Reload" onPress={getData} /> */}
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["gray"]} // Android colors for the refresh indicator
              />
            }
          >
            {avail.map((up, idx) => {
              return (
                <View
                  key={idx}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Ionicons
                    name={(up & 0x1) > 0 ? "wifi" : "wifi-outline"}
                    size={20}
                    color={(up & 0x1) > 0 ? "blue" : "lightgray"}
                  />
                  <Text>{`Beacon ${idx} is ${
                    id === `${idx}`
                      ? "you"
                      : (up & 0x1) > 0
                      ? `available`
                      : "not available"
                  } ${up >> 8 != 0 ? `${up >> 8}dBm` : ""}`}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      <View style={{ padding: 10 }} />
      {/* <MapView
        mapType="standard"
        showsUserLocation
        style={styles.map}
        region={{
          latitude: area.minLat - 0.01,
          longitude: area.minLon + 0.01,
          latitudeDelta: area.latDelta,
          longitudeDelta: area.lonDelta,
        }}
        onRegionChange={(region: Region, details: Details) => {}}
      >
        {markers.map((marker, index) => (
          <Marker
            pinColor={marker.title == "You" ? "blue" : "red"}
            key={index}
            coordinate={marker.coord}
            title={marker.title}
            description={marker.desc}
            isPreselected={0 === index}
            onPress={() =>
              marker.title == "You"
                ? null
                : Alert.alert(
                    "Confirmation",
                    `Do you want to message ${marker.title}?`,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () =>
                          navigation.navigate("Send", {
                        x    beacon: `${marker.title.split(" ")[1]}`,
                          }),
                      },
                    ],
                    { cancelable: false }
                  )
            }
          />
        ))}
      </MapView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    backgroundColor: "white",
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

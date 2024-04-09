import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  RefreshControl,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Appearance,
  useColorScheme,
} from "react-native";
import {
  generateRandomBeaconInfo,
  BeaconInfo,
  MarkerInfo,
  getBeaconInfo,
  scan,
  requestID,
} from "./util";
import MapView, { Details, Marker, Region } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import Header from "./Header";
import * as Network from "expo-network";
import { color } from "./util";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { updateInfo } from "./store";

const Beacon = ({ info, setInfo, setTheme }) => {
  const [id, setId] = useState(info?.id ?? "N/A");
  const [avail, setAvail] = useState<number[]>();
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [area, setArea] = useState({
    minLat: 0,
    minLon: 0,
    latDelta: 0,
    lonDelta: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const i = useSelector((state: any) => state.info);
  const [buttonSize, setButtonSize] = useState(40);
  const dispatch = useDispatch();
  const onRefresh = useCallback(async () => {
    // Set refreshing to true to show the refresh indicator
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);
  const getData = async () => {
    const testInfo: BeaconInfo = {
      id: 0,
      available: [-22527],
      battery: "98%",
    };
    dispatch(updateInfo());
    const res = await getBeaconInfo(); //await generateRandomBeaconInfo({
    //   lat: lat,
    //   lon: lon,\\r
    // });
    if (!res) {
      setId("N/A");

      return;
    }
    setInfo(res);
    //Alert.alert("Beacon Info", res.available);
    setId(`${res.id}`);
    //res.available[res.id] = '1';
    setAvail(res.available);
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      Location.getCurrentPositionAsync().then((c) =>
        setCoords({
          latitude: c?.coords.latitude ?? 0,
          longitude: c?.coords.longitude ?? 0,
        })
      );

      const ip = await Network.getIpAddressAsync();
      if (!ip.includes("192.168.4.1")) {
        // setInfo({
        //   id: 0,
        //   available: [1, -22527, 0],
        //   battery: "98%",
        // });
        // setAvail([1, -22527, 0]);
        return;
      }

      await getData();
    })();
  }, []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: "center",
      alignItems: "center",
      fontSize: 20,
      backgroundColor: scheme == "dark" ? "black" : "white",
      width: "100%",
    },
    centeredText: {
      fontSize: 22,
      textAlign: "center",
      margin: 10,
    },
    topText: {
      fontSize: 14,
      marginVertical: 2,
    },
    map: {
      width: "100%",
      height: "100%",
    },
    mainText: {
      fontSize: 20,
      width: "100%",
      textAlign: "center",
      color: scheme == "dark" ? "white" : "black",
    },
  });

  return (
    <View style={styles.container}>
      <Header text="Beacon" info={info} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 10,
        }}
      >
        {/* <View>
          <Text style={styles.topText}>Beacon ID: {id}</Text>
          <Text style={styles.topText}>Battery: {battery}</Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await requestID();
              }}
            >
              <Ionicons
                name={"person-circle-outline"}
                size={buttonSize}
                color={color}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                navigation.navigate("Settings", {
                  setButtonSize,
                });
              }}
            >
              <Ionicons
                name={"ellipsis-horizontal-circle-outline"}
                size={buttonSize}
                color={color}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await scan();
                setTimeout(function () {}, 1000);

                await getData();
              }}
            >
              <Ionicons
                name={"search-circle-outline"}
                size={buttonSize}
                color={color}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await getData();
              }}
            >
              <Ionicons
                name={"refresh-circle-outline"}
                size={buttonSize}
                color={color}
              />
            </TouchableOpacity>
          </View>

          {/* <Button
            color={color}
            title="Scan"
            onPress={async () => {
              console.log(await scan());
              getData();
            }}
          />
          <Button
            color={color}
            title="Reload"
            onPress={async () => {
              await getData();
            }}
          />
          <Button
            color={color}
            title="Request ID"
            onPress={async () => {
              await requestID();
            }}
          /> */}
        </View>
        {/* <Text style={styles.topText}>Battery: 96%</Text> */}
      </View>

      {/* <Text style={styles.centeredText}>Available Beacons</Text> */}
      <View>
        {!avail ? (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.mainText}>No available beacons,</Text>
            <Text style={styles.mainText}>are you connected?</Text>
            {/* <Button title="Reload" onPress={getData} /> */}
          </View>
        ) : (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ width: "100%" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[color]} // Android colors for the refresh indicator
              />
            }
          >
            {avail.filter((up, idx) => (up & 0x1) > 0 && idx != parseInt(id))
              .length == 0 ? (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  No available beacons
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  try scanning
                </Text>
              </View>
            ) : (
              avail
                .map((up, idx) => ({
                  beacon: idx,
                  up,
                }))
                .filter(({ up, beacon }, idx) => {
                  return up < 0 && beacon != parseInt(id);
                })
                .map(({ up, beacon }, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          id: beacon,
                          you: id,
                          coords: coords,
                        })
                      }
                      style={{
                        padding: 10,
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 25,
                        width: "100%",
                        borderColor: scheme === "dark" ? "white" : "black",
                      }}
                    >
                      <View
                        key={idx}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Ionicons
                        name={(up & 0x1) > 0 ? "wifi" : "wifi-outline"}
                        size={40}
                        color={(up & 0x1) > 0 ? color : "lightgray"}
                      /> */}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "95%",
                            alignItems: "center",
                            // borderWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 25,
                                fontFamily: "Trap-Bold",
                                color: scheme === "dark" ? "white" : "black",
                              }}
                            >
                              {beacon} {/* {(up & 0xff) === 0x11 ? "🛜" : ""} */}
                            </Text>
                            {(up & 0xff) === 0x11 ? (
                              <Ionicons
                                name="wifi"
                                size={24}
                                color={color}
                                style={{ marginLeft: -5, marginTop: -6 }}
                              />
                            ) : (
                              <View />
                            )}
                          </View>

                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: "Trap-Bold",
                              color: scheme == "dark" ? "white" : "black",
                            }}
                          >
                            {up >> 8}dBm
                          </Text>
                        </View>

                        {/* <Text>{`Beacon ${idx} is ${
                        id === `${idx}`
                          ? "you"
                          : (up & 0x1) > 0
                          ? `available`
                          : "not available"
                      } ${up >> 8 != 0 ? `${up >> 8}dBm` : ""}`}</Text> */}
                      </View>
                    </TouchableOpacity>
                  );
                })
            )}
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

export default Beacon;

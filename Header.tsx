import { View, Text, Image } from "react-native";
import { BeaconInfo, color, getBeaconInfo } from "./util";
import { useFonts } from "expo-font";
import BatteryGauge from "react-battery-gauge";
import Beacon from "./Beacon";
import { useEffect, useState } from "react";
import * as Progress from "react-native-progress";

const Header = ({ text, info }) => {
  // const [info, setInfo] = useState<BeaconInfo>({
  //   id: 1,
  //   available: [1, -22527, 0, 0, 0, -9727],
  //   battery: "27%",
  // });

  const [fontsLoaded] = useFonts({
    "Trap-Black": require("./assets/fonts/Trap-Black.otf"),
    "Trap-Bold": require("./assets/fonts/Trap-Bold.otf"),
  });
  return (
    <View
      style={{
        backgroundColor: color,
        height: 120,
        width: "100%",
        justifyContent: "space-between",

        alignItems: "center",
        //alignContent: "center",
        flexDirection: "row",
        //flex: 1,
        //marginBottom: 30,
      }}
    >
      <Text
        style={{
          marginTop: "10%",
          marginHorizontal: 20,
          fontSize: 20,
          color: "white",
          fontFamily: "Trap-Bold",
        }}
      >
        {info?.id}
      </Text>
      {text == "Beacon" ? (
        <Image
          style={{
            width: 186,
            height: 34,
            marginTop: 35,
          }}
          source={require("./assets/beacon.png")}
        />
      ) : (
        <Text
          style={{
            fontSize: 38,
            marginTop: 50,
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "white",
            fontFamily: "Trap-Black",
          }}
        >
          {text.toUpperCase()}
        </Text>
      )}
      {!info?.battery ? (
        <View />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8%",
          }}
        >
          <Text
            style={{
              marginHorizontal: 10,
              fontSize: 20,
              color: "white",
              fontFamily: "Trap-Bold",
            }}
          >
            {info?.battery}
          </Text>
          <Progress.Bar
            progress={
              parseInt(
                info?.battery.substring(0, info?.battery.length - 1) ?? 0
              ) / 100
            }
            width={38}
            color="white"
          />
        </View>
      )}
    </View>
  );
};

export default Header;

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import Send from "./Send";
import Beacon from "./Beacon";
import Settings from "./Settings";
import Recv from "./Recv";

import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StatusBar, View, Text } from "react-native";

import * as Haptics from "expo-haptics";
import { BeaconInfo, color, getBeaconInfo, getBeaconRecv } from "./util";
import { useFonts } from "expo-font";
import Chat from "./Chat";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import * as Network from "expo-network";

import { store } from "./store";
import { Provider } from "react-redux";

const Tab = createBottomTabNavigator();
const MenuTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [theme, setTheme] = useState({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: color,
    },
  });

  const [fontsLoaded] = useFonts({
    "Trap-Black": require("./assets/fonts/Trap-Bold.otf"),
  });

  const [info, setInfo] = useState<BeaconInfo>();
  useEffect(() => {
    (async () => {
      // setInfo({
      //   id: 1,
      //   available: [1, -22527, 0, 0, 0, -9727],
      //   battery: "27%",
      // });
      // console.log(info);
      const ip = await Network.getIpAddressAsync();
      if (!ip.includes("192.168.4.1")) return;
      const i = await getBeaconInfo();
      if (i) setInfo(i);
      // else
      //   setInfo({
      //     id: 1,
      //     available: [1, -22527, 0, 0, 0, -9727],
      //     battery: "27%",
      //   });
    })();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer
        theme={theme}
        onStateChange={(state) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          const update = async () => {
            switch (state.index) {
              case 0:
                await getBeaconInfo();
                break;
              case 2:
                await getBeaconRecv();
                break;
            }
          };
          //update();
        }}
      >
        <Stack.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            // tabBarLabel: ({ focused }) => {
            //   return (
            //     <Text
            //       style={{ fontSize: 10, color: focused ? color : "lightgray" }}
            //     >
            //       {route.name}
            //     </Text>
            //   );
            // },
            // tabBarStyle: { marginBottom: 5 },
            // tabBarIcon: ({ focused }) => {
            //   let iconName = "";
            //   if (route.name === "Send") {
            //     iconName = focused ? "arrow-up" : "arrow-up-outline";
            //   } else if (route.name === "Beacon") {
            //     iconName = focused ? "wifi" : "wifi-outline";
            //   } else if (route.name === "Receive") {
            //     iconName = focused ? "arrow-down" : "arrow-down-outline";
            //   }
            //   return (
            //     <Ionicons
            //       name={iconName}
            //       size={27}
            //       color={focused ? color : "lightgray"}
            //     />
            //   );
            // },
            // tabBarIndicator: () => <View></View>,
            // tabBarInactiveTintColor: color,
          })}
        >
          <>
            <Stack.Screen
              name="Beacon"
              children={() => (
                <Beacon info={info} setInfo={setInfo} setTheme={setTheme} />
              )}
              initialParams={info}
            />

            <Stack.Screen
              name="Chat"
              component={Chat}
              //options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              //options={{ unmountOnBlur: true }}
            />
          </>

          {/*  <Stack.Screen
          name="Main"
          component={() => (
            <Tab.Navigator>
              <Tab.Screen
                name="Feed"
                component={() => (
                  <View>
                    <Text>Hello</Text>
                  </View>
                )}
              />
            </Tab.Navigator>
          )}
        /> */}

          {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

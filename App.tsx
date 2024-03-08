import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import Send from "./Send";
import Beacon from "./Beacon";
import Header from "./Header";
import Recv from "./Recv";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StatusBar } from "react-native";

import * as Haptics from "expo-haptics";

const Tab = createBottomTabNavigator();
const MenuTab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer
      onStateChange={(state) =>
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      }
    >
      <MenuTab.Navigator
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{ fontSize: 10, color: focused ? "gray" : "lightgray" }}
              >
                {route.name}
              </Text>
            );
          },
          tabBarStyle: { marginBottom: 5 },
          tabBarIcon: ({ focused, color }) => {
            let iconName = "";
            if (route.name === "Send") {
              iconName = focused ? "arrow-up" : "arrow-up-outline";
            } else if (route.name === "Beacon") {
              iconName = focused ? "wifi" : "wifi-outline";
            } else if (route.name === "Receive") {
              iconName = focused ? "arrow-down" : "arrow-down-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={27}
                color={focused ? "gray" : "lightgray"}
              />
            );
          },
          tabBarIndicator: () => <View></View>,
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Beacon"
          options={{ unmountOnBlur: true }}
          component={Beacon}
        />
        <Tab.Screen
          name="Send"
          options={{ unmountOnBlur: true }}
          component={Send}
        />
        <Tab.Screen
          name="Receive"
          component={Recv}
          options={{ unmountOnBlur: true }}
        />

        {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      </MenuTab.Navigator>
    </NavigationContainer>
  );
}

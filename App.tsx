import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Send from "./Send";
import Beacon from "./Beacon";
import Header from "./Header";
import Recv from "./Recv";
import { Text } from "react-native";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <Header />,
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ fontSize: 10, color: focused ? "blue" : "gray" }}>
                {route.name}
              </Text>
            );
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "Send") {
              iconName = focused ? "arrow-up" : "arrow-up-outline";
            } else if (route.name === "Beacon") {
              iconName = focused ? "wifi" : "wifi-outline";
            } else if (route.name === "Recieve") {
              iconName = focused ? "arrow-down" : "arrow-down-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={30}
                color={focused ? "blue" : "gray"}
              />
            );
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Beacon" component={Beacon} />
        <Tab.Screen name="Send" component={Send} />
        <Tab.Screen name="Recieve" component={Recv} />

        {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

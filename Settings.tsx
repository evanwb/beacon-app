import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Appearance,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
} from "react-native";
import { color, updatePass } from "./util";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setAppIcon } from "expo-dynamic-app-icon";
import { useTheme } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

const Drawer = createDrawerNavigator();

const Settings = ({ navigation, route }) => {
  const scheme = useColorScheme();
  const theme = useTheme();
  const { setTheme } = route.params;
  const setButtonSize = route.params.setButtonSize;
  const UISettings = ({ navigation, route }) => {
    return (
      <View
        style={{
          marginTop: 20,
          flex: 1,
          //justifyContent: "center",
          alignItems: "center",
          backgroundColor: scheme == "dark" ? "black" : "white",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          App Settings
        </Text>
        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          Apperance
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => Appearance.setColorScheme("dark")}>
            <Ionicons
              name={scheme == "dark" ? "moon" : "moon-outline"}
              color={scheme == "dark" ? "white" : "black"}
              size={40}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Appearance.setColorScheme("light")}>
            <Ionicons
              name={scheme != "dark" ? "sunny" : "sunny-outline"}
              color={scheme == "dark" ? "white" : "black"}
              size={40}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          Icon
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setAppIcon("red");
              alert("App icon updated");
            }}
          >
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 15,
                marginHorizontal: 10,
              }}
              source={require("./assets/icon.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAppIcon("alt");
              alert("App icon updated");
            }}
          >
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 15,
                marginHorizontal: 10,
              }}
              source={require("./assets/icon2.png")}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          Home Icon Size
        </Text>
        <TouchableOpacity
          onPress={() => {
            setButtonSize(30);
            navigation.navigate("Beacon");
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            30
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setButtonSize(35);
            navigation.navigate("Beacon");
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            35
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setButtonSize(40);
            navigation.navigate("Beacon");
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            40
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setButtonSize(45);
            navigation.navigate("Beacon");
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            45
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setButtonSize(50);
            navigation.navigate("Beacon");
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            50
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const BeaconSettings = ({ route, navigation }) => {
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    return (
      <View
        style={{
          marginTop: 20,
          flex: 1,
          //justifyContent: "center",
          alignItems: "center",
          backgroundColor: scheme == "dark" ? "black" : "white",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          Beacon Settings
        </Text>
        <Text
          style={{
            color: scheme == "dark" ? "white" : "black",
            fontSize: 20,
            margin: 15,
          }}
        >
          Wifi Password
        </Text>
        <TextInput
          style={{
            borderColor: scheme == "dark" ? "white" : "black",
            borderWidth: 1,
            width: "90%",
            padding: 10,
            borderRadius: 20,
            marginVertical: 10,
            color: scheme == "dark" ? "white" : "black",
          }}
          secureTextEntry
          onChangeText={(e) => setPassword(e)}
          placeholder="Beacon password"
          placeholderTextColor={scheme == "dark" ? "white" : "black"}
        />
        <TextInput
          style={{
            borderColor: scheme == "dark" ? "white" : "black",
            borderWidth: 1,
            width: "90%",
            padding: 10,
            marginVertical: 10,
            borderRadius: 20,
            color: scheme == "dark" ? "white" : "black",
          }}
          secureTextEntry
          onChangeText={(e) => setCPassword(e)}
          placeholder="Confirm password"
          placeholderTextColor={scheme == "dark" ? "white" : "black"}
        />
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: color,
            borderRadius: 20,
            margin: 10,
          }}
          onPress={() => {
            if (password === "") {
              alert("Please enter a password");
            } else if (password === cpassword) {
              try {
                updatePass(password);
              } catch (err) {
                console.warn(err);
              }
              navigation.pop();
            } else {
              alert("Passwords do not match");
            }
          }}
        >
          <Text
            style={{
              color: scheme == "dark" ? "white" : "black",
              fontSize: 20,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: "white",
        drawerActiveTintColor: scheme == "dark" ? color : "black",
        drawerInactiveTintColor: scheme == "dark" ? "white" : "black",
        drawerContentContainerStyle: {
          backgroundColor: scheme == "dark" ? "black" : "white",
          height: "100%",
        },

        headerBackground: () => (
          <View style={{ backgroundColor: color, height: 120 }}></View>
        ),
        headerTitle: (props) => (
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Trap-Bold",
              color: "white",
              paddingTop: 10,
            }}
          >
            {route.name}
          </Text>
        ),
        headerRight: (props) => (
          <TouchableOpacity
            style={{ marginHorizontal: 15 }}
            onPress={() => navigation.navigate("Beacon")}
          >
            <Ionicons name="home-outline" size={25} color={"white"} />
          </TouchableOpacity>
        ),
        //drawerPosition: "right",
        //drawerType: "permanent",
      }}
    >
      <Drawer.Screen name="App Settings" component={UISettings} />
      <Drawer.Screen name="Beacon Settings" component={BeaconSettings} />
    </Drawer.Navigator>
  );
};

export default Settings;

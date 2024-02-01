import { View, Text } from "react-native";

const Header = () => {
  return (
    <View
      style={{
        backgroundColor: "gray",
        height: 140,
        width: "100%",
        //justifyContent: "center",
        alignItems: "center",
        //marginBottom: 30,
      }}
    >
      <Text
        style={{
          fontSize: 35,
          marginTop: 70,
          fontWeight: "bold",
          color: "white",
        }}
      >
        Iridium Beacon
      </Text>
    </View>
  );
};

export default Header;

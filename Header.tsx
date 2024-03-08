import { View, Text } from "react-native";

const Header = ({ text }) => {
  return (
    <View
      style={{
        backgroundColor: "gray",
        height: 120,
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        //flex: 1,
        //marginBottom: 30,
      }}
    >
      <Text
        style={{
          fontSize: 35,
          //marginTop: 70,
          fontWeight: "bold",
          color: "white",
          marginBottom: 20,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default Header;

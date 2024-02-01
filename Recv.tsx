import { Touchable, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const messages = [
  { id: 0, data: "SOS - Urgent Help Needed!", rssi: -50, snr: 8.5 },
  { id: 1, data: "SOS - Emergency Situation!", rssi: -60, snr: 7.2 },
  { id: 2, data: "SOS - Immediate Assistance Required!", rssi: -70, snr: 6.8 },
  { id: 3, data: "SOS - Critical Condition!", rssi: -55, snr: 9.0 },
  { id: 4, data: "SOS - Urgent Medical Help Needed!", rssi: -65, snr: 7.5 },
  { id: 3, data: "SOS - Duplicate ID!", rssi: -75, snr: 6.0 },
  { id: 1, data: "SOS - Another Duplicate ID!", rssi: -45, snr: 8.8 },
  { id: 2, data: "SOS - Yet Another Duplicate ID!", rssi: -55, snr: 8.2 },
  { id: 4, data: "SOS - Fire Emergency!", rssi: -65, snr: 7.7 },
  { id: 0, data: "SOS - Immediate Shelter Needed!", rssi: -70, snr: 6.5 },
];
const Recv = ({ navigation }) => {
  const Msg = ({ id, data, rssi, snr }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Send", {
            beacon: `${id}`,
            msg: "Replying to: " + data,
          });
        }}
        style={{
          margin: 10,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        <Text>From Beacon {id}</Text>
        <Text>{data}</Text>
        <Text>{`RSSI: ${rssi} SNR: ${snr}`}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Recieved Messages</Text>
      <ScrollView>
        {messages.map((msg, index) => (
          <Msg
            key={index}
            id={msg.id}
            data={msg.data}
            rssi={msg.rssi}
            snr={msg.snr}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //marginTop: 100,
    alignItems: "center",
    //padding: 16,
    backgroundColor: "white",
  },
  head: {
    fontSize: 22,
    margin: 10,
  },
});

export default Recv;

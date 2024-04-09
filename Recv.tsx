import { useCallback, useEffect, useState } from "react";
import {
  Button,
  RefreshControl,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RecvMessageInfo, clear, color, getBeaconRecv } from "./util";
import Header from "./Header";

const Recv = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    // Set refreshing to true to show the refresh indicator
    setRefreshing(true);
    setMessages(await getBeaconRecv());
    setRefreshing(false);
  }, []);
  const [messages, setMessages] = useState<RecvMessageInfo[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getBeaconRecv();
      if (data.length > 0) setMessages(data);
    })();
  }, []);
  const Msg = ({ m }) => {
    return (
      <View
        style={{
          margin: 5,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 20,
          width: "90%",
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ScrollView horizontal style={{ width: "75%" }}>
          <Text
            style={{
              margin: 15,
              fontSize: 18,
              color: m.msg.startsWith("ack") ? "green" : "black",
            }}
          >
            {decodeURI(m.msg)}
          </Text>
        </ScrollView>
        <TouchableOpacity
          style={{ margin: 2 }}
          onPress={() => {
            navigation.navigate("Send", {
              beacon: `${m.id}`,
              msg: "Replying to: " + m.msg,
            });
          }}
        >
          <Text style={{ fontSize: 14 }}>Beacon {m.id}</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>RSSI: {m.rssi}</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>SNR: {m.snr}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header text="Receive" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={styles.head}>Received Messages</Text>
        <Button
          color={color}
          title="Reload"
          onPress={async () => {
            const data = await getBeaconRecv();
            if (data.length > 0) setMessages(data);
          }}
        />
        <Button
          color={color}
          title="Clear"
          onPress={async () => {
            await clear();
            setMessages([]);
          }}
        />
      </View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4285f4", "#34a853", "#fbbc05", "#ea4335"]} // Android colors for the refresh indicator
          />
        }
      >
        {messages.length === 0 ? (
          <View>
            <Text>You haven't received any messages yet</Text>
          </View>
        ) : (
          messages.map((msg, index) => <Msg key={index} m={msg} />).reverse()
        )}
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

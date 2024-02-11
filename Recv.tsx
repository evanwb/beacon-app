import { useCallback, useEffect, useState } from "react";
import {
  Button,
  RefreshControl,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RecvMessageInfo, getBeaconRecv } from "./util";

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
      setMessages(await getBeaconRecv());
    })();
  }, []);
  const Msg = ({ id, msg }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Send", {
            beacon: `${id}`,
            msg: "Replying to: " + msg,
          });
        }}
        style={{
          margin: 5,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 20,
          width: "90%",
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 18 }}>{msg}</Text>
        <Text style={{ fontSize: 14 }}>Beacon {id}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Recieved Messages</Text>
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
          messages.map((msg, index) => (
            <Msg key={index} id={msg.id} msg={msg.msg} />
          ))
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

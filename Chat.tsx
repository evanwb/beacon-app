import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Modal,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import * as Network from "expo-network";
import { Bubble, GiftedChat, Send, IMessage } from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  RecvMessageInfo,
  color,
  getBeaconRecv,
  sendMessage,
  sendToBeacon,
  sentMessages,
} from "./util";
import Ionicons from "react-native-vector-icons/Ionicons";
import { InputToolbar, Actions, Composer } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { requestPermission, Contact, getAll } from "react-native-contacts";
import ModalView from "./ModalView";
import { SafeAreaView } from "react-native-safe-area-context";
const MAX_MESSAGE_LEN = 150;
const REFRESH_INTERVAL = 15;

const ChatScreen = ({ navigation, route }) => {
  const id = route.params?.id;
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([
    // {
    //   id: 2,
    //   msg: "yo",
    //   rssi: -27,
    //   snr: 1,
    // },
    // {
    //   id: 0,
    //   msg: "hello",
    //   rssi: -37,
    //   snr: 0,
    // },
    // {
    //   id: 5,
    //   msg: "hello",
    //   rssi: -27,
    //   snr: 1,
    // },
    // {
    //   id: 0,
    //   msg: "hello",
    //   rssi: -37,
    //   snr: 0,
    // },
  ]);
  const renderActions = () => {
    return (
      <View style={{ flexDirection: "row", paddingBottom: 12 }}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            setModalVisible(true);
            return;
          }}
        >
          <Image
            source={{
              uri: "https://cdn-learn.adafruit.com/assets/assets/000/099/339/medium800/raspberry_pi_Pico-R3-Pinout-narrow.png?1612915004",
            }}
            style={{ width: 50, height: 50, margin: 1 }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const getStored = async () => {
    setName((await AsyncStorage.getItem("name")) ?? "");
    // setPhone((await AsyncStorage.getItem("phone")) ?? "");
    //setBeacon((await AsyncStorage.getItem("beacon")) ?? "");
    setMessage((await AsyncStorage.getItem("msg")) ?? "");
  };

  const getData = async () => {
    const ip = await Network.getIpAddressAsync();
    if (!ip.includes("192.168.4.1")) return;
    let r: RecvMessageInfo[] = [];
    (async () => {
      r = await getBeaconRecv();
      if (r) {
        setReceived(
          r.filter((r) => r.id == id).sort((a, b) => a.created - b.created)
        );
        setMessages(
          r
            .filter((r) => r.id === id)
            .map(
              (r, idx) =>
                ({
                  _id: idx,
                  text: r.msg,
                  createdAt: new Date(),
                  rssi: r.rssi,
                  user: {
                    _id: id,
                  },
                } as IMessage)
            )
            .reverse()
        );
      }

      const stored = await AsyncStorage.getItem("sent");
      if (!stored) await AsyncStorage.setItem("sent", "[]");
      else setSent(JSON.parse(stored) as any[]);

      await requestPermission();
      await Location.requestForegroundPermissionsAsync();

      const cnts = await getAll();
      const data = [
        ...cnts.map((c: Contact) => {
          if (
            (c.phoneNumbers[0]?.number ?? "") !== "" &&
            ((c.givenName ?? "") !== "" || (c.familyName ?? "") !== "")
          ) {
            const d = {
              name: c.givenName + " " + c.familyName,
              number: c.phoneNumbers[0]?.number ?? "",
            };
            if (d !== undefined) return d;
          }
        }),
      ].sort((a, b) => a.name.localeCompare(b.name));
      setContacts(data);
      setFilteredContacts(data);
    })();

    const res = r
      .filter((r) => r.id === id)
      .map((r, idx) => ({
        _id: idx,
        text: r.msg,
        createdAt: new Date(),
        user: {
          _id: id,
        },
      }));
    //  setMessages(r);
    const s =
      sent
        ?.filter((msg) => msg.to === id)
        .map((msg) => ({ _id: msg.data._id * 27, ...msg.data })) ?? [];
    console.warn([...messages, s].length);
    setMessages((m) => GiftedChat.append(m, [...s]));
    setMessages((m) => [...m, s]);
    // }, 5000);
  };
  useEffect(() => {
    // const intervalId = setInterval(() => {
    //assign interval to a variable to clear it.
    getData(); // return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    getStored();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color={color}
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <View style={{ margin: 2 }}>
        <Bubble
          {...props}
          renderTime={
            !props.currentMessage.rssi
              ? null
              : () => (
                  <Text
                    style={{
                      fontSize: 12,
                      paddingHorizontal: 8,
                      paddingBottom: 10,
                      marginTop: -5,
                      color: scheme == "dark" ? "white" : "black",
                    }}
                  >
                    RSSI: {props.currentMessage.rssi}dBm
                  </Text>
                )
          }
          wrapperStyle={{
            right: {
              backgroundColor: color,
            },
          }}
          textStyle={{
            right: {
              color: scheme == "dark" ? "white" : "black",
            },
          }}
        />
      </View>
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };
  const [name, setName] = useState<string>("");
  const [beacon, setBeacon] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [recipient, setRecipient] = useState<string /* {
    name: string;
    number: string;
  } */>();
  const [recpName, setRecipientName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filtered, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [selected, setSelectedItem] = useState<any>();
  const [showContacts, setShowContacts] = useState(false);

  const handleSend = async () => {
    if (message.length > MAX_MESSAGE_LEN) return;
    if (name === "") alert("Please enter your name");
    // else if (isNaN(parseInt(recipient)) && isNaN(parseInt(beacon)))
    //   alert("Please enter recipient number or beacon id");
    else if (message === "") alert("Please enter a message to send");
    else if (message.includes(",")) {
      alert("Please dont use commas in message");
      setMessage(message.replace(",", "."));
    } else {
      // console.log({
      //   to: id,
      //   data: m,
      // });
      // sentMessages.push({
      //   to: id,
      //   data: m,
      // });

      //   await sendMessage(name, recipient, message.trim());
      await sendToBeacon(
        name,
        id,
        `${recipient}~${message}`,
        route.params.coords
      );
      const m = {
        _id: messages.length + 1,
        text: `message to ${recipient}: ${message}`,
        createdAt: new Date(),
        user: {
          _id: route.params?.you ?? "",
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [m])
      );
      console.log("handle send done");
      setModalVisible(false);
      return;
      const s = JSON.parse(await AsyncStorage.getItem("sent")) as any[];
      const newSent = [
        ...s,
        {
          to: id,
          data: m,
        },
      ];
      await AsyncStorage.setItem("sent", JSON.stringify(newSent));
    }
  };

  const handleInputChange = async (inputNumber: number, text: string) => {
    switch (inputNumber) {
      case 1:
        setName(text);
        await AsyncStorage.setItem("name", text);
        break;
      case 2:
        setPhone(text);
        break;
      case 3:
        setFilteredContacts(
          contacts.filter((c) =>
            c == undefined
              ? false
              : text.length == 0
              ? true
              : (c.name as string).toLowerCase().startsWith(text)
          )
        );

        setRecipientName(text);
        break;
      case 4:
        setBeacon(text);
        //await AsyncStorage.setItem("beacon", text);
        break;
      case 5:
        if (text.length <= MAX_MESSAGE_LEN) setMessage(text);

        await AsyncStorage.setItem("msg", text);
        break;
      default:
        break;
    }
  };

  const ModalView = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        key={134524}
        onShow={(e) => console.log("modal visible", modalVisible)}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(false);
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Your Full Name"
              value={name}
              onChangeText={(text) => handleInputChange(1, text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Recipient Phone Number"
              value={recpName}
              //editable={beacon === ""}
              onChangeText={(text) => handleInputChange(3, text)}
              onFocus={(e) => setShowContacts(true)}
              onEndEditing={(e) => setShowContacts(false)}
            />
            <>
              {showContacts && filtered.length > 0 && recpName.length > 0 ? (
                <ScrollView
                  style={{ width: "100%", height: "40%" }}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {filtered.map((c, idx) => {
                    console.log(c);
                    return (
                      <TouchableOpacity
                        style={{
                          borderWidth: 0.5,
                          // paddingHorizontal: 100,
                          paddingVertical: 10,
                          borderRadius: 20,
                          margin: 5,
                          textAlign: "left",
                          width: "90%",
                        }}
                        key={idx}
                        onPress={() => {
                          setRecipient(
                            (c.number as string)
                              .replace("(", "")
                              .replace(")", "")
                              .replace("-", "")
                              .replace(" ", "")
                          );
                          setRecipientName(c.name);
                          setShowContacts(false);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            alignContent: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              textAlign: "left",
                              paddingHorizontal: 10,
                            }}
                          >
                            {c?.name ?? ""}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View></View>
              )}
            </>
            {/* <TextInput
                style={styles.input}
                //editable={recpName == ""}
                placeholder="Beacon ID (Optional)"
                value={beacon}
                onChangeText={(text) => handleInputChange(4, text)}
                onFocus={(e) => setShowContacts(false)}
              /> */}

            <TextInput
              style={styles.input}
              placeholder="Message to send"
              value={message}
              onChangeText={(text) => handleInputChange(5, text)}
              //onFocus={(e) => setShowContacts(false)}
            />
            <Text
              style={{
                textAlign: "left",
                width: "80%",
                color: "gray",
                marginTop: -5,
              }}
            >
              {MAX_MESSAGE_LEN - message.length} characters left
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleSend()}
              >
                <Text style={{ ...styles.textStyle, fontSize: 20 }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ ...styles.textStyle, fontSize: 20 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const scheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: scheme == "dark" ? "black" : "white",
      }}
    >
      <ModalView />
      <View
        style={{
          width: "100%",
          backgroundColor: color,
          paddingTop: 20,
          height: 120,
          alignItems: "center",
          // justifyContent: "center",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={{ margin: 10, marginTop: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={"arrow-back-circle-outline"}
            size={40}
            color={"white"}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 28,
            paddingTop: 16,
            color: "white",
            marginHorizontal: 70,
            fontFamily: "Trap-Bold",
          }}
        >
          Beacon {id}
        </Text>

        <TouchableOpacity
          style={{ margin: 10, marginTop: 20 }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name={"add-circle-outline"} size={40} color={"white"} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        isCustomViewBottom
        options={{}}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: route.params?.you ?? "",
        }}
        renderInputToolbar={() => <View />}
        renderActions={renderActions}
        renderComposer={renderComposer}
        //bottomOffset={50}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderAvatar={() => <View style={{ width: 0 }} />}
        showAvatarForEveryMessage
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
      <View style={{ height: 40 }} />
    </View>
  );
};

export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: "black",
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: "center" }}
  />
);

// export const renderActions = (props) => (
//   <Actions
//     {...props}
//     containerStyle={{
//       width: 44,
//       height: 44,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "blue",
//       marginLeft: 4,
//       marginRight: 4,
//       marginBottom: 0,
//     }}
//     wrapperStyle={}
//     icon={() => <Ionicons name="arrow-back-outline" color={"white"} />}
//     options={{
//       "Choose From Library": () => {
//         console.log("Choose From Library");
//       },
//       Cancel: () => {
//         console.log("Cancel");
//       },
//     }}
//     optionTintColor="#222B45"
//   />
// );

export const renderComposer = (props) => (
  <View style={{ width: "75%" }}>
    <Composer
      {...props}
      textInputStyle={{
        color: "#222B45",
        backgroundColor: "#EDF1F7",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#E4E9F2",
        paddingTop: 8.5,
        paddingHorizontal: 12,
        marginLeft: 0,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: color,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    color: "black",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    //paddingVertical: 30,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

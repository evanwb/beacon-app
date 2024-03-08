import React, { useEffect, useState } from "react";
import { sendMessage, sendToBeacon } from "./util";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
// import * as Contacts from "expo-contacts";
import WifiManager from "react-native-wifi-reborn";
import { PermissionsAndroid } from "react-native";
import * as Location from "expo-location";
import { requestPermission, Contact, getAll } from "react-native-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";

const MAX_MESSAGE_LEN = 200;

const Send = ({ navigation, route }) => {
  const [name, setName] = useState<string>("");
  const [beacon, setBeacon] = useState<string>(route.params?.beacon ?? "");
  const [phone, setPhone] = useState<string>("");
  const [recipient, setRecipient] = useState<{
    name: string;
    number: string;
  }>();
  const [recpName, setRecipientName] = useState<string>();
  const [message, setMessage] = useState<string>(route.params?.msg ?? "");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filtered, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [selected, setSelectedItem] = useState<any>();
  const [showContacts, setShowContacts] = useState(false);

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
              : c.name.includes(text)
          )
        );

        setRecipientName(text);
        break;
      case 4:
        setBeacon(text);
        //await AsyncStorage.setItem("beacon", text);
        break;
      case 5:
        setMessage(text);

        await AsyncStorage.setItem("msg", text);
        break;
      default:
        break;
    }
  };

  const getStored = async () => {
    setName((await AsyncStorage.getItem("name")) ?? "");
    // setPhone((await AsyncStorage.getItem("phone")) ?? "");
    //setBeacon((await AsyncStorage.getItem("beacon")) ?? "");
    setMessage((await AsyncStorage.getItem("msg")) ?? "");
  };
  const handleSend = async () => {
    if (message.length > MAX_MESSAGE_LEN) return;
    if (name === "") alert("Please enter your name");
    else if ((recipient?.number ?? "") === "" && beacon === "")
      alert("Please enter recipient number or beacon id");
    else if (message === "") alert("Please enter a message to send");
    else if (message.includes(",")) {
      alert("Please dont use commas in message");
      setMessage(message.replace(",", "."));
    } else {
      if (beacon === "") {
        await sendMessage(name, recipient!.number, message.trim());
      } else await sendToBeacon(name, beacon, message.trim());
    }
  };
  useEffect(() => {
    (async () => {
      await requestPermission();
      await Location.requestForegroundPermissionsAsync();
      //const data = await WifiManager.connectToSSID("Beacon");

      //console.warn(await NativeModules.RNCNetInfo.getCurrentState("wifi"));
      //setBeacon(route.params.beacon ?? beacon);
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
      let i = 0;

      // console.log(contacts.length);
      // if (data.length > 0) {
      //   const contact = data[0];
      //   console.log(contact);
      // }
    })();
  }, []);

  useEffect(() => {
    getStored();
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Header text="Send" />

      <Text
        style={{
          fontSize: 20,
          marginHorizontal: 10,
          marginVertical: 20,
        }}
      >
        Enter your information below to send an SOS message
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => handleInputChange(1, text)}
          onFocus={(e) => setShowContacts(false)}
        />

        {/* <TextInput
          style={styles.input}
          placeholder="Your Phone Number (Optional)"
          value={phone}
          onChangeText={(text) => handleInputChange(2, text)}
        /> */}
        <TextInput
          style={styles.input}
          placeholder="Recipient Phone Number"
          value={recpName}
          //editable={beacon === ""}
          onChangeText={(text) => handleInputChange(3, text)}
          onFocus={(e) => setShowContacts(true)}
        />
        <>
          {showContacts && filtered.length > 0 ? (
            <ScrollView
              style={{ width: "100%" }}
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
                      setRecipient(c);
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
        <TextInput
          style={styles.input}
          //editable={recpName == ""}
          placeholder="Beacon ID (Optional)"
          value={beacon}
          onChangeText={(text) => handleInputChange(4, text)}
          onFocus={(e) => setShowContacts(false)}
        />
        {/* <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            onItemSelect={(item) => setSelectedItem(item)}
            containerStyle={{ padding: 5 }}
            // textInputStyle={{
            //   padding: 12,
            //   borderWidth: 1,
            //   borderColor: "#ccc",
            //   borderRadius: 5,
            // }}
            // itemStyle={{
            //   padding: 10,
            //   marginTop: 2,
            //   backgroundColor: "#ddd",
            //   borderColor: "#bbb",
            //   borderWidth: 1,
            //   borderRadius: 5,
            // }}
            // itemTextStyle={{ color: "#222" }}
            // itemsContainerStyle={{ maxHeight: 140 }}
            items={contacts}
            //defaultIndex={0}
            placeholder="Type to search"
            resetValue={true}
            underlineColorAndroid="transparent"
          /> */}
        <TextInput
          style={styles.input}
          placeholder="Message to send"
          value={message}
          onChangeText={(text) => handleInputChange(5, text)}
          onFocus={(e) => setShowContacts(false)}
        />
        <Text in style={{ textAlign: "left", width: "80%", opacity: "0.5" }}>
          {MAX_MESSAGE_LEN - message.length} characters left
        </Text>
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Sending to all",
              "This could take a while, check recieved messages for responses",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Receive"),
                },
              ]
            );
          }}
          style={styles.buttonOutline}
        >
          <Text style={{ ...styles.buttonText }}>Send to all</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "gray",
    width: "50%",
    paddingVertical: 16,
    borderRadius: 100,
    margin: 10,
  },
  buttonOutline: {
    borderColor: "red",
    backgroundColor: "red",
    width: "50%",
    paddingVertical: 16,
    borderRadius: 100,
    margin: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    //justifyContent: "center",
    //marginTop: 100,
    alignItems: "center",
    //padding: 16,
    backgroundColor: "white",
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
    width: "90%",
    borderRadius: 20,
  },
});

export default Send;

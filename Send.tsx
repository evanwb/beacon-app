import React, { useEffect, useState } from "react";
import { sendMessage } from "./util";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Contacts from "expo-contacts";
import WifiManager from "react-native-wifi-reborn";
import { PermissionsAndroid } from "react-native";
import * as Location from "expo-location";

const Send = ({ navigation, route }) => {
  console.log(route);
  const [name, setName] = useState<string>("");
  const [beacon, setBeacon] = useState<string>(route.params?.beacon ?? "");
  const [phone, setPhone] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>(route.params?.msg ?? "");
  const [contacts, setContacts] = useState<any>([]);
  const [selected, setSelectedItem] = useState<any>();
  const [wifiStrength, setWifiStrength] = useState<any>(null);

  const handleInputChange = async (inputNumber: number, text: string) => {
    switch (inputNumber) {
      case 1:
        setName(text);
        break;
      case 2:
        setPhone(text);
        break;
      case 3:
        setRecipient(text);
        break;
      case 4:
        setBeacon(text);
        break;
      case 5:
        setMessage(text);
        break;
      default:
        break;
    }
  };

  const getStored = async () => {
    // setName((await AsyncStorage.getItem("name")) ?? "");
    // setPhone((await AsyncStorage.getItem("phone")) ?? "");
    // setRecipient((await AsyncStorage.getItem("recp")) ?? "");
    // setMessage((await AsyncStorage.getItem("msg")) ?? "");
  };

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      //const data = await WifiManager.connectToSSID("Beacon");

      //console.warn(await NativeModules.RNCNetInfo.getCurrentState("wifi"));
      //setBeacon(route.params.beacon ?? beacon);

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });
        let i = 0;
        let cnts = [];
        data.forEach((c) => {
          // console.log(c);
          cnts.push({ id: i, name: c.name });

          i++;
        });
        setContacts(cnts);
        // console.log(contacts.length);
        // if (data.length > 0) {
        //   const contact = data[0];
        //   console.log(contact);
        // }
      }
    })();
  }, []);

  useEffect(() => {
    getStored();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            marginHorizontal: 10,
            marginVertical: 20,
          }}
        >
          Enter your information below to send an SOS message
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => handleInputChange(1, text)}
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
          value={recipient}
          onChangeText={(text) => handleInputChange(3, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Beacon ID (Optional)"
          value={beacon}
          onChangeText={(text) => handleInputChange(4, text)}
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
        />
        <TouchableOpacity
          onPress={async () => {
            if (name === "") alert("Please enter your name");
            else if (recipient === "" && beacon === "")
              alert("Please enter recipient number or beacon id");
            else if (message === "") alert("Please enter a message to send");
            else await sendMessage(name, phone, recipient, message);
          }}
          style={{
            backgroundColor: "gray",
            width: "90%",
            paddingVertical: 20,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </>
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

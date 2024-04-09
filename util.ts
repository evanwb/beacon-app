const url = "http://192.168.4.1";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const color = "#ed3024";

export let sentMessages = [];

const fetchDataWithTimeout = (
  url: string,
  timeout: number
): Promise<Response | any> => {
  return Promise.race([
    fetch(url), // Actual fetch request
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};
export const sendToBeacon = async (
  name: string,
  beacon: string,
  message: string,
  { latitude, longitude }: { latitude: number; longitude: number }
) => {
  try {
    console.log(
      `sending ${message} to beacon ${beacon} location: ${latitude},${longitude}`
    );

    const res = await fetchDataWithTimeout(
      `${
        url +
        "/send?" +
        new URLSearchParams({
          beacon: beacon,
          from: name,
          to: "beacon",
          message: message, //`message from ${name}: ${message}`,
          location: `${latitude ?? 0}~${longitude ?? 0}`,
        })
      }`,
      3000
    );
    const data = await res.json();
    console.log(data);
  } catch (err) {
    //Alert.alert(`${err}`, "Make sure you are connected to your beacon");
  }
};
export const sendMessage = async (
  name: string,
  recipient: string,
  message: string
) => {
  try {
    const { latitude, longitude } = (await Location.getCurrentPositionAsync())
      .coords;
    console.log(
      `sending ${message} to ${recipient} location: ${latitude}~${longitude}`
    );

    if (recipient.includes("(") || recipient.includes("+"))
      recipient = recipient.replace(/^\+|\D/g, "");

    const res = await fetchDataWithTimeout(
      `${
        url +
        "/send?" +
        new URLSearchParams({
          from: name,
          to: recipient,
          message: message,
          location: `${latitude ?? 0}~${longitude ?? 0}`,
        })
      }`,
      3000
    );
    const data = await res.json();
    console.log(data);
  } catch (err) {
    //Alert.alert(`${err}`, "Make sure you are connected to your beacon");
  }
};

export type BeaconInfo = {
  id: number;
  available: number[];
  battery: string;
  //markers: MarkerInfo[];
};
export const getBeaconInfo = async (): Promise<BeaconInfo | null> => {
  console.log(`beacon info`);
  try {
    const res = await fetchDataWithTimeout(url + "/info", 3000);
    const text = await res.text();
    const data = JSON.parse(text).result;
    const r: BeaconInfo = {
      id: parseInt(data.id, 10),
      available: data.a as number[],
      battery: data.battery,
    };
    return r;
  } catch (err) {
    // Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    alert(`beacon info ${err}`);
    return null;
  }
};

export const getBeaconRecv = async (): Promise<RecvMessageInfo[]> => {
  let r: RecvMessageInfo[] = [];

  try {
    const res: Response = await fetchDataWithTimeout(url + "/recv?", 3000);
    const text = await res.text();

    const data = JSON.parse(text).result;

    return data as RecvMessageInfo[];
  } catch (err) {
    Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    return [];
  }
};

const randomMarker = (id: number, { lat, lon }): MarkerInfo => {
  const latOffset = (Math.random() - 0.5) * 0.1; // Adjust the multiplier for desired range
  const lonOffset = (Math.random() - 0.5) * 0.1; // Adjust the multiplier for desired range

  // Applying the offsets to the provided coordinates
  const randomLat = lat + latOffset;
  const randomLon = lon + lonOffset;
  const randomTitle = `Beacon ${id}`;
  const randomDesc = `Beacon ${id}`;

  const markerInfo = {
    title: randomTitle,
    coord: {
      latitude: randomLat,
      longitude: randomLon,
    },
    desc: undefined, //randomDesc,
    rssi: -32,
    snr: 11,
  };
  return markerInfo;
};

export function generateRandomBeaconInfo({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<BeaconInfo> {
  return new Promise((resolve) => {
    const randomId = Math.floor(Math.random() * 10); // Replace 1000 with your desired range for id
    const randomAvailable = Array.from({ length: 6 }, () => {
      return Math.floor(Math.random() * 2);
    }); // Change 5 to the desired length of the 'available' array

    let markers: MarkerInfo[] = [];
    randomAvailable.forEach((v, id) => {
      if (v > 0) markers.push(randomMarker(id, { lat, lon }));
    });

    const beaconInfo = {
      id: randomId,
      available: "randomAvailable",
      // markers: markers,
    };

    resolve(beaconInfo);
  });
}

export const scan = async () => {
  try {
    const res = await fetchDataWithTimeout(url + "/scan?", 3000); //onst data = (await res.json()).result;
    return "scan started";
  } catch (err) {
    Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    return {
      result: err,
    };
  }
};

export const clear = async () => {
  try {
    const res = await fetchDataWithTimeout(url + "/clear?", 3000); //onst data = (await res.json()).result;
    return "cleared";
  } catch (err) {
    Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    return {
      result: err,
    };
  }
};

export const requestID = async () => {
  try {
    const res = await fetchDataWithTimeout(url + "/gid?", 3000);
    alert(
      "A new ID has been requested. You may need to reconnect to your Beacon"
    ); //onst data = (await res.json()).result;
    return "cleared";
  } catch (err) {
    Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    return {
      result: err,
    };
  }
};

export const updatePass = async (pass) => {
  try {
    const res = await fetchDataWithTimeout(
      url /* + "/pass?pass=" + pass */,
      3000
    );
    alert("Pasword has been updated"); //onst data = (await res.json()).result;
    return "updated";
  } catch (err) {
    Alert.alert(`${err}`, "Make sure you are connected to your beacon");
    return {
      result: err,
    };
  }
};

export type MarkerInfo = {
  title: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  desc: string | undefined;
};

export type RecvMessageInfo = {
  id: number;
  msg: string;
  snr: number;
  created: number;
  rssi: number;
};

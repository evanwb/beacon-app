const url = "http://192.168.4.1";
import axios from "axios";

const fetchDataWithTimeout = (
  url: string,
  timeout: number
): Promise<Response> => {
  return Promise.race([
    fetch(url), // Actual fetch request
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};

export const sendMessage = async (
  name: string,
  phone: string,
  recipient: string,
  message: string
) => {
  try {
    const res = await fetchDataWithTimeout(
      `${url + "/msg?"}
      ${new URLSearchParams({
        from: name,
        to: recipient,
        message: message,
      })}`,
      3000
    );
    const data = await res.json();
    console.log(data);
  } catch (err) {
    alert(err.message);
  }

  //   const res = await axios
  //     .post(n
  //       url +
  //         new URLSearchParams({
  //           from: name,
  //           to: recipient,
  //           message: `Message from ${name}: ${message} `,
  //         })
  //     )
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
};
export type BeaconInfo = {
  id: number;
  available: number[];
  markers: MarkerInfo[];
};
export const getBeaconInfo = async (): Promise<BeaconInfo> => {
  const res = await fetch(url + "/info");
  const data = await res.json();
  const r: BeaconInfo = {
    id: parseInt(data.id, 10),
    available: data.available.split(" ").map(Number),
  };
  return r;
};

const randomMarker = (id: number): MarkerInfo => {
  const randomLatitude = Math.random() * (36.5881 - 33.7529) + 33.7529; // Random latitude between 33.7529 and 36.5881 (bounds for NC)
  const randomLongitude = Math.random() * (-75.809 - -84.3196) - 84.3196; // Random longitude between -84.3196 and -75.8090 (bounds for NC)
  const randomTitle = `Beacon ${id}`;
  const randomDesc = `Beacon ${id}`;

  const markerInfo = {
    title: randomTitle,
    coord: {
      latitude: randomLatitude,
      longitude: randomLongitude,
    },
    desc: undefined, //randomDesc,
    rssi: -32,
    snr: 11,
  };
  return markerInfo;
};

export function generateRandomBeaconInfo(): Promise<BeaconInfo> {
  return new Promise((resolve) => {
    const randomId = Math.floor(Math.random() * 10); // Replace 1000 with your desired range for id
    const randomAvailable = Array.from({ length: 6 }, () => {
      return Math.floor(Math.random() * 2);
    }); // Change 5 to the desired length of the 'available' array

    let markers: MarkerInfo[] = [];
    randomAvailable.forEach((v, id) => {
      if (v > 0) markers.push(randomMarker(id));
    });

    const beaconInfo = {
      id: randomId,
      available: randomAvailable,
      markers: markers,
    };

    resolve(beaconInfo);
  });
}

export type MarkerInfo = {
  title: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  desc: string | undefined;
  rssi: number;
  snr: number;
};

export type MessageInfo = {
  rssi: number;
  snr: number;
};

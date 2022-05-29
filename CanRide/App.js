import * as React from "react";
//import MapView from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import metro from "./metro.json";
import code from "./서울시 지하철역 정보 검색 (역명).json";
import axios from "axios";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const desc = [];
let today = new Date();

let year = today.getFullYear(); // 년도
let month = ("0" + (today.getMonth() + 1)).slice(-2);
let date = ("0" + today.getDate()).slice(-2);
let hours = ("0" + today.getHours()).slice(-2);
let minutes = ("0" + today.getMinutes()).slice(-2);
let seconds = ("0" + today.getSeconds()).slice(-2);
let daylabel = today.getDay();

const app = ({ navigation }) => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.548014,
    longitude: 127.074658,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [mapWidth, setMapWidth] = useState("99%");
  const [location, setLocation] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [inputText, setInputText] = useState("");
  const [destination, setDestination] = useState("");
  const [desName, setDesName] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [modalVisible, setModalVisible] = useState(true);

  const ccode = {};

  const updateMapStyle = () => {
    setMapWidth("100%");
  };

  const set_fistDestination = () => {
    setInputText("");
  };

  const handleDestination = () => {
    setDestination("");
    setDesName("");
    console.log(searchValue);
    var station_code = code.DATA;
    let isCorrect = 0;
    for (var i = 0; i < station_code.length; i++) {
      if (
        station_code[i]["station_nm"] === inputText ||
        station_code[i]["station_nm"] + "역" === inputText
      ) {
        setDestination(station_code[i]["fr_code"]);
        setDesName(station_code[i]["station_nm"]);

        isCorrect = 1;
      }
    }
    if (isCorrect == 0) {
      console.log("잘못된 입력!");
    }
    console.log("도착지 코드 : ", destination);
    console.log("도착지 이름 : ", desName);
    //setInputText("");
    return destination, desName;
  };
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLogitude] = useState(null);
  // Get current location information
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log("[LOG] current location : " + text);
    console.log(inputText);
  }

  const pressButton = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Wrapper style={{ backgroundColor: "white" }}>
      <View style={styles.centeredView}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.background} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={[styles.TextInput, { width: "80%" }]}
                  placeholder="Where are you going?"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (inputText === "") {
                        Alert.alert("도착지에 대한 정보가 없습니다!");
                      } else {
                        handleDestination();
                        setModalVisible(!modalVisible);
                      }
                    }}
                  >
                    <Text style={{ color: "white" }}>목적지 설정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={set_fistDestination}
                  >
                    <Text style={{ color: "white" }}>목적지 초기화</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={[
            styles.button,
            {
              //marginTop: 50,
              width: SCREEN_WIDTH / 2,
              position: "absolute",
              zIndex: 2,
              bottom: SCREEN_HEIGHT - 90,
            },
          ]}
          onPress={pressButton}
        >
          <Text style={{ color: "white" }}>목적지 설정</Text>
        </TouchableOpacity>
        <MapView
          initialRegion={initialRegion}
          style={[styles.map, { width: SCREEN_WIDTH, zIndex: 1 }]}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={() => {
            updateMapStyle();
          }}
        >
          {/* <Marker
          coordinate={{
            latitude: desc[1].latitude,
            longitude: desc[1].longitude,
          }}
          title="this is a marker"
          description="this is a marker example"
        /> */}
          {metro.map((marker, index) => {
            //console.log("marker", marker);
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.lat ? marker.lat : 0,
                  longitude: marker.lng ? marker.lng : 0,
                  //latitude: marker.lat,
                  //longitude: marker.lng,
                }}
                onPress={() => {
                  if (inputText === "") {
                    Alert.alert("도착지에 대한 정보가 없습니다!");
                  } else {
                    //Alert.alert(ccode);
                    var station_code = code.DATA;
                    var ccode = "";

                    for (var i = 0; i < station_code.length; i++) {
                      if (station_code[i]["station_nm"] === marker.name) {
                        ccode = station_code[i]["fr_code"];
                        ccodeName = station_code[i]["station_nm"];
                        ccodelat = marker.lat;
                        ccodelng = marker.lng;
                      }
                    }
                    console.log("출발지 역이름 : ", ccodeName);
                    console.log("출발지 코드 : ", ccode);

                    const URL = `https://map.naver.com/v5/api/transit/directions/subway?start=${ccode}&goal=${destination}&departureTime=${year}-${month}-${date}T${hours}%3A${minutes}%3A${seconds}`;
                    const sta = "";
                    console.log(URL);
                    if (destination === "") {
                      Alert.alert("도착지에 대한 정보가 없습니다!");
                    } else {
                      axios.get(URL).then((data) => {
                        const legs = data.data.paths[0].legs[0];
                        var i,
                          j = 0;

                        for (i = 0; i < legs.steps.length; i = i + 2) {
                          for (j = 0; j < legs.steps[i].stations.length; j++) {
                            console.log(legs.steps[i].stations[j].name);
                          }
                        }
                      });
                    }
                  }
                }}
              ></Marker>
            );
          })}
        </MapView>
      </View>
    </Wrapper>
  );
};

export default app;

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
`;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  background: {
    flex: 0,
  },

  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  TextInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "black",
  },
  container: {
    margin: 20,
  },
  textInput: {
    fontSize: 20,
    paddingTop: 0,
  },
  button: {
    backgroundColor: "#D6C6B6",
    marginTop: 0,
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
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

  DetailContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  start: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  startName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  transfer: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  transferName: {
    fontSize: 58,
    fontWeight: "500",
    color: "red",
  },
  end: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  endName: {
    fontSize: 58,
    fontWeight: "500",
    color: "green",
  },
});

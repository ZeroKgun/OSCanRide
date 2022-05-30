import * as React from "react";
//import MapView from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  KeyboardAvoidingView,
  LogBox,
} from "react-native";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import metro from "./metro.json";
//import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import code from "./서울시 지하철역 정보 검색 (역명)";
import axios from "axios";
import haversine from "haversine-distance";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import allclear from "./allclear.json";
import nonego from "./nonego.json";
import transferno from "./transferno.json";
import stopsameline from "./가다끊김.json";

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

const MapScreen = ({ navigation }) => {
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
  const [deslat, setDeslat] = useState("");
  const [deslng, setDeslng] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const ccode = {};
  let ccodelat = "";
  let ccodelng = "";
  const [modalVisible, setModalVisible] = useState(true);

  var array = metro.map(function (item) {
    return {
      latitude: item.lat,
      longitude: item.lng,
    };
  });

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
    var metroData = metro;
    let isCorrect = 0;
    for (var i = 0; i < station_code.length; i++) {
      if (
        station_code[i]["station_nm"] === inputText ||
        station_code[i]["station_nm"] + "역" === inputText
      ) {
        setDestination(station_code[i]["fr_code"]);
        setDesName(station_code[i]["station_nm"]);
        for (var j = 0; j < metroData.length; j++) {
          if (desName === metroData[i].name) {
            setDeslat(metroData[i].lat);
            setDeslng(metroData[i].lng);
          }
        }

        isCorrect = 1;
      }
    }
    if (isCorrect == 0) {
      console.log("잘못된 입력!");
    }
    console.log("도착지 코드 : ", destination);
    console.log("도착지 이름 : ", desName);
    console.log("도착지 위도 경도", deslat, deslng);
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
      for (var i = 0; i < array.length; i++) {
        const a = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const b = {
          latitude: array[i].lat,
          longitude: array[i].lng,
        };
        //console.log(haversine(a, b));
        if (haversine(a, b) <= 2000) {
          ccode.latitude = array[i].lat;
          ccode.longitude = array[i].lng;
          desc.push(ccode);
        }
      }
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
                    var ccodeName = "";
                    var startColor = "";
                    var destinColor = "";
                    for (var i = 0; i < station_code.length; i++) {
                      if (station_code[i]["station_nm"] === marker.name) {
                        ccode = station_code[i]["fr_code"];
                        ccodeName = station_code[i]["station_nm"];
                        ccodelat = marker.lat;
                        ccodelng = marker.lng;
                      }
                    }
                    console.log("출발지 코드 : ", ccode);

                    const URL = `https://map.naver.com/v5/api/transit/directions/subway?start=${ccode}&goal=${destination}&departureTime=${year}-${month}-${date}T${hours}%3A${minutes}%3A${seconds}`;
                    const lastmetro = `https://map.naver.com/v5/api/transit/subway/stations/${ccode}/schedule?lang=ko&stationID=${ccode}`;
                    const startURL = `https://map.naver.com/v5/api/transit/realtime/arrivals?lang=ko&station%5B%5D=${ccode}`;
                    const DesURL = `https://map.naver.com/v5/api/transit/realtime/arrivals?lang=ko&station%5B%5D=${destination}`;

                    const sta = "";
                    console.log(URL);
                    if (destination === "") {
                      Alert.alert("도착지에 대한 정보가 없습니다!");
                    } else {
                      axios
                        .all([
                          axios.get(URL),
                          axios.get(lastmetro),
                          axios.get(startURL),
                          axios.get(DesURL),
                        ])
                        .then(
                          axios.spread((data, time, startData, desData) => {
                            let cnt = 0; //환승역 갯수
                            let count = 0; //출발지와 목적지
                            let placelist = [];
                            let list = [];
                            let codelist = [];
                            let listColor = [];
                            const legs = data.data.paths[0].legs[0];
                            var i,
                              j = 0;
                            // startColor =
                            //   data.data.paths[0].fares[0].routes[0][i].type
                            //     .color;
                            // console.log("출발지 컬러", startColor);
                            // listColor[cnt] =
                            //   data.data.paths[0].fares[0].routes[0][0].type.color;
                            for (i = 0; i < legs.steps.length; i = i + 2) {
                              //console.log(legs.steps[i].routes[0].name); listColor[cnt] =
                              listColor[i / 2] =
                                data.data.paths[0].fares[0].routes[
                                  i / 2
                                ][0].type.color;
                              var setTime = legs.steps[
                                i
                              ].departureTime.substring(11, 13);
                              //var sethour = setTime.split("T");
                              console.log(setTime);
                              if (
                                parseInt(setTime) >= 5 &&
                                parseInt(setTime) <= 6
                              ) {
                                console.log("탈수 없노");
                              } else {
                                console.log("탈수 있노!");
                                console.log(
                                  "타는 시간",
                                  legs.steps[i].departureTime
                                );
                                placelist[count] =
                                  legs.steps[i].stations[0].placeId;
                                count++;

                                for (
                                  j = 0;
                                  j < legs.steps[i].stations.length;
                                  j++
                                ) {
                                  console.log(legs.steps[i].stations[j].name);
                                }
                                if (i + 1 != legs.steps.length) {
                                  list[cnt] =
                                    legs.steps[i].stations[j - 1].name;
                                  codelist[cnt] =
                                    legs.steps[i].stations[j - 1].displayCode;
                                  cnt++;
                                } else {
                                  placelist[count] =
                                    legs.steps[i].stations[j - 1].placeId;
                                  count++;
                                }
                              }
                            }
                            //출발 역과 끝 역의 리스트넘버
                            console.log("", placelist);
                            console.log("환승역", list);
                            console.log("대표역 색상", listColor);
                            navigation.navigate("Details", {
                              S: ccode,
                              SName: ccodeName,
                              Lcolor: listColor,
                              cnt: cnt,
                              Tname: list,
                              T: codelist,
                              E: destination,
                              EName: desName,
                            });
                          })
                        );
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

const DetailsScreen = ({ route, navigation }) => {
  const { S, SName, E, EName, T, Tname, Lcolor, cnt } = route.params;
  const transferlist = () => {
    return Tname.map((element, index) => {
      return (
        <View key={index}>
          <Text style={[styles.transferName, { color: Lcolor[index + 1] }]}>환승역</Text>
          <Text>{Tname[index]}</Text>
        </View>
      )
    })
  }

  return (
    <View style={styles.DetailContainer}>
      <View style={styles.start}>
        <Text style={[styles.startName, { color: Lcolor[0] }]}>시작역</Text>
        <Text>{S}</Text>
        <Text>{SName}</Text>
      </View>

      <View style={styles.transfer}>{transferlist()}</View>
      <View style={styles.end}>
        <Text style={[styles.endName, { color: Lcolor[cnt] }]}>도착역</Text>
        <Text>{E}</Text>
        <Text>{EName}</Text>
      </View>
    </View>
  );
};

function app() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
  bottomSheetContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  iconContainer: {
    backgroundColor: "#e7e7e7",
    padding: 7,
    borderRadius: 10,
    marginRight: 15,
  },
  locationText: {},
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

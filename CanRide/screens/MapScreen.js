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
} from "react-native";
import styled from "styled-components";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import metro from "../JSON/metro.json";
//import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import code from "../JSON/서울시 지하철역 정보 검색 (역명).json";
import axios from "axios";
import haversine from "haversine-distance";
//import { LinearGradient } from "expo-linear-gradient";
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "../styles";
import { FontAwsome } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
//import { TouchableOpacity } from "react-native-gesture-handler";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

//const desc = [];

let today = new Date();
let year = today.getFullYear(); // 년도
let month = ("0" + (today.getMonth() + 1)).slice(-2);
let date = ("0" + today.getDate()).slice(-2);
let hours = ("0" + today.getHours()).slice(-2);
let minutes = ("0" + today.getMinutes()).slice(-2);
let seconds = ("0" + today.getSeconds()).slice(-2);
let daylabel = today.getDay();

function MapScreen({ navigation }) {
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
  let endlat = "";
  let endlng = "";
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
                        Alert.alert("도착지 이름을 입력해주세요!");
                      } else {
                        handleDestination();
                        setModalVisible(!modalVisible);
                      }
                    }}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      목적지 설정
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={set_fistDestination}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      목적지 초기화
                    </Text>
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
              bottom: SCREEN_HEIGHT - 95,
            },
          ]}
          onPress={pressButton}
        >
          <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>
            목적지 설정
          </Text>
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
          {metro.map((marker, index) => {
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
                    for (var j = 0; j < metro.length; j++) {
                      if (metro[j].name === inputText) {
                        endlat = metro[j].lat;
                        endlng = metro[j].lng;
                      }
                    }
                    console.log("출발지 코드 : ", ccode);

                    const URL = `https://map.naver.com/v5/api/transit/directions/subway?start=${ccode}&goal=${destination}&departureTime=${year}-${month}-${date}T${hours}%3A${minutes}%3A${seconds}`;
                    console.log(URL);
                    if (destination === "") {
                      Alert.alert("도착지에 대한 정보가 없습니다!");
                    } else {
                      axios.all([axios.get(URL)]).then(
                        axios.spread((data) => {
                          let cnt = 0; //환승역 갯수
                          let count = 0; //출발지와 목적지
                          let placelist = [];
                          let list = [];
                          let stationcntlist = [];
                          let starthourlist = [];
                          let startMinlist = [];
                          let startseclist = [];
                          let codelist = [];
                          let listColor = [];
                          const legs = data.data.paths[0].legs[0];
                          var i,
                            j = 0;
                          let transcount = 0;
                          let startOK = true;
                          let transferOK = [];
                          //detail에 넘겨줄 부분이
                          //몇정거장인지
                          //탑승 가능 여부 변수
                          //걸리는 시간
                          //환승역
                          for (i = 0; i < legs.steps.length; i = i + 2) {
                            if (
                              i === legs.steps.length ||
                              i === legs.steps.length - 1
                            ) {
                              transcount = transcount - 1;
                            }
                            if (data.data.paths[0].shutdown === true) {
                              console.log("지하철이 처음부터 끊겼다!");
                              startOK = false;
                            } else if (
                              data.data.paths[0].fares[0].routes.length > 2 &&
                              data.data.paths[0].fares[0].routes[transcount][0]
                                .type.id ===
                                data.data.paths[0].fares[0].routes[
                                  transcount + 1
                                ][0].type.id
                            ) {
                              console.log(
                                "지하철이 가다가 끝까지 못가고 멈췄다!"
                              );
                              transferOK[transcount] = false;
                            } else if (
                              data.data.paths[0].fares[0].routes.length === 2 &&
                              data.data.paths[0].fares[0].routes[0][0].type
                                .id ===
                                data.data.paths[0].fares[0].routes[1][0].type.id
                            ) {
                              console.log(
                                "지하철이 가다가 끝까지 못가고 멈췄다!"
                              );
                              startOK = false;
                            } else if (
                              data.data.paths[0].legs[0].steps[i].shutdown ===
                              true
                            ) {
                              console.log("환승을 못하고 지하철이 끊겼다!");
                              transferOK[transcount] = false;
                            } else {
                              console.log("가자!");
                            }

                            listColor[i / 2] =
                              data.data.paths[0].fares[0].routes[
                                i / 2
                              ][0].type.color;
                            var setTime = {
                              hour: legs.steps[i].departureTime.substring(
                                11,
                                13
                              ),
                              minute: legs.steps[i].departureTime.substring(
                                14,
                                16
                              ),
                              second: legs.steps[i].departureTime.substring(
                                17,
                                19
                              ),
                            };
                            console.log(
                              setTime.hour,
                              "시",
                              setTime.minute,
                              "분",
                              setTime.second,
                              "초에 지하철 도착"
                            );
                            starthourlist[count] = setTime.hour;
                            startMinlist[count] = setTime.minute;
                            startseclist[count] = setTime.second;
                            stationcntlist[count] =
                              legs.steps[i].stations.length;
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
                              list[cnt] = legs.steps[i].stations[j - 1].name;
                              codelist[cnt] =
                                legs.steps[i].stations[j - 1].displayCode;
                              cnt++;
                            } else {
                              placelist[count] =
                                legs.steps[i].stations[j - 1].placeId;
                              starthourlist[count] = legs.steps[
                                i
                              ].arrivalTime.substring(11, 13);
                              startMinlist[count] = legs.steps[
                                i
                              ].arrivalTime.substring(14, 16);
                              startseclist[count] = legs.steps[
                                i
                              ].arrivalTime.substring(17, 19);
                              count++;
                            }
                            transcount++;
                          }

                          console.log("placelist", placelist);
                          console.log(
                            "환승역과 환승역 사이의 역 개수",
                            stationcntlist
                          );
                          console.log(
                            "환승역과 출발역에서 타야하는 시간, 마지막은 도착시간",
                            starthourlist,
                            startMinlist,
                            startseclist
                          );
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
                            //건영이 추가
                            PT: placelist,
                            sLat: ccodelat,
                            sLng: ccodelng,
                            eLat: endlat,
                            eLng: endlng,
                            startOKColor: startOK,
                            tranferOKColor: transferOK,
                            stationcntlist: stationcntlist,
                            starthourlist: starthourlist,
                            startMinlist: startMinlist,
                            startseclist: startseclist,
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
}

export default MapScreen;

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
`;

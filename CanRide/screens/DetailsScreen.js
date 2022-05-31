import * as React from "react";
//import MapView from "react-native-maps";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import metro from "../JSON/metro.json";
//import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import code from "../JSON/서울시 지하철역 정보 검색 (역명).json";
import axios from "axios";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import styles from "../styles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const DetailsScreen = ({ route, navigation }) => {
  const {
    S,
    SName,
    Lcolor,
    cnt,
    Tname,
    T,
    E,
    EName,
    startOKColor,
    transferOKColor,
    //건영이 추가
    PT,
    sLat,
    sLng,
    eLat,
    eLng,
    stationcntlist,
    starthourlist,
    startMinlist,
    startseclist,
  } = route.params;

  let Possible;

  if (startOKColor == true) {
    Possible = "탈 수 이써!";
  } else {
    Possible = "탈 수 업써!";
  }

  return (
    <View style={styles.DetailContainer}>
      <View style={styles.leftWrap}>
        <View style={styles.start}>
          <Text
            style={
              startOKColor
                ? [styles.startName, { color: Lcolor[0] }]
                : [styles.startName, { color: Lcolor[0] }, styles.fail]
            }
          >
            {SName}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={
                startOKColor ? styles.arrow : [styles.arrow, styles.failArrow]
              }
            >
              &darr;
            </Text>
            <Text>{stationcntlist[0]}개역 이동</Text>
          </View>
        </View>
        <View style={styles.transfer}>
          {Tname.map((transfer, index) => (
            <View style={[styles.middle, { flex: index - 1 }]} key={index}>
              <Text
                key={index}
                style={
                  transferOKColor[index + 1]
                    ? [styles.transferName, { color: Lcolor[index + 1] }]
                    : [
                        styles.transferName,
                        { color: Lcolor[index + 1] },
                        styles.fail,
                      ]
                }
              >
                {Tname[index]}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={
                    startOKColor
                      ? styles.arrow
                      : [styles.arrow, styles.failArrow]
                  }
                >
                  &darr;
                </Text>
                <Text>{stationcntlist[index + 1]}개역 이동</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.end}>
          <Text
            style={
              startOKColor
                ? [styles.endName, { color: Lcolor[cnt] }]
                : [styles.endName, { color: Lcolor[cnt] }, styles.fail]
            }
          >
            {EName}
          </Text>
        </View>
      </View>
      <View style={styles.rightWrap}>
        <View style={[styles.additionalInformation, { flex: 2.5 }]}>
          <Text style={styles.PName}>{Possible}</Text>
        </View>
        <View
          style={{
            //flex: 1.2,
            justifyContent: "center",
            flexDirection: "row",
            //alignItems: "flex-end",
            // backgroundColor: "green",
            //position: "absolute",
            //height: SCREEN_HEIGHT,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              let sLine = "";
              let eLine = "";
              const station_code = code.DATA;
              //let distance = 0;
              for (var i = 0; i < station_code.length; i++) {
                if (station_code[i]["fr_code"] === S) {
                  sLine = station_code[i]["line_num"];
                }
                if (station_code[i]["fr_code"] === E) {
                  eLine = station_code[i]["line_num"];
                }
              }
              const desID = PT[1];
              const walk_url = encodeURI(
                `https://map.naver.com/v5/api/dir/findwalk?lo=ko&st=1&o=all&l=${sLng},${sLat},${SName}역%2${sLine},${PT[0]};${eLng},${eLat},${EName}역%2${eLine},${desID}&lang=ko`
              );
              axios.get(walk_url).then((data) => {
                let distance = data.data.routes[0].summary.distance;
                let duration = data.data.routes[0].summary.duration;
                let stepCount = data.data.routes[0].summary.stepCount;
                navigation.navigate("Walk", {
                  S: S,
                  E: E,
                  sLat: sLat,
                  sLng: sLng,
                  eLat: eLat,
                  eLng: eLng,
                  PT: PT,
                  SName: SName,
                  EName: EName,
                  distance: distance,
                  duration: duration,
                  stepCount: stepCount,
                });
              });
            }}
          >
            <Ionicons name="walk" size={80} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              let sLine = "";
              let eLine = "";
              const station_code = code.DATA;
              const desID = PT[PT.length - 1];
              const bike_url = encodeURI(
                `https://map.naver.com/v5/api/dir/findbicycle?start=${sLng},${sLng},placeid=${PT[0]},name=${SName}역%2${sLine}&destination=${eLng},${eLat},placeid=${desID},name=${EName}역%2${eLine}&call=route3&output=json&result=webmobile&coord_type=lnglat&search=8&lang=ko`
              );
              //let distance = 0;
              for (var i = 0; i < station_code.length; i++) {
                if (station_code[i]["fr_code"] === S) {
                  sLine = station_code[i]["line_num"];
                }
                if (station_code[i]["fr_code"] === E) {
                  eLine = station_code[i]["line_num"];
                }
              }
              axios.get(bike_url).then((data) => {
                //console.log(data.data.routes[0].summary);
                let distance = data.data.routes[0].summary.distance;
                let duration = data.data.routes[0].summary.duration;
                let taxi_fare = data.data.routes[0].summary.taxi_fare;
                navigation.navigate("Bike", {
                  distance: distance,
                  duration: duration,
                });
              });
            }}
          >
            <Ionicons name="bicycle" size={80} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DetailsScreen;

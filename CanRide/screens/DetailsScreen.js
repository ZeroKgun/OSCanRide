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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "../styles";

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
    tranferOKColor,
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
          <Text
            style={
              startOKColor ? styles.arrow : [styles.arrow, styles.failArrow]
            }
          >
            &darr;
          </Text>
        </View>
        <View style={styles.transfer}>
          {Tname.map((transfer, index) => (
            <View style={[styles.middle, { flex: `${index - 1}` }]}>
              <Text
                key={index}
                style={
                  startOKColor
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
              <Text
                style={
                  startOKColor ? styles.arrow : [styles.arrow, styles.failArrow]
                }
              >
                &darr;
              </Text>
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
        <View stlye={styles.boxWrap}>
          <View style={styles.additionalInformation}>
            <Text style={styles.PName}>{Possible}</Text>
          </View>
        </View>
        <View>
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
              const desID = PT[PT.length - 1];
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
            <Text>🚶🏻‍♂️</Text>
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
                  taxi_fare: taxi_fare,
                });
              });
            }}
          >
            <Text>🚲</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DetailsScreen;

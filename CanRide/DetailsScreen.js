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
import metro from "./metro.json";
//import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import code from "./서울시 지하철역 정보 검색 (역명).json";
import axios from "axios";
import haversine from "haversine-distance";
//import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "./styles";

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
  } = route.params;

  let Possible;

  if (startOKColor == true) {
    Possible = "탈 수 이써!";
  }
  else {
    Possible = "탈 수 업써!";
  }

  return (
    <View style={styles.DetailContainer}>
      <View style={styles.leftWrap}>
        <View style={styles.start}>
          <Text style={startOKColor ?
            [styles.startName, { color: Lcolor[0] }] :
            [styles.startName, { color: Lcolor[0] }, styles.fail]}>
            {SName}
          </Text>
          <Text style={startOKColor ?
            styles.arrow :
            [styles.arrow, styles.failArrow]}>
            &darr;
          </Text>
        </View>
        <View style={styles.transfer}>
          {Tname.map((transfer, index) => (
            <View style={styles.middle}>
              <Text style={startOKColor ?
                [styles.transferName, { color: Lcolor[index + 1] }] :
                [styles.transferName, { color: Lcolor[index + 1] }, styles.fail]}>
                {Tname[index]}
              </Text>
              <Text style={startOKColor ? styles.arrow : [styles.arrow, styles.failArrow]}>&darr;</Text>
            </View>
          ))}
        </View>
        <View style={styles.end}>
          <Text style={startOKColor ?
            [styles.endName, { color: Lcolor[cnt] }] :
            [styles.endName, { color: Lcolor[cnt] }, styles.fail]}>
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
      </View>
    </View>
  );
};

export default DetailsScreen;

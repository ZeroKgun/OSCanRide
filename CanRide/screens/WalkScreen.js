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
  fetch,
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
import WalkMan from "../animeJS/WalkMan";

let today = new Date();
let hours = today.getHours();

function WalkScreen({ route, navigation }) {
  const { distance, duration, stepCount } = route.params;
  console.log("거리", distance);
  console.log("시간", duration);
  console.log("도보수", stepCount);

  const hourormin = () => {
    if (duration > 3600) {
      return (
        <Text style={styles.walkdistanceText}>
          소요시간: {(duration / 3600).toFixed(1)}시간
        </Text>
      );
    } else {
      return (
        <Text style={styles.walkdistanceText}>
          소요시간: {(duration / 60).toFixed(1)}분
        </Text>
      );
    }
  };

  const howHard = () => {
    {
      if (distance > 6000) {
        return <Text style={[{ color: "red" }]}>멀어요!</Text>;
      } else if (distance <= 6000 && distance >= 1000) {
        return <Text style={[{ color: "orange" }]}>할만해요!</Text>;
      } else {
        return <Text style={[{ color: "green" }]}>코앞이네!</Text>;
      }
    }
  };

  if ((hours >= 0 && hours <= 5) || (hours <= 23 && hours >= 19)) {
    return (
      <View style={[styles.walkcontainer, { backgroundColor: "grey" }]}>
        <View style={styles.distance}>
          <Text style={[styles.walkdistanceText, { color: "yellow" }]}>
            거리: {(distance / 1000).toFixed(1)}km
          </Text>
          <Text style={[styles.walkdistanceText, { color: "yellow" }]}>
            도보수: {stepCount}걸음
          </Text>
          <Text style={{ color: "yellow" }}>{hourormin()}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey",
          }}
        >
          <Text style={{ fontSize: 20 }}>{howHard()}</Text>
          <WalkMan />
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.walkcontainer, { background: "cyan" }]}>
        <View style={styles.distance}>
          <Text style={[styles.walkdistanceText, { color: "white" }]}>
            거리: {(distance / 1000).toFixed(1)}km
          </Text>
          <Text style={[styles.walkdistanceText, { color: "white" }]}>
            도보수: {stepCount}걸음
          </Text>
          <Text>{hourormin()}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey",
          }}
        >
          <Text style={{ fontSize: 20 }}>{howHard()}</Text>
          <WalkMan />
        </View>
      </View>
    );
  }
}

export default WalkScreen;

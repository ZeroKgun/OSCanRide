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
  const { S, SName, E, EName, T, Tname, Lcolor, cnt } = route.params;
  const transferlist = () => {
    return Tname.map((element, index) => {
      return (
        <View key={index}>
          <Text style={[styles.transferName, { color: Lcolor[index + 1] }]}>
            환승역
          </Text>
          <Text>{Tname[index]}</Text>
        </View>
      );
    });
  };

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

export default DetailsScreen;

import React, { useEffect, useState } from "react";
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
//import { useState, useEffect, useRef } from "react";
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
//import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import DetailsScreen from "./DetailsScreen";
import LottieView from "lottie-react-native";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delay_splash() {
  await SplashScreen.preventAutoHideAsync();
  await sleep(2100);
  await SplashScreen.hideAsync();
}

function app() {
  delay_splash();

  const [loaded, setLoaded] = useState(false);
  if (loaded == false) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          margin: 0,
        }}
      >
        <LottieView
          source={require("./animations/loadingTrain.json")}
          autoPlay
          loop={false}
          resizeMode="cover"
          onAnimationFinish={() => {
            setLoaded(true);
          }}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Map">
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default app;

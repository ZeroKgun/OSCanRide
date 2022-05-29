import * as React from "react";
//import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert } from "react-native";
import styled from "styled-components";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import metro from "./metro.json";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const desc = [];

const app = ({ navigation }) => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.548014,
    longitude: 127.074658,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [mapWidth, setMapWidth] = useState("99%");
  const [location, setLocation] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [inputText, setInputText] = useState("");

  const ccode = {};

  const updateMapStyle = () => {
    setMapWidth("100%");
  };

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

  return (
    <Wrapper style={{ backgroundColor: "white" }}>
      <View style={styles.centeredView}>
        <MapView
          initialRegion={initialRegion}
          style={[styles.map, { width: SCREEN_WIDTH }]}
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
                  //Alert.alert(ccode);
                  Alert.alert(marker.name);
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
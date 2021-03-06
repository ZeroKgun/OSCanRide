import React, { useState } from "react";
//import MapView from "react-native-maps";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MapScreen from "./screens/MapScreen";
import DetailsScreen from "./screens/DetailsScreen";
import WalkScreen from "./screens/WalkScreen";
import BikeScreen from "./screens/BikeScreen.js";
import LottieView from "lottie-react-native";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delay_splash() {
  await SplashScreen.preventAutoHideAsync();
  await sleep(2000);
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
          <Stack.Screen
            name="Walk"
            component={WalkScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Bike"
            component={BikeScreen}
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

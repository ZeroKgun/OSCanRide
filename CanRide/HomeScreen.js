import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "./styles";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>탈수이써!</Text>
      <Button title="타러 가자!" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

export default Home;

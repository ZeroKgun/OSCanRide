import * as React from "react";
//import MapView from "react-native-maps";
import { Text, View } from "react-native";
import styles from "../styles";
import BikeMan from "../animeJS/BikeMan";

let today = new Date();
let hours = today.getHours();

function BikeScreen({ route, navigation }) {
  const { distance, duration } = route.params;
  console.log("거리", distance);
  console.log("시간", duration);

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
      } else if (distance <= 6000 && distance >= 2000) {
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
          <BikeMan />
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.walkcontainer, { backgroundColor: "cyan" }]}>
        <View style={styles.distance}>
          <Text style={[styles.walkdistanceText, { color: "white" }]}>
            거리: {(distance / 1000).toFixed(1)}km
          </Text>
          <Text style={{ color: "white" }}>{hourormin()}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "cyan",
          }}
        >
          <Text style={{ fontSize: 20 }}>{howHard()}</Text>
          <BikeMan />
        </View>
      </View>
    );
  }
}

export default BikeScreen;

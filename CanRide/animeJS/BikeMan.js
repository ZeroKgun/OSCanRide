import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

function BikeMan() {
  const animation = useRef(null);
  useEffect(() => {}, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop
        ref={animation}
        style={{
          width: "100%",
          height: 200,
          //backgroundColor: "#eee",
        }}
        source={require("../animations/bikeman.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    //backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default BikeMan;

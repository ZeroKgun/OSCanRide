import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

function WalkMan() {
  const animation = useRef(null);
  useEffect(() => {}, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop
        ref={animation}
        style={{
          width: 200,
          height: 200,
          //backgroundColor: "#eee",
        }}
        source={require("../animations/walkman.json")}
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

export default WalkMan;

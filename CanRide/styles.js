import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  background: {
    flex: 0,
  },
  bottomSheetContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  iconContainer: {
    backgroundColor: "#e7e7e7",
    padding: 7,
    borderRadius: 10,
    marginRight: 15,
  },
  locationText: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "black",
  },
  container: {
    margin: 20,
  },
  textInput: {
    fontSize: 20,
    paddingTop: 0,
  },
  button: {
    backgroundColor: "#D6C6B6",
    marginTop: 0,
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  DetailContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  start: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  startName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  transfer: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  transferName: {
    fontSize: 58,
    fontWeight: "500",
    color: "red",
  },
  end: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  endName: {
    fontSize: 58,
    fontWeight: "500",
    color: "green",
  },
});

export default styles;

import React, { useState } from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";

type CompassProps = {
  onBrujulaPress: () => void;
};

export default function CompassBtn({ onBrujulaPress }: CompassProps) {
  return (
    <View style={styles.btnBrujula}>
      <Pressable onPress={onBrujulaPress}>
        <Image
          source={require("../assets/brujula.png")}
          style={styles.brujulaIcon}
        />
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
  },
  btnBrujula: {
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  brujulaIcon: {
    width: 50,
    height: 50,
    
  },
});

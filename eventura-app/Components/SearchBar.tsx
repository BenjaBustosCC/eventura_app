import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SearchBarProps = {
  onSearch: (text: string) => void;
  onBrujulaPress: () => void;
};

export default function SearchBar({
  onSearch,
  onBrujulaPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#b42e1f"
          style={styles.btnSearch}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar eventos"
          placeholderTextColor="#b42e1f"
          onChangeText={onSearch}
        />
      </View>
      <TouchableOpacity style={styles.btnBrujula} onPress={onBrujulaPress}>
        <Image
          source={require("../assets/brujula.png")}
          style={styles.brujulaIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  bar: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  brujulaIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSearch: {
    marginRight: 8,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
  },
  btnBrujula: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});

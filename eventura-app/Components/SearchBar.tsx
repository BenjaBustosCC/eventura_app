import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SearchBarProps = {
  onSearch: (text: string) => void;
};

export default function SearchBar({
  onSearch,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
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
});

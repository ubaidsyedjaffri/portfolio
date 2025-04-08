import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "c69bf8e7b3377acd89859385f4cc85d3";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface ForecastData {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data: WeatherData = await response.json();
      if (data.name) {
        setWeather(data);
        fetchForecast(city);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.list) {
        setForecast(
          data.list.filter((item: any) => item.dt_txt.includes("12:00:00"))
        );
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Weather App" }} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity onPress={fetchWeather} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>
          <Text>{weather.weather[0].description}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            }}
            style={styles.icon}
          />
        </View>
      )}
      {forecast.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.forecastContainer}
        >
          {forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastText}>
                {new Date(day.dt * 1000).toDateString().split(" ")[0]}
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
                }}
                style={styles.iconSmall}
              />
              <Text style={styles.forecastText}>{day.main.temp}°C</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 21,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  weatherContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  temp: {
    fontSize: 30,
    fontWeight: "bold",
  },
  icon: {
    width: 100,
    height: 100,
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastItem: {
    height: 140,
    width: 120,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  forecastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconSmall: {
    width: 50,
    height: 50,
  },
});

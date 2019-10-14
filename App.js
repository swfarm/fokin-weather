import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "a9076154beb82a982b2f521ea28e6422";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    // 요청문자열 때문에 백틱 문자열로 변경함 (변수를 문자열에 포함시키려고)
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync(); // 권한 받기 기다리기
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync(); // 원하는 정보만 가져오기
      this.getWeather(latitude, longitude);  // api 보내서 날씨 정보 받아오게 하기
    } catch (error) {
      Alert.alert("위치 못 찾겠음, 허용해라");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
      // 안되면 Weather.js 리턴시키고 되면 Loading.js로 가자 (온도호출 소수점 제외)
    );
  }
}
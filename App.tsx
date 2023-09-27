import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';

const Stack = createStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState({
    loggedIn: false,
    loaded: false
  });

  useEffect(() => {
    FIREBASE_AUTH.onAuthStateChanged((user: any) => {
      console.log("------user-----", user, "------user-----")
      if(!user) {
        setAuthState(prevState => ({
          ...prevState, 
          loggedIn: false,
          loaded: true
        })); 
      } else {
        setAuthState(prevState => ({
          ...prevState, 
          loggedIn: true,
          loaded: true
        })); 
      }
    })
  },[]);

  const isUserLoaded = () => {
    if (!authState.loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      );
    }
  
    if (!authState.loggedIn) {
      return (
        <Stack.Navigator initialRouteName="landing">
          <Stack.Screen 
            name="landing" 
            component={LandingScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen 
            name="register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen 
            name="login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack.Navigator>
      );
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>User logged in</Text>
      </View>
    );
  }
  

  return (
    <NavigationContainer>
      {isUserLoaded()}
      {/* <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen 
          name="register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

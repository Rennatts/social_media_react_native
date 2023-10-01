import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { store } from './components/redux/store';
import TakePicture from './components/main/TakePicture';
import CreatePost from './components/main/CreatePost';
import SearchUser from './components/main/SearchUser';

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
      <Provider store={store}>
        <Stack.Navigator initialRouteName="landing">
          <Stack.Screen 
            name="main" 
            component={Main} 
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen 
            name="searchUser" 
            component={SearchUser}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen 
            name="add_post" 
            component={TakePicture} 
          ></Stack.Screen>
          <Stack.Screen 
            name="createPost" 
            component={CreatePost}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack.Navigator>
      </Provider>
    );
  }
  

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {isUserLoaded()}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 25 : 0, 
    flex: 1,
  }
});

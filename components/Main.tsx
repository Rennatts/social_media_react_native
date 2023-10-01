import React, { ReactNode, useEffect } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from './redux/actions/index';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import { FIREBASE_AUTH } from '../firebaseConfig';


const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

function Main(props: any): ReactNode {

    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (user) {
                props.fetchUser();
            } else {
                // You might want to handle logout here, for example:
                // props.logoutUser();
            }
        });

        // Clean up the listener on component unmount.
        return () => unsubscribe();
    }, []);


    const showUserInfo = () => {
        if (props.currentUser === undefined) {
            return <View></View>;
        }

        return (
            <Tab.Navigator initialRouteName='feed' labeled={false}>
                <Tab.Screen 
                name="feed" 
                component={FeedScreen}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                        name="home" 
                        color={color}
                        size={26}
                        ></MaterialCommunityIcons>
                    )
                }}/>
                <Tab.Screen 
                name="AddContainer" 
                component={EmptyScreen}
                listeners={({navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("add_post")
                    }
                })}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                        name="plus-box" 
                        color={color}
                        size={26}
                        ></MaterialCommunityIcons>
                    )
                }}/>
                <Tab.Screen 
                name="profile" 
                component={ProfileScreen}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                        name="account-circle" 
                        color={color}
                        size={26}
                        ></MaterialCommunityIcons>
                    )
                }}/>
            </Tab.Navigator>
        );
    }

    return showUserInfo();
}

const mapStateToProps = (store: any) => ({
    currentUser: store.userState.currentUser
});

const mapDispatchProps = (dispatch: Dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);

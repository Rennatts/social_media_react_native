import React, { ReactNode, useEffect } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from './redux/actions/index';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import AddPostScreen from './main/AddPost';



const Tab = createBottomTabNavigator();

function Main(props: any): ReactNode {
    useEffect(() => {
        props.fetchUser();
        console.log("----currentUser------", props.currentUser, "----currentUser------");
    }, []);

    const showUserInfo = () => {
        if (props.currentUser === undefined) {
            return <View></View>;
        }

        return (
            <Tab.Navigator>
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
                <Tab.Screen 
                name="add_post" 
                component={AddPostScreen}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                        name="plus-blox" 
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

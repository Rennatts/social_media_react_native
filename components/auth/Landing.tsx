import React from 'react'
import { Button, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    register: undefined;
    login: undefined;
};

type LandingProps = {
    navigation: StackNavigationProp<RootStackParamList, 'register' | 'login'>;
}

export default function Landing({ navigation }: LandingProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center'}}>
            <Button 
                title="Register" 
                onPress={() => navigation.navigate('register')} 
            />
            <Button 
                title="Login" 
                onPress={() => navigation.navigate('login')} 
            />
        </View>
    )
}

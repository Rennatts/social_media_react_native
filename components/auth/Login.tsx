import React, { useRef } from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';

type FormData = {
    email: string;
    password: string;
};

export default function Login() {
    const emailRef = useRef<string>('');
    const passwordRef = useRef<string>('');

    const handleSubmit = () => {
        const data: FormData = {
            email: emailRef.current,
            password: passwordRef.current
        };

        console.log(data);

        signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
        .then((result: any) => {
            console.log("result", result);
            // navigator.navigate('landing')
        })
        .catch((error: any) => {
            console.log("error", error);
            Alert.alert("Error", error.message); 
        });
    };

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Email"
                keyboardType="email-address"
                style={styles.input}
                onChangeText={text => emailRef.current = text}
                defaultValue={emailRef.current}
            />
            <TextInput 
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                onChangeText={text => passwordRef.current = text}
                defaultValue={passwordRef.current}
            />
            <Button title="Sign In" onPress={handleSubmit} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        paddingHorizontal: 8,
    }
});

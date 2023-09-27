import React, { useRef } from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';

type FormData = {
    email: string;
    password: string;
    name: string;
};

export default function Register() {
    const nameRef = useRef<string>('');
    const emailRef = useRef<string>('');
    const passwordRef = useRef<string>('');

    const handleSubmit = () => {
        const data: FormData = {
            name: nameRef.current,
            email: emailRef.current,
            password: passwordRef.current
        };

        console.log(data);

        createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
        .then((result: any) => {
            console.log("result", result);
            Alert.alert("Success!", "You have been successfully registered!"); 
        })
        .catch((error: any) => {
            console.log("error", error);
            Alert.alert("Error", error.message); 
        });
    };

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Name" 
                style={styles.input}
                onChangeText={text => nameRef.current = text}
                defaultValue={nameRef.current}
            />
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
            <Button title="Sign Up" onPress={handleSubmit} />
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

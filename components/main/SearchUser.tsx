import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { where, query, getDocs, collection } from '@firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

type Users = {
    name: string,
    uid: string;
}

export default function SearchUser() {
    const [ users, setUsers ] = useState<Users[]>([]);
    const navigation = useNavigation();

    const fetchUsers = async (search: string) => {
        const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
        const usersQuery = query(usersCollection, where('name', '>=', search));
        
        const querySnapshot = await getDocs(usersQuery);
        const fetchedUsers: Users[] = [];
        querySnapshot.forEach((doc) => {
            fetchedUsers.push(doc.data() as Users);
        });
        
        setUsers(fetchedUsers); 
    }
    

    return (
        <View>
            <TextInput 
            placeholder="Search for users" 
            onChangeText={(search) => fetchUsers(search)}
            ></TextInput>

            <FlatList 
            numColumns={1} 
            horizontal={false} 
            data={users}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => navigation.navigate('profile', {uid: item.uid})}>
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            )}
            ></FlatList>
        </View>
    )
}

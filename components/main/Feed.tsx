import React, { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { where, query, getDocs, collection } from '@firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';

type Users = {
    name: string,
    uid: string;
}

export default function Feed() {
    const [ users, setUsers ] = useState<Users[]>([]);

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
                <Text>{item.name}</Text>
            )}
            ></FlatList>
        </View>
    )
}

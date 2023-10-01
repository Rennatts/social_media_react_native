import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { query, where, collection, getDocs } from '@firebase/firestore';

type Post = {
    id: string;
    imageUrl: string;
    caption: string;
};


export default function Profile() {
    const [posts, setPosts] = useState<Post[]>([]);

    const uid = FIREBASE_AUTH.currentUser?.uid;

    useEffect(() => {
        if (!uid) {
            console.error("User not logged in!");
            return;
        }

        // Define a query to fetch posts from Firestore where uid matches the current user's uid
        const postsQuery = query(collection(FIREBASE_FIRESTORE, 'posts'), where('uid', '==', uid));

        // Fetch the posts
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(postsQuery);
            const fetchedPosts: any[] = [];
            querySnapshot.forEach(doc => {
                fetchedPosts.push({ ...doc.data(), id: doc.id });
            });
            setPosts(fetchedPosts);
        }

        fetchPosts();
    }, [uid]);

    const PostItem = ({ post }: { post: Post }) => (
        <View>
            <Image source={{uri: post.imageUrl}} style={{width: 100, height: 100}} />
            <Text>{post.caption}</Text>
        </View>
    );
    

    return (
        <View style={{ flex: 1 }}>
            <Text>Profile</Text>
            <FlatList 
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <PostItem post={item} />} 
            />
        </View>
    );
}

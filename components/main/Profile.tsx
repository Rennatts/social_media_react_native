import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, StyleSheet} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { query, where, collection, getDocs } from '@firebase/firestore';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';


type Post = {
    id: string;
    imageUrl: string;
    caption: string;
    createdAt: string;
};


function Profile(props: any) {
    const [posts, setPosts] = useState<Post[]>([]);
    const userName = props.currentUser?.name;

    const uid = FIREBASE_AUTH.currentUser?.uid;

    const postsQuery = useMemo(() => {
        return query(collection(FIREBASE_FIRESTORE, 'posts'), where('uid', '==', uid));
    }, [uid]);
    
    const fetchedPosts = useMemo(async () => {
        const querySnapshot = await getDocs(postsQuery);
        const postsArray: any[] = [];
        querySnapshot.forEach(doc => {
            postsArray.push({ ...doc.data(), id: doc.id });
        });
        return postsArray;
    }, [postsQuery]);


    useEffect(() => {
        if (!uid) {
            console.error("User not logged in!");
            return;
        }


        (async () => {
            const result = await fetchedPosts;
            setPosts(result);
        })();
    }, [fetchedPosts, uid]);

    const Posts = ({ post }: { post: Post }) => (
        <View style={styles.imageBox}>
            <Image source={{uri: post.imageUrl}} style={styles.image} />
            <Text style={styles.captionArea}>{post.caption}</Text>
        </View>
    );
    

    return (
        <View style={{ flex: 1 }}>
            <Text>Profile</Text>
            {userName && <Text>{userName}</Text>}
            <FlatList 
                style={styles.container}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <Posts post={item} />} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBox: {
        flex: 1,
        alignItems: 'center',
        marginTop: '10%', 
        marginLeft: '5%', 
        marginRight : '5%', 
    },
    image: {
        width: '100%', 
        aspectRatio: 16/9,
        resizeMode: 'cover'
    },
    captionArea: {
        padding: '5%',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        width: '100%',
    }
});


const mapStateToProps = (store: any) => ({
    currentUser: store.userState.currentUser
});

const mapDispatchProps = (dispatch: Dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Profile);


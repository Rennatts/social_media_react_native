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

// Props you expect to be passed to the component
interface OwnProps {
    uid?: string;
}

// Using ReturnType to infer the state shape from your mapStateToProps
type StateProps = ReturnType<typeof mapStateToProps>;

// Using ReturnType to infer the dispatch props shape from your mapDispatchProps
type DispatchProps = ReturnType<typeof mapDispatchProps>;

// Combining all the above props
type ProfileProps = OwnProps & StateProps & DispatchProps;


function Profile({ uid, currentUser, fetchUser }: ProfileProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const userName = currentUser?.name;

    const ProfileUid = FIREBASE_AUTH.currentUser?.uid || uid;

    const postsQuery = useMemo(() => {
        return query(collection(FIREBASE_FIRESTORE, 'posts'), where('uid', '==', ProfileUid));
    }, [ProfileUid]);
    
    const fetchedPosts = useMemo(async () => {
        const querySnapshot = await getDocs(postsQuery);
        const postsArray: any[] = [];
        querySnapshot.forEach(doc => {
            postsArray.push({ ...doc.data(), id: doc.id });
        });
        return postsArray;
    }, [postsQuery]);


    useEffect(() => {
        if (!ProfileUid) {
            console.error("User not logged in!");
            return;
        }


        (async () => {
            const result = await fetchedPosts;
            setPosts(result);
        })();
    }, [fetchedPosts, ProfileUid]);

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


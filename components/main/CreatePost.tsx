import React, { useRef } from 'react'
import { Button, TextInput, StyleSheet, Text, View, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, FIREBASE_STORAGE } from '../../firebaseConfig';
import { getDownloadURL, uploadBytes, ref } from '@firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  feed: undefined;
};


type CreatePostProps = {
  navigation: StackNavigationProp<RootStackParamList, 'feed'>;
  route: {
    params: {
      image: string;
    };
  };
};

export default function CreatePost({ route, navigation }: CreatePostProps) {
  const { image } = route.params;
  const postCaptionRef = useRef<string>('');
  console.log("==========", route, "========");

  const uploadImage = async () => {
    try {
      // Convert the image URI to a blob
      const blob = await uriToBlob(image);
      console.log("blob", blob, "blob")
  
      // Upload the image to Firebase Storage
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (!uid) throw new Error("User not logged in!");
      const storageRef = ref(FIREBASE_STORAGE, 'post/' + uid + Math.random().toString(16) + '.jpg');
      console.log("--storageRef--", storageRef, "--storageRef---");

      await uploadBytes(storageRef, blob);
    
      const imageUrl = await getDownloadURL(storageRef);
      console.log("====imageUrl====", imageUrl, "====imageUrl====")

      const postsCollection = collection(FIREBASE_FIRESTORE, 'posts');

      const newPost = {
        imageUrl: imageUrl,
        caption: postCaptionRef.current,
        uid: uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(postsCollection, newPost);

      alert('Post uploaded successfully!');
  
    } catch (error) {
      console.log("---error-------", error)

      alert('Error uploading post ');
    }
  };
  
  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };
  
  return (
    <View style={{ flex: 1 }}>
      <Button title="X" onPress={() => navigation.navigate("feed")}></Button>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }}></Image>}
      <TextInput 
        onChangeText={text => postCaptionRef.current = text}
        defaultValue={postCaptionRef.current}
        style={{ flex: 1 }} 
        placeholder='write a caption...'
      ></TextInput>
      <Button title="Save" onPress={() => uploadImage()}></Button>
    </View>
  )
}

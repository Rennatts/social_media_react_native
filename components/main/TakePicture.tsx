import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    createPost: { image: string };
};

type AppPostProps = {
    navigation: StackNavigationProp<RootStackParamList, 'createPost'>;
}

export default function TakePicture({ navigation }: AppPostProps) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<any>(null)
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if(camera) {
        const data = await camera.takePictureAsync(null);
        setImage(data.uri);
    }
  }

  console.log("--image---", typeof(image), "---image----")

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const saveToGallery = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
  
    if (status !== 'granted') {
      alert('Permission is required to save the image to your gallery.');
      return;
    }
  
    await MediaLibrary.createAssetAsync(image);
    alert('Image saved to gallery!');
  }  

  const takeAnotherPhoto = async () => {
    setImage(null);
  }

  return (
    <View style={styles.container}>
        {image ? 
        (
            <>
                <Image source={{uri: image}} style={{flex: 1}}></Image>
                <Button title="Save to Gallery" onPress={saveToGallery} />
                <Button title="Create a post" onPress={() => navigation.navigate('createPost', {image: image}) } />
                <Button title="Take another photo" onPress={takeAnotherPhoto} />
            </>
        ) : 
        (
            <>
            <Camera 
            style={styles.camera} 
            type={type} 
            ratio={'1:1'}
            ref={ref => setCamera(ref)}>
            </Camera>
            <View style={styles.buttonContainer}>
                <Button title="take a picture" onPress={()=> takePicture()}></Button>
                <Button onPress={toggleCameraType} title='Flip Camera' />
            </View>
            </>
        )
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

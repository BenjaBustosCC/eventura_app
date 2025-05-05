import React from 'react';
import { View, Image } from 'react-native'; 
import styles from './SplashScreen.styles';


const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/splash.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}

export default SplashScreen;
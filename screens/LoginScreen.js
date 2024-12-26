import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

export default function LoginScreen() {
    const navigation = useNavigation(); // Navigation hook

    const handleLogin = () => {
        // Navigate to TabBar when Login is pressed
        navigation.navigate('TabBar1');
    }

    return (
        <LinearGradient
            // Use the gradient colors for the background
            colors={['#ffeb3b', '#ff9800']}// You can customize the gradient colors
            style={{ flex: 1 }} // Make sure the gradient takes the full screen height and width
        >
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../assests/images/background.png')} />

            {/* lights */}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify().damping(3)} className="h-[205] w-[80]" source={require('../assests/images/light.png')} />
                <LottieView style={{flex: 1}} source={require('../assests/Run4.json')} autoPlay loop className="mt-5 h-[270] w-[100]"/>
                <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify().damping(4)} className="h-[140] w-[55]" source={require('../assests/images/light.png')} />
            </View>

            {/* title and form */}
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                {/* title */}
                <View className="flex items-center">
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider text-4xl mt-11">
                        Login
                    </Animated.Text>
                </View>

                {/* form */}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput placeholder='Email' placeholderTextColor={'gray'} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                        <TextInput placeholder='Password' placeholderTextColor={'gray'} secureTextEntry />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                        <TouchableOpacity
                            onPress={handleLogin} // Call the login handler
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3">
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('SignUp')}>
                            <Text className="text-sky-700 "> SignUp </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({})

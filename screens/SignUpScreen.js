import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                },
            });
    
            if (signUpError) {
                alert('Sign-up failed: ' + signUpError.message);
                return;
            }
    
            const userId = data.user?.id;
            if (userId) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        username: username,
                        email: email,
                    });
    
                if (insertError) {
                    alert('Failed to save user profile: ' + insertError.message);
                    return;
                }
            }
    
            alert('Sign-up successful! Please check your email for verification.');
            navigation.navigate('Login');
        } catch (error) {
            alert('Error signing up: ' + error.message);
        }
    };

    return (
        <LinearGradient
            colors={['#ffeb3b', '#ff9800']}
            style={{ flex: 1 }}
        >
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../assests/images/background.png')} />

            {/* Lights */}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
                    className="h-[205] w-[80]"
                    source={require('../assests/images/light.png')}
                />
                <LottieView
                    style={{ flex: 1 }}
                    source={require('../assests/Run4.json')}
                    autoPlay
                    loop
                    className="mt-[5] h-[220] w-[100]"
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify().damping(4)}
                    className="h-[140] w-[55]"
                    source={require('../assests/images/light.png')}
                />
            </View>

            {/* Title and Form */}
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                {/* Title */}
                <View className="flex items-center">
                    <Animated.Image
                        entering={FadeInUp.duration(1000).springify()}
                        className="h-[120] w-[150] mt-10"
                        source={require('../assests/images/L2G.png')}
                    />
                </View>

                <View className="flex items-center mx-4 space-y-4 mb-7">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-black/5 p-4 rounded-2xl w-full"
                    >
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={'gray'}
                            value={username}
                            onChangeText={setUsername}
                            style={{
                                fontSize: 14,
                                paddingVertical: Platform.OS === 'android' ? 8 : 12,
                            }}
                        />
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-4 rounded-2xl w-full"
                    >
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={{
                                fontSize: 14,
                                paddingVertical: Platform.OS === 'android' ? 8 : 12,
                            }}
                        />
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        className="bg-black/5 p-4 rounded-2xl w-full"
                    >
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={{
                                fontSize: 14,
                                paddingVertical: Platform.OS === 'android' ? 8 : 12,
                            }}
                        />
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="w-full"
                    >
                        <TouchableOpacity
                            onPress={handleSignUp}
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                        >
                            <Text className="text-xl font-bold text-white text-center">Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center"
                    >
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text className="text-sky-700"> Login </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </LinearGradient>
    );
}
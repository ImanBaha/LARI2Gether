// PinComponent.js  
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default class Pin extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { animation } = this.state;
    // Start animation loop for the pin
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    const { animation } = this.state;

    // Scale animation for the pulsing effect
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3], // Subtle pulsing effect
    });

    const opacity = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6], // Subtle glow fading in and out
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.outerRing,
            { transform: [{ scale }], opacity },
          ]}
        />
        <View style={styles.pin}>
          <View style={styles.innerPin} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    backgroundColor: 'rgba(233, 172, 71, 0.4)', // Softer glow
    borderRadius: 80,
    width: 50,
    height: 50,
    position: 'absolute',
  },
  pin: {
    backgroundColor: 'rgb(233, 172, 71)', // Pin color
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3, // For Android
  },
  innerPin: {
    backgroundColor: 'white', // Inner white dot
    borderRadius: 7,
    width: 10,
    height: 10,
  },
});

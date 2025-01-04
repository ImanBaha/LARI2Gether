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
    // Start animation loop for the pin (for example, pulsing effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    const { animation } = this.state;
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.5], // Pulsing effect from 1 to 1.5 scale
    });

    return (
      <Animated.View style={[styles.outerPin, { transform: [{ scale }] }]}>
        <View style={styles.pin}>
          <View style={styles.innerPin} />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  outerPin: {
    backgroundColor: 'rgba(233, 172, 71, 0.25)',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pin: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerPin: {
    backgroundColor: 'rgb(233, 172, 71)',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
});

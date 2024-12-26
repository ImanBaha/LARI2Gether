import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const quotes = [
    { id: 1, text: "Push yourself, because no one else is going to do it for you." },
    { id: 2, text: "The only bad workout is the one you didn’t do." },
    { id: 3, text: "Success doesn’t come from what you do occasionally, it comes from what you do consistently." },
    { id: 4, text: "Take care of your body. It’s the only place you have to live." },
    { id: 5, text: "Believe in yourself and all that you are." },
    { id: 6, text: "Your health is your wealth. Keep pushing." },
    { id: 7, text: "You don’t have to go fast, you just have to go." },
    { id: 8, text: "Every step you take is one step closer to your goal." },
    { id: 9, text: "The real workout starts when you want to stop." },
    { id: 10, text: "One run at a time. One mile at a time. Keep going." },
    { id: 11, text: "When your legs get tired, run with your heart." },
    { id: 12, text: "Run when you can, walk if you have to, crawl if you must—just never give up." },
    { id: 13, text: "You are stronger than you think." },
    { id: 14, text: "The body achieves what the mind believes." },
    { id: 15, text: "Don’t wait for inspiration. Become it." },
    { id: 16, text: "Run for those who can’t." },
    { id: 17, text: "Don’t watch the clock; do what it does. Keep going." },
    { id: 18, text: "Doubt kills more dreams than failure ever will." },
    { id: 19, text: "Running is a mental sport, and we’re all insane!" },
    { id: 20, text: "Pain is temporary; pride is forever." },
    { id: 21, text: "Every mile makes you stronger." },
    { id: 22, text: "Sweat now, shine later." },
    { id: 23, text: "Your only limit is you." },
    { id: 24, text: "The journey of a thousand miles begins with a single step." },
    { id: 25, text: "Keep running, keep believing, and you’ll achieve more than you ever imagined." }
];

const DailyMotivation = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);

      // Reset fade animation each time the quote changes
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // 1 second fade-in
        useNativeDriver: true,
      }).start();
    };

    // Change quote every 4 minutes
    const intervalId = setInterval(pickRandomQuote, 8000); // 240,000 ms = 4 minutes

    // Show an initial random quote with animation
    pickRandomQuote();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Motivation</Text>
      <Animated.Text style={[styles.quote, { opacity: fadeAnim }]}>
        {quote.text}
      </Animated.Text>
    </View>
  );
};

export default DailyMotivation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFC000',
    padding: 20,
    borderRadius: 12,
    marginBottom: 11,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
  },
});

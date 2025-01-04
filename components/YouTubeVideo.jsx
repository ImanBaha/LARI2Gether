// components/YouTubeVideo.jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const YouTubeVideo = ({ videoId }) => {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // Adjust the height as needed
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 113,
  },
  video: {
    flex: 1,
  },
});

export default YouTubeVideo;

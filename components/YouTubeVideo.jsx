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
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        source={{
          uri: `https://www.youtube.com/embed/${videoId}?playsinline=0&fs=1`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/html',
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  video: {
    flex: 1,
  },
});

export default YouTubeVideo;

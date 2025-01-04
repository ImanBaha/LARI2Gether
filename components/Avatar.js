import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import * as FileSystem from "expo-file-system";

const Avatar = ({ userId, profilePic, setProfilePic }) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profilePic);


  const pickImage = async () => {
    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required.');
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Select only images
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
        return;
      }

      const selectedImage = result.assets[0];
      // Read the file from the given URI as base64
      const base64 = await FileSystem.readAsStringAsync(selectedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the base64 to ArrayBuffer
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) { 
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      setUploading(true);

      const fileExt = selectedImage.uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const filename = `${userId}.${fileExt}`;

      // Upload the image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filename, byteArray.buffer, {
          contentType: "image/jpeg"
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
 
      if (urlError) {
        throw new Error(`Failed to get public URL: ${urlError.message}`);
      }

      const imageUrl = publicUrlData.publicUrl;

      // Update the avatar in the `profiles` table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: imageUrl })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      // Update local state with the new profile picture URL
      setAvatarUrl(imageUrl);
      setProfilePic({ uri: imageUrl });

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
      {uploading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <Image
          style={styles.avatar}
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : {
                  uri: 'https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/avatars/noProfile.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL25vUHJvZmlsZS5qcGciLCJpYXQiOjE3MzU2Mjg3NzEsImV4cCI6MTc2NzE2NDc3MX0.1u7N48IN1IV7kebPssbNJylkgmHN12UKJOW0erCbDmU&t=2024-12-31T07%3A06%3A11.736Z',
                }
          }
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default Avatar;

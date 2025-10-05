import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { VoiceAPI } from '@/services/api';

/**
 * Voice Upload Component
 * Allows users to upload audio files for voice cloning
 */
export default function VoiceUploadScreen() {
  const [uploading, setUploading] = useState(false);
  const [referenceId, setReferenceId] = useState(null);

  /**
   * Handle audio file selection and upload
   */
  const handleUploadAudio = async () => {
    try {
      // Step 1: Pick audio file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Step 2: Prepare file for upload
      setUploading(true);
      
      const audioFile = {
        uri: file.uri,
        type: file.mimeType || 'audio/wav',
        name: file.name,
      };

      // Step 3: Upload to backend
      const response = await VoiceAPI.uploadReference(audioFile, 'My Voice');
      
      // Step 4: Save reference ID
      setReferenceId(response.reference_id);
      
      Alert.alert(
        'Success!',
        `Audio uploaded successfully!\nReference ID: ${response.reference_id}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Test voice synthesis with uploaded reference
   */
  const handleTestVoice = async () => {
    if (!referenceId) {
      Alert.alert('No Voice', 'Please upload a reference audio first');
      return;
    }

    try {
      setUploading(true);
      
      const response = await VoiceAPI.synthesize(
        'Hello! This is a test of my custom voice.',
        { referenceId }
      );
      
      Alert.alert(
        'Voice Generated!',
        `Audio saved to: ${response.audio_path}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Synthesis error:', error);
      Alert.alert('Synthesis Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Voice Upload</Text>
      <Text style={styles.subtitle}>Upload audio to clone your voice</Text>

      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleUploadAudio}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>📁 Select & Upload Audio</Text>
        )}
      </TouchableOpacity>

      {/* Reference ID Display */}
      {referenceId && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Reference ID:</Text>
          <Text style={styles.infoValue}>{referenceId}</Text>
        </View>
      )}

      {/* Test Voice Button */}
      {referenceId && (
        <TouchableOpacity
          style={[styles.button, styles.testButton, uploading && styles.buttonDisabled]}
          onPress={handleTestVoice}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🎵 Test Custom Voice</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>📝 Instructions:</Text>
        <Text style={styles.instructionText}>1. Record a short audio clip (10-30 seconds)</Text>
        <Text style={styles.instructionText}>2. Click "Select & Upload Audio"</Text>
        <Text style={styles.instructionText}>3. Choose your audio file (.wav, .mp3)</Text>
        <Text style={styles.instructionText}>4. Wait for upload to complete</Text>
        <Text style={styles.instructionText}>5. Test your custom voice!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  testButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  instructions: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
});

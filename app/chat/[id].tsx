// app/(app)/chat/[id].tsx

import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Assuming you have expo vector icons installed

const { width } = Dimensions.get('window');

// --- DUMMY CHAT MESSAGE STRUCTURE ---
type ChatMessage = {
    id: string;
    text: string;
    sender: 'me' | 'echo';
    timestamp: string;
    audioUrl?: string; // Future: URL for the generated voice response
};

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: '1', text: "Hello dear. What's on your mind today?", sender: 'echo', timestamp: '10:00 AM' },
    { id: '2', text: "Hi, I just wanted to tell you I miss you.", sender: 'me', timestamp: '10:01 AM' },
];
// ------------------------------------

const ChatScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    // Retrieve the necessary parameters, including the full persona prompt
    const { id: echoId, name, descriptionPrompt } = params;

    const [messages, setMessages] = useState(INITIAL_MESSAGES.slice().reverse());
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false); // To disable input while waiting for response

    // Set the header title dynamically
    useLayoutEffect(() => {
        if (name) {
            navigation.setOptions({
                title: name as string,
                headerTitleStyle: { fontWeight: '600' }
            });
        }
    }, [name, navigation]);

    // Simulation of the Gemini/Backend API call
    const simulateEchoResponse = async (userMessage: string) => {
        // --- THIS IS THE CRITICAL LOGIC FOR YOUR PROJECT ---
        // 1. Send the `descriptionPrompt` + `conversation history` + `userMessage` 
        //    to Elizabeth's FastAPI endpoint.

        console.log("--- Sending to Backend ---");
        console.log("Echo ID:", echoId);
        console.log("Persona Prompt (Gemini Context):", descriptionPrompt);
        console.log("User Message:", userMessage);

        // Simulating the delay for Gemini processing and fish-speech TTS
        await new Promise(resolve => setTimeout(resolve, 2000));

        const echoReply: ChatMessage = {
            id: Date.now().toString() + '_echo',
            // Placeholder: This is the text that should come back from Gemini
            text: `(AI Response for ${name}): That reminds me of a story I once told you...`,
            sender: 'echo',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            audioUrl: 'https://example.com/audio/response_from_backend.mp3' // Future: Audio URL from fish-speech
        };

        // Add the Echo's response
        setMessages(prev => [echoReply, ...prev]);
    }

    const handleSend = async () => {
        const textToSend = inputText.trim();
        if (!textToSend) return;

        setIsSending(true);
        setInputText(''); // Clear input immediately

        const userMessage: ChatMessage = {
            id: Date.now().toString() + '_me',
            text: textToSend,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Add user message to the UI
        setMessages(prev => [userMessage, ...prev]);

        // Get Echo's response
        await simulateEchoResponse(textToSend);

        setIsSending(false);
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.otherMessage
        ]}>
            <Text style={[styles.messageText, item.sender === 'me' ? { color: '#FFFFFF' } : { color: '#2C2C2E' }]}>{item.text}</Text>
            <Text style={[styles.timestamp, item.sender === 'me' ? { color: 'rgba(255,255,255,0.7)' } : { color: '#8E8E93' }]}>{item.timestamp}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                inverted
            />

            {/* Input area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={`Write to ${name}...`}
                    placeholderTextColor="#999"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    editable={!isSending}
                />
                <TouchableOpacity
                    style={[styles.sendButton, { opacity: inputText.trim() && !isSending ? 1 : 0.4 }]}
                    activeOpacity={0.8}
                    onPress={handleSend}
                    disabled={!inputText.trim() || isSending}
                >
                    {isSending ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// ... (Styles remain the same)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F1E9', },
    listContent: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5, },
    messageBubble: { maxWidth: width * 0.75, padding: 12, borderRadius: 20, marginBottom: 8, },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#E6AFA4', borderTopRightRadius: 5, },
    otherMessage: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderTopLeftRadius: 5, },
    messageText: { fontSize: 16, lineHeight: 22, },
    timestamp: { fontSize: 10, alignSelf: 'flex-end', marginTop: 5, },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 8, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5E5', },
    input: { flex: 1, maxHeight: 120, minHeight: 40, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, marginRight: 8, fontSize: 16, },
    sendButton: { justifyContent: 'center', alignItems: 'center', height: 40, width: 40, borderRadius: 20, backgroundColor: '#B7A9C9', marginBottom: Platform.OS === 'ios' ? 0 : 4, },
    sendButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, },
});

export default ChatScreen;
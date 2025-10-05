// app/(app)/chat/[id].tsx

import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 💡 ASSUMPTION: You have created a file at this path with the JSON content you provided.
// Load dummy JSON. Use require to avoid TS JSON module issues and ensure correct relative path.
const DUMMY_PERSONAS: any = require('../../dummyJson/echoes.json'); // Updated path for typical Expo project structure

const { width, height } = Dimensions.get('window');

// --- Types ---
type ChatMessage = {
    id: string;
    text: string;
    sender: 'me' | 'echo';
    timestamp: string;
    audioUrl?: string;
};

// --- Component ---
const ChatScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    // Safely extract and ensure 'id' is a string
    const echoId = Array.isArray(params.id) ? params.id[0] : params.id;

    // 1. Find the specific persona data
    const persona = DUMMY_PERSONAS.find((p: any) => p.id === echoId);

    if (!persona) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Loading or Echo not found...</Text>
                <ActivityIndicator size="large" color="#556ee6" />
            </View>
        );
    }

    const { name } = persona;

    // The initial messages are loaded from the persona's conversation, reversed for FlatList
    const initialMessages: ChatMessage[] = (persona.initialConversation || []).slice().reverse();

    // State
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Get the height of the safe area/header bar dynamically for better offset calculation
    // This value is often around 90-100 for default Expo headers on iOS devices
    const headerHeight = 90;

    // Set header title
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: name,
            headerTintColor: '#333',
            headerStyle: {
                backgroundColor: '#FFF',
            },
            headerRight: () => (
                <TouchableOpacity onPress={() => console.log('Settings Pressed')} style={{ paddingHorizontal: 5 }}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#556ee6" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, name]);

    // Dummy response simulation
    const simulateEchoResponse = (userMessage: string) => {
        setIsSending(true);
        setTimeout(() => {
            const newEchoMessage: ChatMessage = {
                id: `c${Date.now() + 1}`,
                text: `(Echoing ${name}'s style): I hear that, and I understand. That reminds me of a little something from the past...`,
                sender: 'echo',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prevMessages => [newEchoMessage, ...prevMessages]);
            setIsSending(false);
        }, 1500); // Simulate network delay
    };

    // Handler for sending a message
    const handleSend = () => {
        if (inputText.trim() === '' || isSending) return;

        const newUserMessage: ChatMessage = {
            id: `c${Date.now()}`,
            text: inputText.trim(),
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prevMessages => [newUserMessage, ...prevMessages]);
        setInputText('');
        simulateEchoResponse(newUserMessage.text);
    };

    // Render function for each message in the list
    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMyMessage = item.sender === 'me';
        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessageContainer : styles.echoMessageContainer
            ]}>
                <Text style={isMyMessage ? styles.myMessageText : styles.echoMessageText}>
                    {item.text}
                </Text>
                <Text style={[styles.timestamp, isMyMessage ? styles.myTimestamp : styles.echoTimestamp]}>
                    {item.timestamp}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            // ⭐️ FIX: Use a more accurate offset (headerHeight) to lift the input area 
            // and adjust behavior for Android to use 'height' instead of 'padding' which is often better.
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                inverted
                // Adding a little padding to the bottom of the inverted list
                ListFooterComponent={<View style={{ height: 10 }} />}
            />

            {isSending && (
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#556ee6" />
                    <Text style={styles.typingText}>{name} is responding...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                {/* Add a button for audio input, which is key to an 'Echo' app */}
                <TouchableOpacity style={styles.micButton} onPress={() => console.log('Audio Record Pressed')}>
                    <Ionicons name="mic-outline" size={24} color="#556ee6" />
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder={`Type a message to ${name}...`}
                    placeholderTextColor="#999"
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={inputText.trim() === '' || isSending}
                >
                    <Ionicons name="send" size={22} color="#FFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Lighter, modern chat background
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
        color: '#333',
    },
    messageList: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    messageContainer: {
        maxWidth: width * 0.8, // Slightly wider bubbles
        marginVertical: 4,
        padding: 12, // Increased padding
        borderRadius: 20, // More rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, // Subtle shadow
        shadowRadius: 2,
        elevation: 1.5,
    },
    // My Messages (Right Side)
    myMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#556ee6', // Slightly darker, professional blue
        borderTopRightRadius: 4, // Sharp edge on top-right (standard chat look)
    },
    myMessageText: {
        color: '#FFF',
        fontSize: 15,
    },
    myTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    // Echo Messages (Left Side)
    echoMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#EAEAEA', // Light grey for incoming messages
        borderTopLeftRadius: 4, // Sharp edge on top-left
    },
    echoMessageText: {
        color: '#333',
        fontSize: 15,
    },
    echoTimestamp: {
        color: '#888',
        textAlign: 'left',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 5,
        lineHeight: 12,
    },
    // Input Area
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    micButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginRight: 8,
        // Optional: Add a subtle background color to the button itself
        // backgroundColor: '#F0F3FF', 
    },
    textInput: {
        flex: 1,
        maxHeight: 100,
        minHeight: 40,
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 10 : 8,
        paddingBottom: Platform.OS === 'ios' ? 10 : 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 22, // Match the button radius
        fontSize: 16,
        marginRight: 8,
        // Align text better in multiline
        textAlignVertical: 'center',
    },
    sendButton: {
        backgroundColor: '#556ee6',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#C8D5E0',
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: 5,
    },
    typingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 13,
        fontStyle: 'italic',
    }
});

export default ChatScreen;
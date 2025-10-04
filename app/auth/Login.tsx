import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Background circles */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />

            {/* Login card */}
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Your space for reflection and calm</Text>

                <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#AFAFAF" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#AFAFAF"
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>Need help? Contact support</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F1E9', // Faded Ivory
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: '#E8C07D', // Warm Honey
        opacity: 0.2,
    },
    circleOne: {
        width: 200,
        height: 200,
        top: -50,
        left: -50,
    },
    circleTwo: {
        width: 300,
        height: 300,
        bottom: -100,
        right: -100,
    },
    card: {
        width: 350,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6, // for Android shadow
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#F2C6C2', // Blush Rose
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#B7A9C9', // Soft Lavender Grey
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#C8D3C5', // Sage Whisper
        borderRadius: 10,
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 14,
        backgroundColor: '#E6AFA4', // Muted Peach
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 16,
        fontSize: 12,
        color: '#C8D3C5',
    },
});

export default LoginScreen;

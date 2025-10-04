import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import auth0 from '../../auth0';

const { width, height } = Dimensions.get('window');

const SignupScreen: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    const signupWithAuth0 = async () => {
        try {
            const credentials = await auth0.webAuth.authorize({
                scope: 'openid profile email',
                audience: `https://YOUR_AUTH0_DOMAIN/userinfo`,
                additionalParameters: {
                    screen_hint: 'signup', // ✅ pass extra params here
                },
            });

            const userInfo = await auth0.auth.userInfo({ token: credentials.accessToken });
            setUser(userInfo);
            Alert.alert('Welcome!', `Account created for ${userInfo.name || 'User'}`);
        } catch (error) {
            console.log('Auth0 signup error', error);
            Alert.alert('Signup failed', 'Unable to create account. Please try again.');
        }
    };

    const logout = async () => {
        try {
            await auth0.webAuth.clearSession({});
            setUser(null);
            Alert.alert('Logged out', 'You have been logged out.');
        } catch (error) {
            console.log('Auth0 logout error', error);
            Alert.alert('Logout failed', 'Unable to log out.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Background circles */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />

            {/* Signup card */}
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us for reflection and calm</Text>

                {!user && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#AFAFAF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#AFAFAF"
                            secureTextEntry
                        />
                    </>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={user ? logout : signupWithAuth0}
                >
                    <Text style={styles.buttonText}>{user ? 'Log Out' : 'Sign Up'}</Text>
                </TouchableOpacity>

                {user && <Text style={styles.footer}>Logged in as {user.name || user.email}</Text>}
                {!user && <Text style={styles.footer}>Need help? Contact support</Text>}
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
        elevation: 6,
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

export default SignupScreen;

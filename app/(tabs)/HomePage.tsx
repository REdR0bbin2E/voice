// HomeScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
    TextInput,
    Dimensions,
    Image,
    Alert, // 💡 Added for permission handling
    Platform // 💡 Added for permission handling
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
// If you want a true video preview, consider installing expo-av and uncommenting:
// import { Video } from 'expo-av';

const { width, height } = Dimensions.get("window");

// 💡 Define a type for the media state
type MediaType = 'video' | 'image' | null;

const HomeScreen: React.FC = () => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [audio, setAudio] = useState<string | null>(null);

    // 💡 RENAMED: Use mediaUri for the file path
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    // 💡 NEW STATE: To track the type of media selected (image or video)
    const [mediaType, setMediaType] = useState<MediaType>(null);


    // 💡 ADDED: Request media library permissions
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission required', 'We need camera roll permissions to select videos and images.');
                }
            }
        })();
    }, []);

    // 💡 UPDATED: Function to handle picking video/image
    const pickMedia = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                // Use MediaTypeOptions provided by expo-image-picker
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setMediaUri(asset.uri);

                if (asset.type === 'video') {
                    setMediaType('video');
                } else if (asset.type === 'image') {
                    setMediaType('image');
                } else {
                    setMediaType(null);
                }
            }
        } catch (e) {
            console.log('pickMedia error', e);
            Alert.alert('Error', 'Unable to pick media.');
        }
    };

    // Ripple animations (kept original logic)
    const ripple1 = useRef(new Animated.Value(0)).current;
    const ripple2 = useRef(new Animated.Value(0)).current;
    const ripple3 = useRef(new Animated.Value(0)).current;
    const ripple1Opacity = useRef(new Animated.Value(1)).current;
    const ripple2Opacity = useRef(new Animated.Value(1)).current;
    const ripple3Opacity = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            delay: 1000,
            useNativeDriver: true,
        }).start();

        // Ripple animations - trigger every 3 seconds
        const createRippleAnimation = (rippleScale: Animated.Value, rippleOpacity: Animated.Value) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(rippleScale, {
                            toValue: 1.5,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(rippleOpacity, {
                            toValue: 0,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.delay(1000), // Wait 1 second before next ripple (total 3 seconds)
                    Animated.parallel([
                        Animated.timing(rippleScale, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                        Animated.timing(rippleOpacity, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            );
        };

        createRippleAnimation(ripple1, ripple1Opacity).start();
        createRippleAnimation(ripple2, ripple2Opacity).start();
        createRippleAnimation(ripple3, ripple3Opacity).start();
    }, []);

    const handleAudioPick = () => {
        // placeholder for picking audio
        setAudio("sample_audio.mp3");
    };

    const handleSubmit = () => {
        console.log({
            name,
            description,
            audio,
            mediaUri, // 💡 LOGGING NEW MEDIA STATE
            mediaType
        });
        setModalVisible(false);
        setName("");
        setDescription("");
        setAudio(null);
        setMediaUri(null); // 💡 CLEAR NEW MEDIA STATE
        setMediaType(null); // 💡 CLEAR NEW MEDIA TYPE STATE
    };

    // 💡 HELPER COMPONENT FOR MEDIA PREVIEW
    const MediaPreview = () => {
        if (!mediaUri) return null;

        if (mediaType === 'image') {
            return (
                <View style={styles.mediaPreviewContainer}>
                    <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
                </View>
            );
        }

        if (mediaType === 'video') {
            // If you install expo-av, uncomment the Video component. 
            // For now, we'll just show a placeholder or the video's thumbnail (which ImagePicker often provides).
            return (
                <View style={styles.mediaPreviewContainer}>
                    <Ionicons name="videocam-outline" size={60} color="#E6AFA4" />
                    <Text style={styles.mediaTypeLabel}>Video Selected</Text>
                    {/* <Video
                        source={{ uri: mediaUri }}
                        style={styles.mediaPreview}
                        useNativeControls
                        resizeMode="cover"
                        isLooping
                    /> 
                    */}
                </View>
            );
        }

        return null;
    }


    return (
        <View style={styles.container}>
            {/* Background decorative circles */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            {/* Animated ripples */}
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        transform: [{ scale: ripple1 }],
                        opacity: ripple1Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        transform: [{ scale: ripple2 }],
                        opacity: ripple2Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        transform: [{ scale: ripple3 }],
                        opacity: ripple3Opacity,
                    },
                ]}
            />

            {/* Splash overlay */}
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <View style={styles.splashLogoCircle}>
                    <Image source={require('../../assets/images/echoTempLogo.png')} resizeMode='contain' style={{ width: 175, height: 175 }} />
                </View>
                <Text style={styles.welcomeText}>Welcome to Echo</Text>
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.logoSection}>
                    <Text style={styles.tagline}>Remember Them</Text>
                </View>

                {/* Plus button */}
                <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={50} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>Create New Echo</Text>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create a New Echo</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter echo name"
                                placeholderTextColor="#B8B8B8"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Enter a detailed description..."
                                placeholderTextColor="#B8B8B8"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        {/* 💡 NEW: Button to pick Video/Image */}
                        <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
                            <Ionicons name={mediaUri ? "videocam" : "videocam-outline"} size={22} color="#FFF" />
                            <Text style={styles.mediaButtonText}>
                                {mediaUri ? `${mediaType === 'video' ? 'Video' : 'Image'} Selected` : "Select a video or image"}
                            </Text>
                            <Ionicons name="folder-open-outline" size={22} color="#FFF" style={styles.uploadIcon} />
                        </TouchableOpacity>

                        {/* 💡 NEW: Media Preview */}
                        <MediaPreview />

                        <TouchableOpacity style={styles.audioButton} onPress={handleAudioPick}>
                            <Ionicons name="musical-notes" size={22} color="#FFF" />
                            <Text style={styles.audioButtonText}>
                                {audio ? audio : "Select audio file"}
                            </Text>
                            <Ionicons name="cloud-upload-outline" size={22} color="#FFF" style={styles.uploadIcon} />
                        </TouchableOpacity>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.actionText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.submit]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.actionText}>Save Echo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F1E9",
    },

    // Background circles (No changes)
    circle: {
        position: "absolute",
        borderRadius: 9999,
        opacity: 0.12,
    },
    circleOne: {
        width: 250,
        height: 250,
        top: -80,
        left: -70,
        backgroundColor: "#E8C07D",
    },
    circleTwo: {
        width: 300,
        height: 300,
        bottom: -100,
        right: -80,
        backgroundColor: "#B7A9C9",
    },
    circleThree: {
        width: 180,
        height: 180,
        top: height * 0.3,
        right: -60,
        backgroundColor: "#E6AFA4",
        opacity: 0.1,
    },
    circleFour: {
        width: 200,
        height: 200,
        bottom: height * 0.35,
        left: -70,
        backgroundColor: "#F2C6C2",
        opacity: 0.08,
    },

    // Animated ripples (No changes)
    ripple: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 2,
        borderColor: "#E6AFA4",
        top: "50%",
        left: "50%",
        marginLeft: -150,
        marginTop: -150,
    },

    // Splash overlay (No changes)
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#E6AFA4",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    splashLogoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFF",
        letterSpacing: 0.5,
    },

    // Content (No changes)
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // Logo section (No changes)
    logoSection: {
        alignItems: "center",
        marginBottom: 60,
    },
    tagline: {
        fontSize: 15,
        color: "#B7A9C9",
        opacity: 0.7,
        letterSpacing: 0.3,
    },

    // Plus button (No changes)
    plusButton: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#E6AFA4",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#E6AFA4",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    buttonLabel: {
        marginTop: 16,
        fontSize: 16,
        color: "#B7A9C9",
        fontWeight: "600",
        letterSpacing: 0.3,
    },

    // Modal (No changes)
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 24,
        color: "#B7A9C9",
        textAlign: "center",
    },

    // Input fields (No changes)
    inputContainer: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B6B6B",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1.5,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        backgroundColor: "#FAFAFA",
        color: "#2C2C2E",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },

    // 💡 NEW: Media Button styles
    mediaButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8C07D", // Different color for distinction
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#E8C07D",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    mediaButtonText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500",
        marginLeft: 10,
        flex: 1,
    },

    // 💡 NEW: Media Preview styles
    mediaPreviewContainer: {
        width: '100%',
        height: 150,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    mediaPreview: {
        width: '100%',
        height: '100%',
        // Use Image.resizeMode if using Image, not needed for Video.
    },
    mediaTypeLabel: {
        color: '#E6AFA4',
        marginTop: 5,
        fontWeight: '600'
    },

    // Audio button (No changes)
    audioButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#B7A9C9", // Changed color for distinction
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#B7A9C9",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    audioButtonText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500",
        marginLeft: 10,
        flex: 1,
    },
    uploadIcon: {
        marginLeft: 8,
    },

    // Modal actions (No changes)
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginLeft: 12,
        minWidth: 100,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: "#C8D3C5",
    },
    submit: {
        backgroundColor: "#E6AFA4",
        shadowColor: "#E6AFA4",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    actionText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },
});

export default HomeScreen;
import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Animated,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Assuming this path is correct for your file structure
import echoes from '../../dummyJson/echoes.json';

const { width, height } = Dimensions.get('window');

// --- TYPE DEFINITIONS (Renamed to Echo/Memory for clarity) ---

// Type for a single Echo object from the JSON
type EchoMemory = typeof echoes[0];

interface ShareOption {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

// --- ECHO MEMORY CARD COMPONENT ---
const EchoMemoryCard: React.FC<{
    echo: EchoMemory; // Renamed from 'memory' to 'echo'
    index: number;
    isSelected: boolean;
    onPress: (echo: EchoMemory) => void;
}> = ({ echo, index, isSelected, onPress }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(cardAnim, {
            toValue: 1,
            duration: 600,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, [index]);

    return (
        <Animated.View
            style={[
                styles.memoryCard,
                {
                    opacity: cardAnim,
                    transform: [
                        {
                            translateY: cardAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0],
                            }),
                        },
                    ],
                    borderColor: isSelected ? '#E6AFA4' : 'rgba(183, 169, 201, 0.1)',
                    borderWidth: isSelected ? 2 : 1,
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(echo)} // Use 'echo' here
                activeOpacity={0.8}
                style={styles.memoryCardContent}
            >
                <View style={styles.memoryAvatar}>
                    <Text style={styles.memoryAvatarText}>{echo.name.charAt(0)}</Text>
                </View>
                <View style={styles.memoryInfo}>
                    <Text style={styles.memoryName}>{echo.name}</Text>
                    <Text style={styles.memoryDescription} numberOfLines={2}>
                        {/* Use the descriptionPrompt property */}
                        {echo.descriptionPrompt.substring(0, 80)}...
                    </Text>
                    <View style={styles.audioInfo}>
                        <Ionicons name="musical-notes" size={12} color="#E6AFA4" />
                        {/* Use the audioSamples property */}
                        <Text style={styles.audioCount}>{echo.audioSamples.length} audio clips</Text>
                    </View>
                </View>
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={24} color="#E6AFA4" />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- SHARE OPTION COMPONENT (Unchanged) ---
const ShareOptionComponent: React.FC<{
    option: ShareOption;
    index: number;
    isSelected: boolean;
    onPress: (option: ShareOption) => void;
}> = ({ option, index, isSelected, onPress }) => {
    const optionAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(optionAnim, {
            toValue: 1,
            duration: 600,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, [index]);

    return (
        <Animated.View
            style={[
                styles.shareOption,
                {
                    opacity: optionAnim,
                    transform: [
                        {
                            translateX: optionAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                    borderColor: isSelected ? option.color : 'rgba(183, 169, 201, 0.1)',
                    borderWidth: isSelected ? 2 : 1,
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(option)}
                activeOpacity={0.8}
                style={styles.shareOptionContent}
            >
                <View style={[styles.shareIcon, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as any} size={24} color="#FFF" />
                </View>
                <View style={styles.shareOptionInfo}>
                    <Text style={styles.shareOptionName}>{option.name}</Text>
                    <Text style={styles.shareOptionDescription}>{option.description}</Text>
                </View>
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color={option.color} />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- MAIN SHARE SCREEN COMPONENT ---
const ShareScreen: React.FC = () => {
    const INITIAL_DISPLAY_COUNT = 4;
    const LOAD_MORE_COUNT = 2;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const [selectedEcho, setSelectedEcho] = useState<EchoMemory | null>(null); // Renamed state to 'selectedEcho'
    const [shareMessage, setShareMessage] = useState('');
    const [selectedShareOption, setSelectedShareOption] = useState<ShareOption | null>(null);
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT); // State for load more logic

    const shareOptions: ShareOption[] = [
        {
            id: 'family',
            name: 'Family Group',
            icon: 'people',
            color: '#E6AFA4',
            description: 'Share with family members',
        },
        {
            id: 'friends',
            name: 'Close Friends',
            icon: 'heart',
            color: '#F2C6C2',
            description: 'Share with close friends',
        },
        {
            id: 'public',
            name: 'Public Story',
            icon: 'globe',
            color: '#B7A9C9',
            description: 'Share as a public story',
        },
        {
            id: 'link',
            name: 'Generate Link',
            icon: 'link',
            color: '#E8C07D',
            description: 'Create a shareable link',
        },
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleShare = () => {
        if (!selectedEcho || !selectedShareOption) {
            Alert.alert('Missing Selection', 'Please select an Echo memory and a sharing option.');
            return;
        }

        Alert.alert(
            'Memory Shared!',
            `Your memory of "${selectedEcho.name}" has been shared via ${selectedShareOption.name}`,
            [{ text: 'OK' }]
        );

        // Optional: Reset selections after sharing
        // setSelectedEcho(null);
        // setSelectedShareOption(null);
        // setShareMessage('');
    };

    const handleShowMore = () => {
        // Increase the display count by LOAD_MORE_COUNT, ensuring it doesn't exceed the total number of echoes
        setDisplayCount(prevCount => Math.min(prevCount + LOAD_MORE_COUNT, echoes.length));
    };

    const renderEchoMemoryCard = (echo: EchoMemory, index: number) => {
        return (
            <EchoMemoryCard
                key={echo.id} // Added key for better performance
                echo={echo}
                index={index}
                isSelected={selectedEcho?.id === echo.id}
                onPress={setSelectedEcho}
            />
        );
    };

    const renderShareOption = (option: ShareOption, index: number) => {
        return (
            <ShareOptionComponent
                key={option.id} // Added key for better performance
                option={option}
                index={index}
                isSelected={selectedShareOption?.id === option.id}
                onPress={setSelectedShareOption}
            />
        );
    };

    // Slice the echoes array based on the displayCount state
    const memoriesToDisplay = echoes.slice(0, displayCount);
    const hasMoreMemories = displayCount < echoes.length;


    return (
        <View style={styles.container}>
            {/* Background decorative elements */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />

            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <Text style={styles.title}>Share Echoes</Text>
                <Text style={styles.subtitle}>Spread the love and keep memories alive</Text>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Memory Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Echo to Share</Text>
                    <View style={styles.memoryGrid}>
                        {/* Render only the sliced array */}
                        {memoriesToDisplay.map((echo, index) => renderEchoMemoryCard(echo, index))}
                    </View>

                    {/* Show More Button Logic */}
                    {hasMoreMemories && (
                        <TouchableOpacity
                            style={styles.showMoreButton}
                            onPress={handleShowMore}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.showMoreButtonText}>Show More Echoes ({echoes.length - displayCount} left)</Text>
                            <Ionicons name="chevron-down" size={16} color="#B7A9C9" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Share Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose Sharing Method</Text>
                    <View style={styles.shareOptionsContainer}>
                        {shareOptions.map((option, index) => renderShareOption(option, index))}
                    </View>
                </View>

                {/* Personal Message */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Add Personal Message (Optional)</Text>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Add a personal note to your shared memory..."
                        placeholderTextColor="#B8B8B8"
                        value={shareMessage}
                        onChangeText={setShareMessage}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Share Button */}
                <TouchableOpacity
                    style={[
                        styles.shareButton,
                        (!selectedEcho || !selectedShareOption) && styles.shareButtonDisabled,
                    ]}
                    onPress={handleShare}
                    disabled={!selectedEcho || !selectedShareOption}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share" size={20} color="#FFF" />
                    <Text style={styles.shareButtonText}>Share Echo</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

// --- STYLES ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F1E9',
    },

    // Background circles
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        opacity: 0.08,
    },
    circleOne: {
        width: 200,
        height: 200,
        top: -50,
        right: -80,
        backgroundColor: '#E6AFA4',
    },
    circleTwo: {
        width: 300,
        height: 300,
        bottom: -100,
        left: -120,
        backgroundColor: '#B7A9C9',
    },
    circleThree: {
        width: 150,
        height: 150,
        top: height * 0.3,
        left: -60,
        backgroundColor: '#E8C07D',
    },

    // Header
    header: {
        paddingTop: height * 0.12,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#B7A9C9',
        letterSpacing: 0.5,
        marginBottom: 8,

    },
    subtitle: {
        fontSize: 16,
        color: '#B7A9C9',
        opacity: 0.7,
        textAlign: 'center',
    },

    // Scroll view
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    // Sections
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C2C2E',
        marginBottom: 16,
    },

    // Memory cards
    memoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    memoryCard: {
        width: (width - 60) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#B7A9C9',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    memoryCardContent: {
        padding: 16,
        alignItems: 'center',
    },
    memoryAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E6AFA4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    memoryAvatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    memoryInfo: {
        alignItems: 'center',
    },
    memoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C2C2E',
        marginBottom: 6,
        textAlign: 'center',
    },
    memoryDescription: {
        fontSize: 12,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 8,
    },
    audioInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioCount: {
        fontSize: 11,
        color: '#E6AFA4',
        marginLeft: 4,
        fontWeight: '500',
    },

    // Show More Button Styles (New)
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(183, 169, 201, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(183, 169, 201, 0.2)',
    },
    showMoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B7A9C9',
    },

    // Share options
    shareOptionsContainer: {
        gap: 12,
    },
    shareOption: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#B7A9C9',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    shareOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    shareIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    shareOptionInfo: {
        flex: 1,
    },
    shareOptionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C2C2E',
        marginBottom: 4,
    },
    shareOptionDescription: {
        fontSize: 14,
        color: '#6B6B6B',
    },

    // Message input
    messageInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: '#2C2C2E',
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(183, 169, 201, 0.1)',
        shadowColor: '#B7A9C9',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    // Share button
    shareButton: {
        backgroundColor: '#E6AFA4',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E6AFA4',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    shareButtonDisabled: {
        backgroundColor: '#C8D3C5',
        shadowOpacity: 0.1,
    },
    shareButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Selected indicator
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default ShareScreen;
import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    FlatList,
    Platform, // Import Platform for conditional styling
    SafeAreaView, // Import SafeAreaView for better iOS handling
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import echoes from '../../dummyJson/echoes.json';

const { width, height } = Dimensions.get('window');

// Define the expected height of the floating tab bar (approx. 90 units for iOS, ~75 for Android)
const TAB_BAR_HEIGHT_SPACE = Platform.OS === 'ios' ? 120 : 100;

interface TimelineEvent {
    id: string;
    name: string;
    date: string;
    type: 'memory' | 'milestone';
    description: string;
    audioUrl?: string;
}

// Separate component for timeline items (Unchanged)
const TimelineItemComponent: React.FC<{
    item: TimelineEvent;
    index: number;
    onPress: (item: TimelineEvent) => void;
}> = ({ item, index, onPress }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(itemAnim, {
            toValue: 1,
            duration: 600,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, [index]);

    return (
        <Animated.View
            style={[
                styles.timelineItem,
                {
                    opacity: itemAnim,
                    transform: [
                        {
                            translateX: itemAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                style={styles.timelineCard}
                onPress={() => onPress(item)}
                activeOpacity={0.8}
            >
                <View style={styles.timelineDot}>
                    <Ionicons name="heart" size={16} color="#E6AFA4" />
                </View>
                <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                        <Text style={styles.timelineName}>{item.name}</Text>
                        <Text style={styles.timelineDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.timelineDescription}>{item.description}</Text>
                    {item.audioUrl && (
                        <View style={styles.audioIndicator}>
                            <Ionicons name="musical-notes" size={14} color="#E6AFA4" />
                            <Text style={styles.audioText}>Audio available</Text>
                        </View>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B7A9C9" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const TimelineScreen: React.FC = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

    // Generate timeline events from echoes data (Unchanged)
    const timelineEvents: TimelineEvent[] = echoes.map((echo, index) => ({
        id: echo.id,
        name: echo.name,
        date: new Date(2024, index, Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }),
        type: 'memory' as const,
        description: echo.descriptionPrompt.substring(0, 100) + '...',
        audioUrl: echo.audioSamples[0]?.url,
    }));

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

    const renderTimelineItem = ({ item, index }: { item: TimelineEvent; index: number }) => {
        return (
            <TimelineItemComponent
                key={item.id}
                item={item}
                index={index}
                onPress={setSelectedEvent}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Background decorative elements */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />

            {/* SCROLLABLE CONTENT (FlatList) with Header as ListHeaderComponent */}
            <FlatList
                data={timelineEvents}
                keyExtractor={(item) => item.id}
                renderItem={renderTimelineItem}
                style={styles.flatListStyle}
                contentContainerStyle={styles.timelineContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {/* Pushed Up Title */}
                        <Text style={styles.title}>Memory Timeline</Text>

                        {/* New Timeline Icon */}
                        <Ionicons
                            name="calendar-outline" // Suitable timeline/date icon
                            size={28}
                            color="#B7A9C9"
                            style={styles.timelineIcon}
                        />

                        <Text style={styles.subtitle}>Journey through your cherished memories</Text>
                    </Animated.View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="time-outline" size={64} color="#B7A9C9" />
                        <Text style={styles.emptyTitle}>No memories yet</Text>
                        <Text style={styles.emptySubtitle}>Start creating your first memory</Text>
                    </View>
                }
            />



        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F1E9',
    },

    // Background circles (Unchanged)
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
        top: height * 0.4,
        left: -60,
        backgroundColor: '#E8C07D',
    },

    // Header (Now inside FlatList, styling for look and feel)
    header: {
        // ⚠️ PUSH UP: Reduced padding to move content closer to the top (status bar area)
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
        backgroundColor: '#F6F1E9',
        zIndex: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#B7A9C9',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    // New Style for the icon under the title
    timelineIcon: {
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#B7A9C9',
        opacity: 0.7,
        textAlign: 'center',
    },

    // FlatList (SCROLLABLE CONTENT)
    flatListStyle: {
        flex: 1, // Let the list take up the remaining space
    },
    timelineContainer: {
        paddingHorizontal: 20,
        // ⚠️ TAB BAR SPACING: Ensure the last item scrolls above the tab bar
        paddingBottom: TAB_BAR_HEIGHT_SPACE - 20,
    },
    timelineItem: {
        marginBottom: 16,
    },
    timelineCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#B7A9C9',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(183, 169, 201, 0.1)',
    },
    timelineDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F2C6C2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#E6AFA4',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    timelineContent: {
        flex: 1,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timelineName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C2C2E',
    },
    timelineDate: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '500',
    },
    timelineDescription: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
        marginBottom: 8,
    },
    audioIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioText: {
        fontSize: 12,
        color: '#E6AFA4',
        marginLeft: 4,
        fontWeight: '500',
    },

    // Empty state (Unchanged)
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#B7A9C9',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#B7A9C9',
        opacity: 0.6,
        textAlign: 'center',
    },

    // Floating Action Button (Unchanged, just made sure it's inside SafeAreaView)
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 50 : 30,
        right: 20,
        zIndex: 20,
    },
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E6AFA4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E6AFA4',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
});

export default TimelineScreen;
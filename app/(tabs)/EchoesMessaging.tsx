// app/(app)/(tabs)/EchoesMessaging.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { useRouter } from 'expo-router';

// ⚠️ NEW: Import the dummy data from the specified location
import DUMMY_ECHOS from "../../dummyJson/echoes.json";

const { width, height } = Dimensions.get("window");

// Define the type for a single Echo item based on your JSON structure
type EchoItem = typeof DUMMY_ECHOS[0];


const EchoesMessaging: React.FC = () => {
    const router = useRouter();

    const handleEchoPress = (echoId: string, echoName: string, echoPrompt: string) => {
        // Navigate to the standalone chat route, passing the unique Echo ID, Name, and Prompt
        router.push({
            // Path to: app/(app)/chat/[id].tsx
            pathname: "../chat/[id]",
            params: {
                id: echoId,
                name: echoName,
                // Pass the full description prompt to the chat screen
                descriptionPrompt: echoPrompt,
            },
        });
    };

    // The renderItem component is updated to use the EchoItem type and the correct properties
    const renderItem = ({ item }: { item: EchoItem }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleEchoPress(item.id, item.name, item.descriptionPrompt)}
        >
            <View style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarIcon}>👤</Text>
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    {/* Display a snippet of the description prompt as the card subtitle */}
                    <Text style={styles.subtitleText}>
                        {item.descriptionPrompt.substring(0, 50)}...
                    </Text>
                </View>
                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.backgroundOverlay} />

            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <FlatList
                // ⚠️ Use the imported DUMMY_ECHOS array
                data={DUMMY_ECHOS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Your Echoes</Text>
                        <Text style={styles.subtitle}>Voices that matter most</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// --- Styles (kept consistent with your original request) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F1E9",
        paddingHorizontal: 16,
    },
    backgroundOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        backgroundColor: "rgba(183, 169, 201, 0.05)",
    },
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
        width: 320,
        height: 320,
        bottom: -120,
        right: -100,
        backgroundColor: "#B7A9C9",
    },
    circleThree: {
        width: 180,
        height: 180,
        top: height * 0.35,
        right: -70,
        backgroundColor: "#E6AFA4",
    },
    circleFour: {
        width: 140,
        height: 140,
        top: height * 0.6,
        left: -40,
        backgroundColor: "#E8C07D",
        opacity: 0.08,
    },
    headerContainer: {
        marginTop: height * 0.12,
        marginBottom: 28,
        alignItems: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "700",
        color: "#B7A9C9",
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: "#B7A9C9",
        opacity: 0.7,
        fontWeight: "400",
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 14,
        shadowColor: "#B7A9C9",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        borderWidth: 1,
        borderColor: "rgba(183, 169, 201, 0.08)",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
    },
    avatarContainer: {
        marginRight: 14,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E6AFA4",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#E6AFA4",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    avatarIcon: {
        fontSize: 24,
        color: "#FFFFFF",
    },
    textContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#2C2C2E",
        marginBottom: 3,
    },
    subtitleText: {
        fontSize: 13,
        color: "#8E8E93",
        fontWeight: "400",
        opacity: 0.5
    },
    chevronContainer: {
        marginLeft: 8,
    },
    chevron: {
        fontSize: 28,
        color: "#B7A9C9",
        opacity: 0.4,
        fontWeight: "300",
    },
});

export default EchoesMessaging;
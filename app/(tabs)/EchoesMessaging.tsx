// EchoesMessaging.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import echoes from "../../dummyJson/echoes.json";

const { width, height } = Dimensions.get("window");

const EchoesMessaging: React.FC = () => {
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarIcon}>👤</Text>
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.subtitleText}>Tap to open conversation</Text>
                </View>
                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Enhanced background with gradient overlay */}
            <View style={styles.backgroundOverlay} />

            {/* Background shapes */}
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <FlatList
                data={echoes}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Echoes</Text>
                        <Text style={styles.subtitle}>Your conversations</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F1E9",
        paddingHorizontal: 16,
    },

    // Background overlay for depth
    backgroundOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        backgroundColor: "rgba(183, 169, 201, 0.05)",
    },

    // Background shapes
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

    // Header
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

    // Card design
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

    // Avatar
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

    // Text content
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

    // Chevron
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
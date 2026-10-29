import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Dimensions, Modal, ScrollView, StatusBar, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showQR, setShowQR] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // DARK MODE STATE
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic state for editable pass details
  const [officeIn, setOfficeIn] = useState('10:20');
  const [officeOut, setOfficeOut] = useState('20:45');
  const [startDate, setStartDate] = useState('1st Oct, 2026');
  const [endDate, setEndDate] = useState('31st Oct, 2026');

  // Hidden editing modals state
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // 1. LOAD DATA ON APP START
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedOfficeIn = await AsyncStorage.getItem('@officeIn');
        const savedOfficeOut = await AsyncStorage.getItem('@officeOut');
        const savedStartDate = await AsyncStorage.getItem('@startDate');
        const savedEndDate = await AsyncStorage.getItem('@endDate');
        const savedDarkMode = await AsyncStorage.getItem('@isDarkMode');

        if (savedOfficeIn !== null) setOfficeIn(savedOfficeIn);
        if (savedOfficeOut !== null) setOfficeOut(savedOfficeOut);
        if (savedStartDate !== null) setStartDate(savedStartDate);
        if (savedEndDate !== null) setEndDate(savedEndDate);
        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
      } catch (e) {
        console.log('Failed to load saved data');
      }
    };

    loadSavedData();
  }, []);

  // 2. SAVE DATA FUNCTION
  const handleSaveDetails = async () => {
    setEditModalVisible(false); // Close the modal
    try {
      await AsyncStorage.setItem('@officeIn', officeIn);
      await AsyncStorage.setItem('@officeOut', officeOut);
      await AsyncStorage.setItem('@startDate', startDate);
      await AsyncStorage.setItem('@endDate', endDate);
      await AsyncStorage.setItem('@isDarkMode', isDarkMode.toString());
    } catch (e) {
      console.log('Failed to save data');
    }
  };

  // Dynamic QR Data
  const qrData = `Name: Kiran Kataria
  Employee ID: 2872183
  Stop: Thane Stn. E Kopari
  Route: Both
  Valid: ${startDate} to ${endDate}`;

  // Theme Object to handle Light/Dark colors dynamically
  const theme = {
    background: isDarkMode ? '#121212' : '#F0F0F0',
    cardBg: isDarkMode ? '#1E1E1E' : '#F7F7F9',
    textPrimary: isDarkMode ? '#FFFFFF' : '#111111',
    textSecondary: isDarkMode ? '#AAAAAA' : '#666666',
    textTitle: isDarkMode ? '#FFFFFF' : '#000000',
    borderColor: isDarkMode ? '#444444' : '#cccccc',
    sidebarBg: isDarkMode ? '#121212' : '#EAEBEE',
    modalBg: isDarkMode ? '#1E1E1E' : '#ffffff',
    inputBg: isDarkMode ? '#2C2C2C' : '#fafafa',
  };

  const menuItems = [
    { id: '1', title: 'Home', icon: 'home', family: 'MaterialIcons' },
    { id: '2', title: 'Apply Bus Pass', icon: 'bus', family: 'FontAwesome5' },
    { id: '3', title: 'Buspass Request Status', icon: 'clipboard-list', family: 'FontAwesome5' },
    { id: '4', title: 'FeedBack History', icon: 'history', family: 'MaterialIcons' },
    { id: '5', title: 'Back To Home Page', icon: 'history', family: 'MaterialIcons' },
    { id: '6', title: 'Settings', icon: 'settings', family: 'MaterialIcons' },
    { id: '7', title: 'Logout', icon: 'logout', family: 'MaterialIcons' },
  ];

  const renderIcon = (family, name, color) => {
    const size = 20;
    if (family === 'MaterialIcons') return <MaterialIcons name={name} size={size} color={color} />;
    if (family === 'FontAwesome5') return <FontAwesome5 name={name} size={size} color={color} />;
    return <Ionicons name={name} size={size} color={color} />;
  };

  const handlePinSubmit = () => {
    if (pinInput === '2872183') {
      setPinModalVisible(false);
      setPinInput('');
      setTimeout(() => setEditModalVisible(true), 300);
    } else {
      Alert.alert('Error', 'Incorrect PIN');
      setPinInput('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <StatusBar backgroundColor="#52369C" barStyle="light-content" translucent={true} />

    {/* HEADER */}
    <View style={styles.header}>
    <View style={styles.headerLeft}>
    <TouchableOpacity
    onPress={() => setMenuOpen(true)}
    style={styles.headerIcon}
    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
    <Ionicons name="menu" size={28} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Digital Bus Pass</Text>
    </View>
    <TouchableOpacity style={styles.headerIcon}>
    <View>
    <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
    <View style={styles.notificationDot} />
    </View>
    </TouchableOpacity>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent}>
    {/* ROUTE GRADIENT CARD */}
    <LinearGradient
    colors={['#307BE9', '#6B34B8']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.routeCard}
    >
    <View style={styles.routeTop}>
    <Text style={styles.routeText}>Thane Stn. E Kopari</Text>
    <AntDesign name="swap" size={28} color="#fff" style={styles.swapIcon} />
    <Text style={styles.routeText}>TCS Olympus</Text>
    </View>
    <View style={styles.routeBottom}>
    <Text style={styles.timeText}>Office In {officeIn}</Text>
    <Text style={styles.timeText}>Office Out {officeOut}</Text>
    </View>
    </LinearGradient>

    {/* DETAILS / QR CARD */}
    <View style={[styles.detailsCard, { backgroundColor: theme.cardBg }]}>
    {/* CONCAVE ARC CUTOUT TRICK - Background matches current theme */}
    <View style={styles.greenCorner} />
    <View style={[styles.greenCornerCutout, { backgroundColor: theme.cardBg }]} />

    <Text style={[styles.confirmedTitle, { color: theme.textTitle }]}>Confirmed Bus Pass</Text>
    <View style={[styles.dashedLine, { borderColor: theme.borderColor }]} />

    {!showQR ? (
      <View style={styles.infoGrid}>
      <View style={styles.infoRow}>
      <View style={styles.infoColumn}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Name</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Kiran Kataria</Text>
      </View>
      <View style={[styles.infoColumn, { alignItems: 'flex-end' }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Employee ID</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>2872183</Text>
      </View>
      </View>

      <View style={styles.infoRow}>
      <View style={styles.infoColumn}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Bus Stop Name</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Thane Stn. E Kopari</Text>
      </View>
      <View style={[styles.infoColumn, { alignItems: 'flex-end' }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Route Type</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Both</Text>
      </View>
      </View>

      <View style={styles.infoRow}>
      <View style={styles.infoColumn}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Start Date</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{startDate}</Text>
      </View>
      <View style={[styles.infoColumn, { alignItems: 'flex-end' }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>End Date</Text>
      <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{endDate}</Text>
      </View>
      </View>

      <View style={styles.routeDescriptionContainer}>
      <Text style={[styles.routeDescriptionLabel, { color: theme.textSecondary }]}>Route : Thane Stn. E Kopari To TCS Olympus And</Text>
      <Text style={[styles.routeDescriptionLabel, { color: theme.textSecondary }]}>Return Via -FAST</Text>
      </View>
      </View>
    ) : (
      <View style={styles.qrContainer}>
      <QRCode
      value={qrData}
      // Reduced height constraint from 0.42 to 0.38 to compensate for footer padding
      size={Math.min(width - 90, height * 0.38)}
      color="black"
      backgroundColor="white"
      />
      </View>
    )}

    <TouchableOpacity
    style={styles.primaryButton}
    onPress={() => setShowQR(!showQR)}
    >
    <Text style={styles.primaryButtonText}>
    {showQR ? 'View Details' : 'View QR'}
    </Text>
    </TouchableOpacity>
    </View>
    </ScrollView>

    {/* FOOTER LOGO */}
    <View style={styles.footer}>
    <Image
    source={require('./assets/TCS-logo-lightmode.png')}
    style={[
      styles.customFooterLogo,
      isDarkMode && { tintColor: '#FFFFFF' }
    ]}
    resizeMode="contain"
    />
    </View>

    {/* SIDEBAR MENU MODAL */}
    <Modal visible={menuOpen} animationType="fade" transparent={true} onRequestClose={() => setMenuOpen(false)}>
    <View style={styles.modalOverlay}>
    <TouchableOpacity style={styles.modalBackground} onPress={() => setMenuOpen(false)} activeOpacity={1} />
    <View style={[styles.sidebar, { backgroundColor: theme.sidebarBg }]}>
    <TouchableOpacity
    style={styles.sidebarHeader}
    activeOpacity={0.8}
    delayLongPress={3000}
    onLongPress={() => {
      setMenuOpen(false);
      setTimeout(() => setPinModalVisible(true), 300);
    }}
    >
    <Text style={styles.sidebarHeaderName}>Hi, Kiran Kataria</Text>
    </TouchableOpacity>

    <ScrollView style={styles.menuList}>
    {menuItems.map((item) => (
      <TouchableOpacity key={item.id} style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
      {renderIcon(item.family, item.icon, theme.textSecondary)}
      </View>
      <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>{item.title}</Text>
      </TouchableOpacity>
    ))}
    </ScrollView>
    </View>
    </View>
    </Modal>

    {/* HIDDEN PIN MODAL */}
    <Modal visible={pinModalVisible} transparent={true} animationType="slide">
    <View style={styles.centeredView}>
    <View style={[styles.inputModalView, { backgroundColor: theme.modalBg }]}>
    <Text style={[styles.modalTitle, { color: theme.textTitle }]}>Enter PIN</Text>
    <TextInput
    style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]}
    value={pinInput}
    onChangeText={setPinInput}
    secureTextEntry
    keyboardType="numeric"
    placeholder="----"
    placeholderTextColor={theme.textSecondary}
    autoFocus
    />
    <TouchableOpacity style={styles.primaryButton} onPress={handlePinSubmit}>
    <Text style={styles.primaryButtonText}>Unlock</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.cancelButton} onPress={() => setPinModalVisible(false)}>
    <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>

    {/* HIDDEN EDIT MODAL */}
    <Modal visible={editModalVisible} transparent={true} animationType="slide">
    <View style={styles.centeredView}>
    <View style={[styles.inputModalView, { backgroundColor: theme.modalBg }]}>
    <Text style={[styles.modalTitle, { color: theme.textTitle }]}>Edit Pass Data</Text>

    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Start Date</Text>
    <TextInput style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]} value={startDate} onChangeText={setStartDate} />

    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>End Date</Text>
    <TextInput style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]} value={endDate} onChangeText={setEndDate} />

    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Office In Time</Text>
    <TextInput style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]} value={officeIn} onChangeText={setOfficeIn} />

    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Office Out Time</Text>
    <TextInput style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]} value={officeOut} onChangeText={setOfficeOut} />

    <Text style={styles.watermarkText}>Dreth© 28/10/2026</Text>

    <TouchableOpacity
    style={[styles.primaryButton, { backgroundColor: isDarkMode ? '#444' : '#ddd', marginBottom: 15 }]}
    onPress={() => setIsDarkMode(!isDarkMode)}
    >
    <Text style={[styles.primaryButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>
    {isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
    </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.primaryButton} onPress={handleSaveDetails}>
    <Text style={styles.primaryButtonText}>Save Details</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#52369C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15,
    paddingBottom: 15
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: { padding: 5 },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'sans-serif',
    marginLeft: 15
  },
  // Tightened spacing to save vertical room
  scrollContent: { padding: 15, paddingBottom: 5 },
  routeCard: { borderRadius: 8, padding: 15, marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  routeTop: { alignItems: 'center', marginBottom: 12 },
  routeText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'sans-serif' },
  swapIcon: { marginVertical: 5 },
  routeBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: '#fff', fontSize: 16, fontWeight: '500', fontFamily: 'sans-serif' },
  detailsCard: { borderRadius: 8, padding: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, position: 'relative', overflow: 'hidden' },

  /* CONCAVE ARC STYLES */
  greenCorner: { position: 'absolute', top: 0, left: 0, width: 75, height: 75, backgroundColor: '#1E9D28' },
  greenCornerCutout: { position: 'absolute', top: 0, left: 0, width: 75, height: 75, borderTopLeftRadius: 75 },

  confirmedTitle: { textAlign: 'center', fontSize: 22, fontWeight: '600', marginBottom: 8, marginTop: 2, fontFamily: 'sans-serif' },
  dashedLine: { height: 1, borderWidth: 1, borderStyle: 'dashed', marginBottom: 12 },
  infoGrid: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  infoColumn: { flex: 1 },
  infoLabel: { fontSize: 16, marginBottom: 4, fontFamily: 'sans-serif' },
  infoValue: { fontSize: 16, fontFamily: 'sans-serif' },
  routeDescriptionContainer: { alignItems: 'center', marginTop: 5 },
  routeDescriptionLabel: { fontSize: 16, textAlign: 'center', fontFamily: 'sans-serif' },
  qrContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 0, marginBottom: 12 },
  primaryButton: { backgroundColor: '#52369C', paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '500', fontFamily: 'sans-serif' },
  // Footer padding maintained at 45 for Android Nav Bar safety
  footer: { alignItems: 'center', paddingTop: 5, paddingBottom: 45 },
  customFooterLogo: { width: 200, height: 50 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
                                 sidebar: { width: width * 0.75, height: '100%' },
                                 sidebarHeader: {
                                   backgroundColor: '#52369C',
                                   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 50,
                                   paddingBottom: 20,
                                   paddingHorizontal: 20
                                 },
                                 sidebarHeaderName: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'sans-serif' },
                                 menuList: { paddingTop: 10 },
                                 menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 20 },
                                 menuIconContainer: { width: 30, alignItems: 'flex-start' },
                                 menuItemText: { fontSize: 15, fontFamily: 'sans-serif' },

                                 centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
                                 inputModalView: { width: '85%', borderRadius: 10, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
                                 modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, fontFamily: 'sans-serif', textAlign: 'center' },
                                 inputLabel: { fontSize: 12, marginBottom: 5, fontFamily: 'sans-serif' },
                                 inputField: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 15, fontSize: 14, fontFamily: 'sans-serif' },
                                 watermarkText: { textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 15, fontFamily: 'sans-serif' },
                                 cancelButton: { marginTop: 15, alignItems: 'center', paddingVertical: 10 },
                                 cancelText: { fontSize: 14, fontFamily: 'sans-serif' }
});

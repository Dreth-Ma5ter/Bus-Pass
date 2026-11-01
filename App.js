import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Dimensions, Modal, ScrollView, StatusBar, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

const EMPTY_PRESET = { label: '', officeIn: '', officeOut: '', startDate: '', endDate: '' };

export default function App() {
  const [showQR, setShowQR] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState('Akshara Shaji');
  const [employeeId, setEmployeeId] = useState('2878233');
  const [officeIn, setOfficeIn] = useState('10:20');
  const [officeOut, setOfficeOut] = useState('20:45');
  const [startDate, setStartDate] = useState('1st Nov, 2026');
  const [endDate, setEndDate] = useState('30th Nov, 2026');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [presets, setPresets] = useState([
    { ...EMPTY_PRESET },
    { ...EMPTY_PRESET },
    { ...EMPTY_PRESET },
    { ...EMPTY_PRESET },
    { ...EMPTY_PRESET },
  ]);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [saveToSlotPickerOpen, setSaveToSlotPickerOpen] = useState(false);
  const [editPresetLabelIndex, setEditPresetLabelIndex] = useState(null);
  const [editPresetLabelText, setEditPresetLabelText] = useState('');

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('@name');
        const savedEmployeeId = await AsyncStorage.getItem('@employeeId');
        const savedOfficeIn = await AsyncStorage.getItem('@officeIn');
        const savedOfficeOut = await AsyncStorage.getItem('@officeOut');
        const savedStartDate = await AsyncStorage.getItem('@startDate');
        const savedEndDate = await AsyncStorage.getItem('@endDate');
        const savedDarkMode = await AsyncStorage.getItem('@isDarkMode');
        const savedPresets = await AsyncStorage.getItem('@presets');
        if (savedName !== null) setName(savedName);
        if (savedEmployeeId !== null) setEmployeeId(savedEmployeeId);
        if (savedOfficeIn !== null) setOfficeIn(savedOfficeIn);
        if (savedOfficeOut !== null) setOfficeOut(savedOfficeOut);
        if (savedStartDate !== null) setStartDate(savedStartDate);
        if (savedEndDate !== null) setEndDate(savedEndDate);
        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
        if (savedPresets !== null) setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.log('Failed to load saved data');
      }
    };
    loadSavedData();
  }, []);

  const handleSaveDetails = async () => {
    setEditModalVisible(false);
    setPresetDropdownOpen(false);
    setSaveToSlotPickerOpen(false);
    try {
      await AsyncStorage.setItem('@name', name);
      await AsyncStorage.setItem('@employeeId', employeeId);
      await AsyncStorage.setItem('@officeIn', officeIn);
      await AsyncStorage.setItem('@officeOut', officeOut);
      await AsyncStorage.setItem('@startDate', startDate);
      await AsyncStorage.setItem('@endDate', endDate);
      await AsyncStorage.setItem('@isDarkMode', isDarkMode.toString());
      await AsyncStorage.setItem('@presets', JSON.stringify(presets));
    } catch (e) {
      console.log('Failed to save data');
    }
  };

  const isPresetEmpty = (p) => !p.startDate && !p.endDate && !p.officeIn && !p.officeOut;

  const saveToPreset = (index) => {
    var updated = presets.slice();
    var existingLabel = updated[index].label;
    updated[index] = {
      label: existingLabel || 'Preset ' + (index + 1),
      officeIn: officeIn,
      officeOut: officeOut,
      startDate: startDate,
      endDate: endDate,
    };
    setPresets(updated);
    setSaveToSlotPickerOpen(false);
    Alert.alert('Saved', 'Current settings saved to ' + updated[index].label);
  };

  const loadPreset = (index) => {
    var p = presets[index];
    if (!p.startDate && !p.endDate && !p.officeIn && !p.officeOut) {
      Alert.alert('Empty Slot', 'This preset slot is empty. Save current settings to it first.');
      return;
    }
    setOfficeIn(p.officeIn);
    setOfficeOut(p.officeOut);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setPresetDropdownOpen(false);
  };

  const clearPreset = (index) => {
    Alert.alert(
      'Clear Preset',
      'Remove "' + (presets[index].label || 'Slot ' + (index + 1)) + '"?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            var updated = presets.slice();
            updated[index] = { label: '', officeIn: '', officeOut: '', startDate: '', endDate: '' };
            setPresets(updated);
          },
        },
      ]
    );
  };

  const savePresetLabel = (index) => {
    var updated = presets.slice();
    updated[index] = Object.assign({}, updated[index], { label: editPresetLabelText });
    setPresets(updated);
    setEditPresetLabelIndex(null);
    setEditPresetLabelText('');
  };

  const qrData = 'Name: ' + name + '\nEmployee ID: ' + employeeId + '\nStop: Thane Stn. E Kopari\nRoute: Both\nValid: ' + startDate + ' to ' + endDate;

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
    presetBg: isDarkMode ? '#2A2A2A' : '#F0F0F5',
    presetEmptyText: isDarkMode ? '#555555' : '#BBBBBB',
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

  const renderIcon = (family, iconName, color) => {
    const size = 20;
    if (family === 'MaterialIcons') return <MaterialIcons name={iconName} size={size} color={color} />;
    if (family === 'FontAwesome5') return <FontAwesome5 name={iconName} size={size} color={color} />;
    return <Ionicons name={iconName} size={size} color={color} />;
  };

  const handlePinSubmit = () => {
    if (pinInput === employeeId || pinInput === '2878233') {
      setPinModalVisible(false);
      setPinInput('');
      setTimeout(() => setEditModalVisible(true), 300);
    } else {
      Alert.alert('Error', 'Incorrect PIN');
      setPinInput('');
    }
  };

  const renderPresetSlot = (preset, index) => {
    var empty = isPresetEmpty(preset);
    var slotLabel = preset.label || (empty ? 'Slot ' + (index + 1) + ' \u2014 Empty' : 'Preset ' + (index + 1));
    var badgeBg = empty ? (isDarkMode ? '#333' : '#ddd') : '#52369C';
    var badgeColor = empty ? theme.textSecondary : '#fff';

    return (
      <View key={'load-' + index} style={[styles.presetSlotRow, index < 4 && { borderBottomWidth: 1, borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity
          style={styles.presetSlotContent}
          onPress={() => loadPreset(index)}
          disabled={empty}
        >
          <View style={[styles.presetSlotBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.presetSlotBadgeText, { color: badgeColor }]}>{index + 1}</Text>
          </View>
          <View style={styles.presetSlotInfo}>
            {editPresetLabelIndex === index ? (
              <View style={styles.presetLabelEditRow}>
                <TextInput
                  style={[styles.presetLabelInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]}
                  value={editPresetLabelText}
                  onChangeText={setEditPresetLabelText}
                  placeholder="Preset name..."
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                  maxLength={20}
                />
                <TouchableOpacity onPress={() => savePresetLabel(index)} style={styles.presetLabelSaveBtn}>
                  <MaterialIcons name="check" size={20} color="#1E9D28" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditPresetLabelIndex(null); setEditPresetLabelText(''); }} style={styles.presetLabelSaveBtn}>
                  <MaterialIcons name="close" size={20} color="#cc3333" />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={[styles.presetSlotName, { color: empty ? theme.presetEmptyText : theme.textPrimary }]}>
                  {slotLabel}
                </Text>
                {!empty && (
                  <Text style={[styles.presetSlotDetail, { color: theme.textSecondary }]}>
                    {preset.startDate + ' \u2192 ' + preset.endDate + '  \u2022  ' + preset.officeIn + '\u2013' + preset.officeOut}
                  </Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
        {!empty && editPresetLabelIndex !== index && (
          <View style={styles.presetSlotActions}>
            <TouchableOpacity
              onPress={() => { setEditPresetLabelIndex(index); setEditPresetLabelText(preset.label || ''); }}
              style={styles.presetActionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="edit" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => clearPreset(index)}
              style={styles.presetActionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="delete-outline" size={16} color="#cc3333" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderSaveSlot = (preset, index) => {
    var empty = isPresetEmpty(preset);
    var saveBadgeBg = empty ? (isDarkMode ? '#333' : '#ddd') : '#52369C';
    var saveBadgeColor = empty ? theme.textSecondary : '#fff';
    var saveLabel = empty ? 'Save to Slot ' + (index + 1) : 'Overwrite: ' + (preset.label || 'Preset ' + (index + 1));

    return (
      <TouchableOpacity
        key={'save-' + index}
        style={[styles.saveSlotRow, index < 4 && { borderBottomWidth: 1, borderBottomColor: theme.borderColor }]}
        onPress={() => {
          if (!empty) {
            Alert.alert(
              'Overwrite Preset?',
              '"' + (preset.label || 'Preset ' + (index + 1)) + '" already has data. Replace it with the current settings?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Overwrite', onPress: () => saveToPreset(index) },
              ]
            );
          } else {
            saveToPreset(index);
          }
        }}
      >
        <View style={[styles.presetSlotBadge, { backgroundColor: saveBadgeBg }]}>
          <Text style={[styles.presetSlotBadgeText, { color: saveBadgeColor }]}>{index + 1}</Text>
        </View>
        <Text style={[styles.saveSlotText, { color: theme.textPrimary }]}>
          {saveLabel}
        </Text>
        {!empty && <MaterialIcons name="warning" size={14} color="#E8A317" style={{ marginLeft: 4 }} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor="#52369C" barStyle="light-content" translucent={true} />
      
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

        <View style={[styles.detailsCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.greenCorner} />
          <View style={[styles.greenCornerCutout, { backgroundColor: theme.cardBg }]} />

          <Text style={[styles.confirmedTitle, { color: theme.textTitle }]}>Confirmed Bus Pass</Text>
          <View style={[styles.dashedLine, { borderColor: theme.borderColor }]} />

          {!showQR ? (
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Name</Text>
                  <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{name}</Text>
                </View>
                <View style={[styles.infoColumn, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Employee ID</Text>
                  <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{employeeId}</Text>
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
              <Text style={styles.sidebarHeaderName}>Hi, {name}</Text>
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

      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={[styles.inputModalView, { backgroundColor: theme.modalBg, maxHeight: '85%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: theme.textTitle }]}>Edit Pass Data</Text>
              
              <View style={[styles.presetSection, { borderColor: theme.borderColor }]}>
                <Text style={[styles.presetSectionTitle, { color: theme.textPrimary }]}>
                  <MaterialIcons name="bookmark" size={16} color="#52369C" /> Date/Time Presets
                </Text>

                <TouchableOpacity
                  style={[styles.presetDropdownButton, { backgroundColor: theme.presetBg, borderColor: theme.borderColor }]}
                  onPress={() => { setPresetDropdownOpen(!presetDropdownOpen); setSaveToSlotPickerOpen(false); }}
                >
                  <View style={styles.presetDropdownButtonInner}>
                    <MaterialIcons name="schedule" size={18} color="#52369C" />
                    <Text style={[styles.presetDropdownButtonText, { color: theme.textPrimary }]}>Load Preset</Text>
                  </View>
                  <MaterialIcons name={presetDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color={theme.textSecondary} />
                </TouchableOpacity>

                {presetDropdownOpen && (
                  <View style={[styles.presetDropdownList, { backgroundColor: theme.presetBg, borderColor: theme.borderColor }]}>
                    {presets.map((preset, index) => renderPresetSlot(preset, index))}
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.presetDropdownButton, { backgroundColor: theme.presetBg, borderColor: theme.borderColor, marginTop: 8 }]}
                  onPress={() => { setSaveToSlotPickerOpen(!saveToSlotPickerOpen); setPresetDropdownOpen(false); }}
                >
                  <View style={styles.presetDropdownButtonInner}>
                    <MaterialIcons name="save" size={18} color="#1E9D28" />
                    <Text style={[styles.presetDropdownButtonText, { color: theme.textPrimary }]}>Save Current to Preset</Text>
                  </View>
                  <MaterialIcons name={saveToSlotPickerOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color={theme.textSecondary} />
                </TouchableOpacity>

                {saveToSlotPickerOpen && (
                  <View style={[styles.presetDropdownList, { backgroundColor: theme.presetBg, borderColor: theme.borderColor }]}>
                    {presets.map((preset, index) => renderSaveSlot(preset, index))}
                  </View>
                )}
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Employee ID</Text>
              <TextInput style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.borderColor }]} value={employeeId} onChangeText={setEmployeeId} keyboardType="numeric" />

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
            </ScrollView>
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
  scrollContent: { padding: 15, paddingBottom: 5 },
  routeCard: { borderRadius: 8, padding: 15, marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  routeTop: { alignItems: 'center', marginBottom: 12 },
  routeText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'sans-serif' },
  swapIcon: { marginVertical: 5 },
  routeBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: '#fff', fontSize: 16, fontWeight: '500', fontFamily: 'sans-serif' },
  detailsCard: { borderRadius: 8, padding: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, position: 'relative', overflow: 'hidden' },
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
  cancelText: { fontSize: 14, fontFamily: 'sans-serif' },
  presetSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  presetSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'sans-serif',
  },
  presetDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  presetDropdownButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetDropdownButtonText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'sans-serif',
  },
  presetDropdownList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
  },
  presetSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  presetSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  presetSlotBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  presetSlotBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  presetSlotInfo: {
    flex: 1,
  },
  presetSlotName: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'sans-serif',
  },
  presetSlotDetail: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'sans-serif',
  },
  presetSlotActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  presetActionBtn: {
    padding: 4,
    marginLeft: 2,
  },
  presetLabelEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetLabelInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'sans-serif',
  },
  presetLabelSaveBtn: {
    padding: 4,
    marginLeft: 4,
  },
  saveSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  saveSlotText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'sans-serif',
    flex: 1,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';

const AddChallengeModal = ({ isVisible, onClose, onAdd, isEditing, existingChallenge }) => {
  const [newChallenge, setNewChallenge] = useState({ title: '', status: '', date: new Date() });
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [isDateVisible, setIsDateVisible] = useState(false);

  useEffect(() => {
    if (isEditing && existingChallenge) {
      setNewChallenge({ title: existingChallenge.title, status: existingChallenge.status, date: new Date(existingChallenge.date) });
    }
  }, [isEditing, existingChallenge]);

  const handleSave = () => {
    if (!newChallenge.title || !newChallenge.status || !newChallenge.date) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    onAdd(newChallenge, isEditing);
    setNewChallenge({ title: '', status: '', date: new Date() });
  };

  const toggleStatusModal = () => {
    setIsStatusVisible(!isStatusVisible);
  };

  const handleStatusSelect = (status) => {
    setNewChallenge({ ...newChallenge, status });
    setIsStatusVisible(false);
  };

  const showDatePicker = () => {
    setIsDateVisible(true);
  };

  const handleDateSelect = (date) => {
    setNewChallenge({ ...newChallenge, date });
    setIsDateVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setIsDateVisible(false);
    if (selectedDate) {
      setNewChallenge({ ...newChallenge, date: selectedDate });
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{isEditing ? 'Edit Challenge' : 'Create Challenge'}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Challenge Title"
          value={newChallenge.title}
          onChangeText={(text) => setNewChallenge({ ...newChallenge, title: text })}
        />
        
        {/* Challenge Status Dropdown */}
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Select Challenge Status</Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={toggleStatusModal}
          >
            <Text style={styles.statusText}>{newChallenge.status || 'Select Status'}</Text>
          </TouchableOpacity>

          {isStatusVisible && (
            <View style={styles.statusModal}>
              <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('Ongoing')}>
                <Text style={styles.statusOptionText}>Ongoing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('Upcoming')}>
                <Text style={styles.statusOptionText}>Upcoming</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('Ended')}>
                <Text style={styles.statusOptionText}>Ended</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Select Challenge Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateText}>{newChallenge.date.toDateString()}</Text>
          </TouchableOpacity>

          {/* Simple Date Picker (Modal) */}
          {isDateVisible && (
            <View style={styles.dateModal}>
              <Text style={styles.dateModalTitle}>Pick a Date</Text>
              <TouchableOpacity
                style={styles.dateModalButton}
                onPress={() => handleDateSelect(new Date())}
              >
                <Text style={styles.dateModalText}>Today: {new Date().toDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateModalButton}
                onPress={() => handleDateSelect(new Date(new Date().setDate(new Date().getDate() + 1)))}
              >
                <Text style={styles.dateModalText}>Tomorrow: {(new Date(new Date().setDate(new Date().getDate() + 1))).toDateString()}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
  },
  statusContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  statusButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  statusModal: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    marginTop: 5,
    zIndex: 1,
  },
  statusOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dateContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dateButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dateModal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 10,
    zIndex: 1,
  },
  dateModalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  dateModalButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#DDD',
    borderRadius: 8,
  },
  dateModalText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green for save
  },
  cancelButton: {
    backgroundColor: '#F44336', // Red for cancel
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddChallengeModal;

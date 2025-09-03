
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface Props {
  showAddTaskModal: boolean
  handleCloseModal: () => void
  handleAddTask: ({title, label, dueDate}: {title: string, label: string, dueDate: Date}) => void
}

const TaskModal = ({showAddTaskModal, handleAddTask, handleCloseModal}: Props) => {

  const [taskTitle, setTaskTitle] = useState<string>('')
  const [label, setLabel] = useState<string>('')
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date | null>(null)

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setDueDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time && dueDate) {
      // Combine the selected date with the selected time
      const newDateTime = new Date(dueDate);
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());
      setDueDate(newDateTime);
    }
  };

  const addTask = () => {
    if (!taskTitle || !label || !dueDate) return
    handleAddTask({title: taskTitle, label: label, dueDate: dueDate})
    setTaskTitle('')
    setLabel('')
    setDueDate(null)
  }

  return (
    <>
      <Modal
        visible={showAddTaskModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <IconSymbol size={24} name="checkmark" color={'#333'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Task Title</Text>
                <View style={styles.inputPlaceholder}>
                  <TextInput
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Enter task title..."
                  />
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Label</Text>
                <View style={styles.inputPlaceholder}>
                  <TextInput
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Enter task label..."
                  />
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Due Date</Text>
                <View style={styles.dateTimeContainer}>
                  <Pressable style={styles.dateTimeInput} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.placeholderText}>
                      {dueDate ? dueDate.toLocaleDateString() : "Select date..."}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.dateTimeInput} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.placeholderText}>
                      {dueDate ? dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Select time..."}
                    </Text>
                  </Pressable>
                </View>
                {showDatePicker && (
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={dueDate ?? new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      style={styles.datePicker}
                    />
                  </View>
                )}
                {showTimePicker && (
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={dueDate ?? new Date()}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                      style={styles.datePicker}
                    />
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </>
  )
}

export default TaskModal

const styles = StyleSheet.create({
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputPlaceholder: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#064148',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
})
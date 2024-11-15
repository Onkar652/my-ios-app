import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Task from './components/Task';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTaskItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async () => {
    Keyboard.dismiss();
    try {
      const response = await axios.post('http://localhost:5000/tasks', { text: task });
      setTaskItems([...taskItems, response.data]);
      setTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTask = async (index) => {
    const taskId = taskItems[index]._id;
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      const itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1);
      setTaskItems(itemsCopy);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Today's tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* This is where all tasks go */}
          {
            taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleCompleteTask(index)}>
                <Task text={item.text} key={index} />
              </TouchableOpacity>
            ))
          }
        </View>
      </View>
      {/* Write a task */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.writeTaskWrapper}>
        <TextInput 
          style={styles.input} 
          placeholder={'Write a task'} 
          value={task} 
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light gray background for the container
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Darker color for better contrast
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff", // White background for input
    width: 250,
    borderRadius: 60,
    borderColor: '#c0c0c0', // Light gray border
    borderWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#007bff', // Blue background for the add button
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0056b3', // Darker blue border
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
    color: 'white', // White text color for better contrast
  },
});

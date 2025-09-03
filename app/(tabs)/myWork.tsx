import AnimatedTask from '@/components/AnimatedTask';
import FlashMessage from '@/components/FlashMessage';
import TaskModal from '@/components/TaskModal';
import { TaskItem } from '@/types/taskTypes';
import { getItemFromStorage, setItemToStorage } from '@/utils/storageUtils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MyWorkScreen() {

  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showFlashMessage, setShowFlashMessage] = useState(false)
  const [completedTaskId, setCompletedTaskId] = useState<number | null>(null)
  const params = useLocalSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (params.action === 'showAddTaskModal') {
      setShowAddTaskModal(true)
    }
  }, [params.action])

  useEffect(() => {
    getTasksFromStorage()
  }, [])

  useEffect(() => {
    saveTasksToStorage()
  }, [tasks])

  useEffect(() => {
    if (!showAddTaskModal && params.action === 'showAddTaskModal') {
      router.replace('/(tabs)/myWork')
    }
  }, [showAddTaskModal, params.action, router])


  const getTasksFromStorage = async () => {
    try {
      const storedTasks = await getItemFromStorage('tasks')
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks)
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }))
        setTasks(tasksWithDates)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const saveTasksToStorage = async () => {
    await setItemToStorage('tasks', JSON.stringify(tasks))
  }

  const handleCloseModal = () => {
    setShowAddTaskModal(false)
  }

  const handleAddTask = ({title, label, dueDate}: {title: string, label: string, dueDate: Date}) => {
    const newTask: TaskItem = {
      id: Date.now(),
      title,
      label,
      dueDate,
      status: 'pending'
    }
    setTasks(prevTasks => [...prevTasks, newTask])
    setShowAddTaskModal(false)
  }

  const toggleTaskStatus = (taskId: number) => {
    const currentTask = tasks.find(task => task.id === taskId)
    const isMarkingAsCompleted = currentTask?.status === 'pending'
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
          : task
      )
    )

    if (isMarkingAsCompleted) {
      setCompletedTaskId(taskId)
      setShowFlashMessage(true)
      
      setTimeout(() => {
        animateTaskCompletion(taskId)
      }, 7000)
    } else {
      setShowFlashMessage(false)
    }
  }

  const handleUndoTaskCompletion = () => {
    if (completedTaskId) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === completedTaskId 
            ? { ...task, status: 'pending' }
            : task
        )
      )
      
      setShowFlashMessage(false)
      setCompletedTaskId(null)
    }
  }

  const handleCloseFlashMessage = () => {
    setShowFlashMessage(false)
    setCompletedTaskId(null)
  }

  const animateTaskCompletion = (taskId: number) => {
    setShowFlashMessage(false)
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, isAnimating: true }
          : task
      )

      setTimeout(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      }, 500)
      
      return updatedTasks
    })
  }

  return (
    <>
      <View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Good morning, Louis!</Text>
          <Text style={styles.greeting}>All</Text>
        </View>

        <ScrollView contentContainerStyle={styles.tasksContainer}>
          {
            tasks.map(task => (
              <AnimatedTask
                key={task.id} 
                task={task} 
                onToggleStatus={toggleTaskStatus}
              />
            ))
          }
        </ScrollView>
      </View>

      <TaskModal
        showAddTaskModal={showAddTaskModal}
        handleAddTask={handleAddTask}
        handleCloseModal={handleCloseModal}
      />

      {showFlashMessage && (
        <FlashMessage
          onPressBanner={handleUndoTaskCompletion}
          onPressClose={handleCloseFlashMessage}
          setClosed={setShowFlashMessage}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  greetingContainer: {
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tasksContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 150 : 70,
    gap: 16
  },
  task: {
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white'
  },
  taskInfo: {
    gap: 11,
    flexDirection: 'row'
  },
  taskData: {
    gap: 4,
  },
  taskTitle: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  taskLabel: {
    flexDirection: 'row',
    gap: 4,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0,
    alignItems: 'center'
  },
  taskCheck: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#113C2226',
    height: 32,
    width: 32,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overdue: {
    flexDirection: 'row',
    gap: 4,
    color: '#C51111',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  debugInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  },
});

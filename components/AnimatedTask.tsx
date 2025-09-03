import { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TaskItem } from '../types/taskTypes';
import { IconSymbol } from './ui/IconSymbol';

const AnimatedTask = ({ task, onToggleStatus }: { task: TaskItem, onToggleStatus: (id: number) => void }) => {
  const slideAnim = new Animated.Value(0)
  const opacityAnim = new Animated.Value(1)

  useEffect(() => {
    if (task.isAnimating) {
      // Animate to the left and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [task.isAnimating])

  return (
    <Animated.View 
      style={[
        styles.task,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={styles.taskInfo}>
        <IconSymbol size={16} name="checkmark" color={'#80569C'} />
        <View style={styles.taskData}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.taskLabel}>
            <IconSymbol size={12} name="folder" color={'#333333'} />
            <Text style={styles.taskLabel}>{task.label}</Text>
          </View>
          <View style={styles.taskLabel}>
            <IconSymbol size={12} name="calendar" color={'#333333'} />
            <Text style={styles.taskLabel}>{task.dueDate.toLocaleDateString()}</Text>
            {
              task.dueDate < new Date() ? 
              <View style={styles.overdue}>
                <IconSymbol size={12} name="circle" color={'#C51111'} />
                <Text style={[styles.taskLabel, {color: '#C51111'}]}>Overdue</Text>
              </View>
              :
              <></>
            }
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.taskCheck, 
          {
            backgroundColor: task.status === 'completed' ? '#90D0AA' : '#E5FFF0',
            borderWidth: task.status === 'completed' ? 0 : 1,
          }
        ]} 
        onPress={() => onToggleStatus(task.id)}
      >
        {task.status === 'completed' && (
          <IconSymbol size={10} name="checkmark" color={'white'} />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default AnimatedTask

const styles = StyleSheet.create({
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
});
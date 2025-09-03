export interface TaskItem {
  id: number,
  title: string,
  label: string,
  dueDate: Date,
  status: 'pending' | 'completed'
  isAnimating?: boolean
}
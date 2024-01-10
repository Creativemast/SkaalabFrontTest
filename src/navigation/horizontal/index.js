import { CheckSquare, PieChart } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <PieChart size={20} />,
    navLink: '/home'
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: <CheckSquare size={20} />,
    navLink: '/tasks'
  }
]

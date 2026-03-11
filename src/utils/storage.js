const TASKS_KEY = 'voicetask_tasks'
const CATEGORIES_KEY = 'voicetask_categories'

export const loadTasks = () => {
  try {
    const data = localStorage.getItem(TASKS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export const loadCategories = () => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const saveCategories = (categories) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

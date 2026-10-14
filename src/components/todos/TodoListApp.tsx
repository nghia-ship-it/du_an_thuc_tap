import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

const initialTodos: TodoItem[] = [
  { id: '1', text: 'Thiết lập project React + Vite + TypeScript', completed: true },
  { id: '2', text: 'Cấu hình Tailwind CSS và UI Component Library', completed: true },
  { id: '3', text: 'Tách Component & Custom Hook (useLocalStorage, usePagination)', completed: true },
  { id: '4', text: 'Xây dựng Form validation với React Hook Form & Zod', completed: false },
  { id: '5', text: 'Triển khai Modal sửa/xóa và bảng phân trang', completed: false },
]

export const TodoListApp: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('react_app_todos', initialTodos)
  const [inputText, setInputText] = useState('')

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
    }
    setTodos((prev) => [newTodo, ...prev])
    setInputText('')
  }

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const remainingTodos = todos.filter((t) => !t.completed).length

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Your To Do</h2>
        <p className="text-xs text-slate-400 mt-0.5">Ứng dụng quản lý công việc cá nhân</p>
      </div>

      <form onSubmit={handleAddTodo} className="flex items-center gap-2 mb-5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
        <button
          type="submit"
          className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Thêm công việc"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-2 mb-6">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors group"
            >
              <div
                onClick={() => handleToggleTodo(todo.id)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-blue-500" />
                )}
                <span
                  className={`text-sm transition-all ${
                    todo.completed
                      ? 'line-through text-slate-400'
                      : 'text-slate-700 font-medium'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-slate-400 py-6">
            Không có công việc nào cần làm. Hãy thêm mới!
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs font-semibold text-slate-600">
          Your remaining todos :{' '}
          <span className="text-blue-600">{remainingTodos}</span>
        </p>
        <p className="text-[11px] italic text-slate-400 mt-2">
          "Doing what you love is the cornerstone of having abundance in your life." — Wayne Dyer
        </p>
      </div>
    </div>
  )
}

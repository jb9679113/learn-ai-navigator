'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 在组件挂载前读取 localStorage 和系统偏好
function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    // 检测系统偏好
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'system'
    }
  }
  return 'light'
}

// 根据主题值判断是否为深色模式
function isDarkMode(theme: Theme): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  // system 模式下检测系统偏好
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // 计算当前是否为深色模式
  const isDark = isDarkMode(theme)

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement
    const currentIsDark = isDarkMode(theme)
    
    if (theme === 'system') {
      // 系统模式：移除 data-theme 属性，让 CSS 的 prefers-color-scheme 生效
      root.removeAttribute('data-theme')
    } else {
      // 用户手动选择：设置 data-theme 属性
      root.setAttribute('data-theme', theme)
    }
    
    // 保存到 localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  // 监听系统主题变化（仅在 system 模式下）
  useEffect(() => {
    if (theme !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // 触发重渲染以更新 isDark
      setTheme(prev => prev)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // 切换主题：light -> dark -> system -> light
  const toggleTheme = () => {
    setTheme((prev) => {
      switch (prev) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'system'
        case 'system':
          return 'light'
        default:
          return 'light'
      }
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

'use client'

import * as React from 'react'

interface AssistantContext {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  hasSeenIntro: boolean
  setHasSeenIntro: (seen: boolean) => void
  completedTasks: string[]
  addCompletedTask: (task: string) => void
}

const AssistantContext = React.createContext<AssistantContext | undefined>(undefined)

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = React.useState(true)
  const [hasSeenIntro, setHasSeenIntro] = React.useState(false)
  const [completedTasks, setCompletedTasks] = React.useState<string[]>([])

  React.useEffect(() => {
    const stored = localStorage.getItem('assistant_preferences')
    if (stored) {
      const preferences = JSON.parse(stored)
      setIsEnabled(preferences.isEnabled)
      setHasSeenIntro(preferences.hasSeenIntro)
      setCompletedTasks(preferences.completedTasks || [])
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('assistant_preferences', JSON.stringify({
      isEnabled,
      hasSeenIntro,
      completedTasks
    }))
  }, [isEnabled, hasSeenIntro, completedTasks])

  const addCompletedTask = React.useCallback((task: string) => {
    setCompletedTasks(prev => [...new Set([...prev, task])])
  }, [])

  return (
    <AssistantContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        hasSeenIntro,
        setHasSeenIntro,
        completedTasks,
        addCompletedTask
      }}
    >
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  const context = React.useContext(AssistantContext)
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider')
  }
  return context
}


import { useSyncExternalStore, useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

function useTheme() {
  const subscribe = useCallback((callback: () => void) => {
    const observer = new MutationObserver(callback)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.classList.contains('dark')
        ? ('dark' as const)
        : ('light' as const),
    () => 'light' as const
  )
}

export default function ThemeToggle() {
  const mounted = useIsMounted()
  const theme = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-transparent" aria-hidden="true" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
      type="button"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      ) : (
        <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      )}
    </button>
  )
}

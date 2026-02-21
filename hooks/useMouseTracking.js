import { useEffect, useRef } from 'react'

export function useMouseTracking(sessionId, enabled = true) {
  const eventsRef = useRef([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!enabled || !sessionId) return

    const handleMouseMove = (e) => {
      const event = {
        type: 'mousemove',
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName,
        timestamp: Date.now()
      }
      eventsRef.current.push(event)
    }

    const handleClick = (e) => {
      const event = {
        type: 'click',
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName,
        targetId: e.target.id,
        targetClass: e.target.className,
        timestamp: Date.now()
      }
      eventsRef.current.push(event)
    }

    const handleScroll = () => {
      const event = {
        type: 'scroll',
        scrollY: window.scrollY,
        timestamp: Date.now()
      }
      eventsRef.current.push(event)
    }

    // Enviar eventos a cada 30 segundos
    const sendEvents = async () => {
      if (eventsRef.current.length === 0) return

      const eventsToSend = [...eventsRef.current]
      eventsRef.current = []

      try {
        await fetch(`/api/session/${sessionId}/eventos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: eventsToSend })
        })
      } catch (error) {
        console.error('Erro ao enviar eventos:', error)
        // Devolve eventos ao array em caso de erro
        eventsRef.current = [...eventsToSend, ...eventsRef.current]
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)

    timeoutRef.current = setInterval(sendEvents, 30000) // 30 segundos

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeoutRef.current)
      
      // Enviar eventos restantes ao desmontar
      sendEvents()
    }
  }, [sessionId, enabled])

  return null
}
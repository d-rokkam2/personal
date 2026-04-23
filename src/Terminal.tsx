import { useState, useEffect, useRef, useCallback } from 'react'
import { PROJECTS, SKILL_GROUPS, EXPERIENCE } from './data'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TerminalLine {
  type: 'input' | 'output' | 'error'
  text: string
}

interface CommandResult {
  lines: TerminalLine[]
  scrollTo?: string
  download?: boolean
}

// ── Welcome message ───────────────────────────────────────────────────────────

const WELCOME: TerminalLine[] = [
  { type: 'output', text: 'Dhruv Rokkam — Portfolio Terminal' },
  { type: 'output', text: '─'.repeat(34) },
  { type: 'output', text: 'Type `help` to see available commands.' },
  { type: 'output', text: '' },
]

// ── Command registry ──────────────────────────────────────────────────────────

function runCommand(raw: string): CommandResult {
  const trimmed = raw.trim()
  const lower   = trimmed.toLowerCase()
  const [cmd, ...args] = lower.split(/\s+/)

  // Multi-word command
  if (lower === 'cat resume.pdf') {
    return {
      lines: [{ type: 'output', text: 'Opening Dhruv_Rokkam_Resume.pdf…' }],
      download: true,
    }
  }

  switch (cmd) {
    // ── help ──────────────────────────────────────────────────────────────────
    case 'help':
      return {
        lines: [
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '' },
          { type: 'output', text: '  whoami                — about me' },
          { type: 'output', text: '  skills                — all technologies & tools' },
          { type: 'output', text: '  skills <keyword>      — filter by keyword' },
          { type: 'output', text: '  projects              — all projects' },
          { type: 'output', text: '  projects <name>       — filter by project name' },
          { type: 'output', text: '  experience            — full work history' },
          { type: 'output', text: '  experience <company>  — filter by company' },
          { type: 'output', text: '  contact               — contact info & links' },
          { type: 'output', text: '  cat resume.pdf        — download resume' },
          { type: 'output', text: '  cd <section>          — navigate to section' },
          { type: 'output', text: '  ls                    — list sections' },
          { type: 'output', text: '  clear                 — clear terminal' },
          { type: 'output', text: '' },
        ],
      }

    // ── whoami ────────────────────────────────────────────────────────────────
    case 'whoami':
      return {
        lines: [
          { type: 'output', text: 'Dhruv Rokkam' },
          { type: 'output', text: 'Full-Stack Software Engineer · Boston, MA' },
          { type: 'output', text: '' },
          { type: 'output', text: 'B.S. Data Science & Biochemistry' },
          { type: 'output', text: 'Northeastern University · May 2026' },
          { type: 'output', text: '' },
          { type: 'output', text: 'Incoming Associate Engineer @ MathWorks' },
          { type: 'output', text: '' },
          { type: 'output', text: 'I build clean, performant systems and close the gap' },
          { type: 'output', text: 'between ML research and production software.' },
          { type: 'output', text: '' },
        ],
        scrollTo: 'about',
      }

    // ── skills ────────────────────────────────────────────────────────────────
    case 'skills': {
      const filter = args.join(' ')
      const groups = filter
        ? SKILL_GROUPS.filter(
            g =>
              g.title.toLowerCase().includes(filter) ||
              g.items.toLowerCase().includes(filter)
          )
        : SKILL_GROUPS

      if (groups.length === 0) {
        return {
          lines: [
            { type: 'error', text: `No skills found matching "${args.join(' ')}"` },
            { type: 'output', text: 'Try: skills languages | skills ml | skills aws' },
          ],
        }
      }

      const lines: TerminalLine[] = []
      groups.forEach(g => {
        lines.push({ type: 'output', text: g.title })
        lines.push({ type: 'output', text: `  ${g.items}` })
        lines.push({ type: 'output', text: '' })
      })
      return { lines, scrollTo: 'skills' }
    }

    // ── projects ──────────────────────────────────────────────────────────────
    case 'projects': {
      const filter = args.join(' ')
      const list = filter
        ? PROJECTS.filter(
            p =>
              p.name.toLowerCase().includes(filter) ||
              p.description.toLowerCase().includes(filter) ||
              p.tech.some(t => t.toLowerCase().includes(filter))
          )
        : PROJECTS

      if (list.length === 0) {
        return {
          lines: [
            { type: 'error', text: `No project found matching "${args.join(' ')}"` },
            { type: 'output', text: 'Try: projects lestat | projects med2care | projects ml' },
          ],
        }
      }

      const lines: TerminalLine[] = []
      list.forEach(p => {
        lines.push({ type: 'output', text: p.name })
        lines.push({ type: 'output', text: `  ${p.description}` })
        lines.push({ type: 'output', text: `  Stack: ${p.tech.join(', ')}` })
        lines.push({ type: 'output', text: '' })
      })
      return { lines, scrollTo: 'projects' }
    }

    // ── experience ────────────────────────────────────────────────────────────
    case 'experience': {
      const filter = args.join(' ')
      const list = filter
        ? EXPERIENCE.filter(
            e =>
              e.company.toLowerCase().includes(filter) ||
              e.role.toLowerCase().includes(filter)
          )
        : EXPERIENCE

      if (list.length === 0) {
        return {
          lines: [
            { type: 'error', text: `No experience found matching "${args.join(' ')}"` },
            { type: 'output', text: 'Try: experience mathworks | experience nara | experience intern' },
          ],
        }
      }

      const lines: TerminalLine[] = []
      list.forEach(e => {
        lines.push({ type: 'output', text: `${e.role} @ ${e.company}` })
        lines.push({ type: 'output', text: `  ${e.period}` })
        e.bullets.forEach(b => lines.push({ type: 'output', text: `  · ${b}` }))
        lines.push({ type: 'output', text: '' })
      })
      return { lines, scrollTo: 'experience' }
    }

    // ── contact ───────────────────────────────────────────────────────────────
    case 'contact':
      return {
        lines: [
          { type: 'output', text: 'Email    rokkam.d@northeastern.edu' },
          { type: 'output', text: 'Phone    203-945-6242' },
          { type: 'output', text: 'GitHub   https://github.com/d-rokkam2' },
          { type: 'output', text: 'LinkedIn https://linkedin.com/in/dhruv-rokkam' },
          { type: 'output', text: '' },
        ],
        scrollTo: 'contact',
      }

    // ── cd ────────────────────────────────────────────────────────────────────
    case 'cd': {
      const target = args[0] ?? ''
      const valid = ['about', 'education', 'skills', 'projects', 'experience', 'contact']
      if (valid.includes(target)) {
        return {
          lines: [{ type: 'output', text: `Navigating to /${target}…` }],
          scrollTo: target,
        }
      }
      return {
        lines: [{ type: 'error', text: `cd: no such section: ${target || '~'}` }],
      }
    }

    // ── ls ────────────────────────────────────────────────────────────────────
    case 'ls':
      return {
        lines: [
          { type: 'output', text: 'drwxr-xr-x  about/' },
          { type: 'output', text: 'drwxr-xr-x  education/' },
          { type: 'output', text: 'drwxr-xr-x  skills/' },
          { type: 'output', text: 'drwxr-xr-x  projects/' },
          { type: 'output', text: 'drwxr-xr-x  experience/' },
          { type: 'output', text: 'drwxr-xr-x  contact/' },
          { type: 'output', text: '-rw-r--r--  resume.pdf' },
          { type: 'output', text: '' },
        ],
      }

    // ── easter eggs ───────────────────────────────────────────────────────────
    case 'sudo':
      return { lines: [{ type: 'error', text: 'Permission denied. Nice try 😄' }] }

    case 'vim':
    case 'vi':
    case 'nano':
      return { lines: [{ type: 'error', text: 'You can\'t exit vim from here either.' }] }

    case 'rm':
      return { lines: [{ type: 'error', text: 'Whoa there. The portfolio stays.' }] }

    case 'pwd':
      return { lines: [{ type: 'output', text: '/home/dhruv/portfolio' }, { type: 'output', text: '' }] }

    case 'date':
      return { lines: [{ type: 'output', text: new Date().toString() }, { type: 'output', text: '' }] }

    // ── empty input ───────────────────────────────────────────────────────────
    case '':
    case undefined:
      return { lines: [] }

    // ── unknown ───────────────────────────────────────────────────────────────
    default:
      return {
        lines: [
          { type: 'error', text: `Command not found: ${cmd}` },
          { type: 'output', text: "Type 'help' for available commands." },
          { type: 'output', text: '' },
        ],
      }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void
}

export default function Terminal({ onClose }: Props) {
  const [lines, setLines]   = useState<TerminalLine[]>(WELCOME)
  const [input, setInput]   = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const bodyRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(() => {
    const raw = input
    setInput('')
    setHistIdx(-1)

    // Always echo the typed line
    const inputLine: TerminalLine = { type: 'input', text: `dhruv@portfolio:~$ ${raw}` }

    // Handle clear separately (resets back to welcome)
    if (raw.trim().toLowerCase() === 'clear') {
      setLines(WELCOME)
      if (raw.trim()) setHistory(prev => [raw, ...prev.slice(0, 49)])
      return
    }

    const result = runCommand(raw)
    setLines(prev => [...prev, inputLine, ...result.lines])

    if (raw.trim()) {
      setHistory(prev => [raw, ...prev.slice(0, 49)])
    }

    if (result.scrollTo) {
      setTimeout(() => {
        document.getElementById(result.scrollTo!)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }

    if (result.download) {
      const a = document.createElement('a')
      a.href = '/resume.pdf'
      a.download = 'Dhruv_Rokkam_Resume.pdf'
      a.click()
    }
  }, [input])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      if (history[next] !== undefined) setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput('') }
      else { setHistIdx(next); setInput(history[next]) }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="terminal" onClick={e => e.stopPropagation()}>
      {/* Title bar */}
      <div className="terminal__bar">
        <div className="terminal__dots">
          <span className="terminal__dot terminal__dot--red"   onClick={onClose} title="Close" />
          <span className="terminal__dot terminal__dot--yellow" />
          <span className="terminal__dot terminal__dot--green" />
        </div>
        <span className="terminal__title">dhruv@portfolio: ~</span>
        <div style={{ width: 52 }} /> {/* balance the dots on the right */}
      </div>

      {/* Output buffer */}
      <div className="terminal__body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal__line terminal__line--${line.type}`}>
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Input prompt */}
      <div className="terminal__prompt">
        <span className="terminal__prompt-symbol">dhruv@portfolio:~$</span>
        <input
          ref={inputRef}
          className="terminal__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
    </div>
  )
}

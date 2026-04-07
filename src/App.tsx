import { useState, useEffect } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    name: 'Project One',
    description: 'A brief description of what this project does and the problem it solves.',
    tech: ['React', 'TypeScript', 'Node.js'],
    github: '#',
    live: '#',
  },
  {
    id: 2,
    name: 'Project Two',
    description: 'A brief description of what this project does and the problem it solves.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    github: '#',
    live: '#',
  },
  {
    id: 3,
    name: 'Project Three',
    description: 'A brief description of what this project does and the problem it solves.',
    tech: ['Next.js', 'Tailwind CSS', 'Prisma'],
    github: '#',
    live: '#',
  },
]

const EXPERIENCE = [
  {
    id: 1,
    role: 'Incoming Engineer',
    company: 'MathWorks',
    period: 'Aug 2026...',
    bullets: [
      'Incoming associate engineer in the MathWorks Engineering Development Group.'
    ],
  },
  {
    id: 2,
    role: 'Software Engineer Co-op',
    company: 'Nara Logics',
    period: 'Jan 2026 – Mar 2026',
    bullets: [
      '.....',
      '......',
      '...',
    ],
  },
  {
    id: 3,
    role: 'Software Engineer Co-op',
    company: 'PhAST Corp.',
    period: 'Jan 2025 - Jun 2026',
    bullets: [
      '....',
      '.....',
      '.....',
    ],
  },
  {
    id: 4,
    role: 'Software Engineer Intern',
    company: 'Alnylam Pharmaceuticals',
    period: 'May 2024 - Sep 2024',
    bullets: [
      '...',
      '...'
    ],
  },{
    id: 5,
    role: 'Data Science Intern',
    company: 'HCL Technologies',
    period: 'Apr 2023 - Sep 2023',
    bullets: [
      '...',
      '...'
    ],
  }
]

// ── Icons ─────────────────────────────────────────────────────────────────────

function FolderIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  )
}

// ── Components ────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <button className="nav__logo" onClick={() => scrollTo('about')}>DR</button>
      <ul className="nav__links">
        {(['about', 'projects', 'experience', 'contact'] as const).map(id => (
          <li key={id}>
            <button onClick={() => scrollTo(id)}>{id}</button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function About() {
  return (
    <section id="about" className="section hero">
      <div className="container">
        <p className="eyebrow">Hi, my name is </p>
        <h1 className="hero__name">Dhruv Rokkam.</h1>
        <h2 className="hero__tagline">I like to solve problems.</h2>
        <p className="hero__bio">
          I'm a software engineer based in Boston, MA with a passion for building
          clean, performant, and accessible digital experiences. I'm currently
          focused on building the bridge between machine learning and software engineering solutions.
        </p>
        <button className="btn" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
          Get in touch
        </button>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section__heading">Projects</h2>
        <div className="projects__grid">
          {PROJECTS.map(p => (
            <div key={p.id} className="card">
              <div className="card__top">
                <FolderIcon />
                <div className="card__links">
                  <a href={p.github} aria-label="GitHub" target="_blank" rel="noreferrer">
                    <GitHubIcon />
                  </a>
                  <a href={p.live} aria-label="Live site" target="_blank" rel="noreferrer">
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>
              <h3 className="card__name">{p.name}</h3>
              <p className="card__desc">{p.description}</p>
              <ul className="card__tech">
                {p.tech.map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const [active, setActive] = useState(0)
  const exp = EXPERIENCE[active]

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section__heading">Experience</h2>
        <div className="exp">
          <ul className="exp__tabs">
            {EXPERIENCE.map((e, i) => (
              <li key={e.id}>
                <button
                  className={`exp__tab${i === active ? ' exp__tab--active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {e.company}
                </button>
              </li>
            ))}
          </ul>
          <div className="exp__panel">
            <h3 className="exp__role">
              {exp.role} <span>@ {exp.company}</span>
            </h3>
            <p className="exp__period">{exp.period}</p>
            <ul className="exp__bullets">
              {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <p className="eyebrow">What's next?</p>
        <h2 className="contact__heading">Get In Touch</h2>
        <p className="contact__text">
          I'm currently open to new opportunities. Whether you have a question,
          a project idea, or just want to say hi — my inbox is always open.
        </p>
        <a href="mailto:your@email.com" className="btn">Say Hello</a>
        <ul className="socials">
          <li>
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>Designed &amp; Built by Your Name</p>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

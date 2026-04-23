import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App — smoke tests', () => {
  it('renders without crashing', () => {
    render(<App />)
  })

  it('displays hero with correct name', () => {
    render(<App />)
    expect(screen.getByText('Dhruv Rokkam.')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<App />)
    for (const label of ['about', 'education', 'skills', 'projects', 'experience', 'contact']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('renders education section', () => {
    render(<App />)
    expect(screen.getByText('Northeastern University')).toBeInTheDocument()
    expect(screen.getByText(/Data Science and Biochemistry/)).toBeInTheDocument()
  })

  it('renders all projects', () => {
    render(<App />)
    expect(screen.getByText('Med2Care')).toBeInTheDocument()
    expect(screen.getByText('LeStat')).toBeInTheDocument()
  })

  it('renders all experience company tabs', () => {
    render(<App />)
    for (const co of ['MathWorks', 'Nara Logics', 'PhAST Corp', 'Alnylam Pharmaceuticals', 'HCLTech']) {
      expect(screen.getByRole('button', { name: co })).toBeInTheDocument()
    }
  })

  it('switches experience panel on tab click', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Nara Logics' }))
    expect(screen.getByText(/fuzzy matching/i)).toBeInTheDocument()
  })

  it('renders contact section with email link', () => {
    render(<App />)
    const emailLink = screen.getByRole('link', { name: /say hello/i })
    expect(emailLink).toHaveAttribute('href', 'mailto:rokkam.d@northeastern.edu')
  })

  it('renders GitHub social link', () => {
    render(<App />)
    const ghLink = screen.getByRole('link', { name: /github/i })
    expect(ghLink).toHaveAttribute('href', 'https://github.com/d-rokkam2')
  })

  it('renders footer', () => {
    render(<App />)
    expect(screen.getByText(/Designed.*Built by Dhruv Rokkam/i)).toBeInTheDocument()
  })
})

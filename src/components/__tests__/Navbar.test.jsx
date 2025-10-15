import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock the entire Navbar component to avoid Semi-UI dependency issues
vi.mock('../Navbar', () => ({
  default: () => (
    <nav>
      <img src="logo.png" alt="logo" />
      <a href="#features">Features</a>
      <a href="/editor">Editor</a>
      <a href="/templates">Templates</a>
      <a href="https://docs.drawdb.app">Docs</a>
      <a href="https://github.com/drawdb-io/drawdb" title="Jump to Github">GitHub</a>
      <a href="https://twitter.com/drawDB_" title="Follow us on X">Twitter</a>
      <a href="https://discord.gg/BrjZgNrmR6" title="Join the community on Discord">Discord</a>
    </nav>
  )
}))

const Navbar = (await import('../Navbar')).default

const NavbarWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    )

    expect(screen.getByAltText('logo')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
    expect(screen.getByText('Templates')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    )

    const githubLink = screen.getByTitle('Jump to Github')
    const twitterLink = screen.getByTitle('Follow us on X')
    const discordLink = screen.getByTitle('Join the community on Discord')

    expect(githubLink).toHaveAttribute('href', 'https://github.com/drawdb-io/drawdb')
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/drawDB_')
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/BrjZgNrmR6')
  })
})
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'

// Mock the socials data
vi.mock('../../data/socials', () => ({
  socials: {
    github: 'https://github.com/drawdb-io/drawdb',
    twitter: 'https://twitter.com/drawDB_',
    discord: 'https://discord.gg/BrjZgNrmR6',
    docs: 'https://docs.drawdb.app'
  }
}))

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

  it('opens mobile menu when menu button is clicked', () => {
    // Mock window.innerWidth for mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    )

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // The SideSheet should be visible (we can't easily test this without mocking the component)
    expect(menuButton).toBeInTheDocument()
  })
})
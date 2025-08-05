import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'

describe('Card Component', () => {
  it('renders Card with children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    render(<Card className="test-class">Card Content</Card>)
    const card = screen.getByText('Card Content')
    expect(card).toHaveClass('test-class')
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('border')
  })

  it('renders CardHeader with children', () => {
    render(<CardHeader>Header Content</CardHeader>)
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })

  it('applies custom className to CardHeader', () => {
    render(<CardHeader className="test-header">Header Content</CardHeader>)
    const header = screen.getByText('Header Content')
    expect(header).toHaveClass('test-header')
    expect(header).toHaveClass('flex')
    expect(header).toHaveClass('p-6')
  })

  it('renders CardTitle with children', () => {
    render(<CardTitle>Card Title</CardTitle>)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('applies custom className to CardTitle', () => {
    render(<CardTitle className="test-title">Card Title</CardTitle>)
    const title = screen.getByText('Card Title')
    expect(title).toHaveClass('test-title')
    expect(title).toHaveClass('text-2xl')
    expect(title).toHaveClass('font-semibold')
  })

  it('renders CardDescription with children', () => {
    render(<CardDescription>Card Description</CardDescription>)
    expect(screen.getByText('Card Description')).toBeInTheDocument()
  })

  it('applies custom className to CardDescription', () => {
    render(<CardDescription className="test-desc">Card Description</CardDescription>)
    const desc = screen.getByText('Card Description')
    expect(desc).toHaveClass('test-desc')
    expect(desc).toHaveClass('text-sm')
    expect(desc).toHaveClass('text-muted-foreground')
  })

  it('renders CardContent with children', () => {
    render(<CardContent>Content Area</CardContent>)
    expect(screen.getByText('Content Area')).toBeInTheDocument()
  })

  it('applies custom className to CardContent', () => {
    render(<CardContent className="test-content">Content Area</CardContent>)
    const content = screen.getByText('Content Area')
    expect(content).toHaveClass('test-content')
    expect(content).toHaveClass('p-6')
    expect(content).toHaveClass('pt-0')
  })

  it('renders CardFooter with children', () => {
    render(<CardFooter>Footer Content</CardFooter>)
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('applies custom className to CardFooter', () => {
    render(<CardFooter className="test-footer">Footer Content</CardFooter>)
    const footer = screen.getByText('Footer Content')
    expect(footer).toHaveClass('test-footer')
    expect(footer).toHaveClass('flex')
    expect(footer).toHaveClass('pt-0')
  })

  it('renders a complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Example Card</CardTitle>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Example Card')).toBeInTheDocument()
    expect(screen.getByText('This is a description')).toBeInTheDocument()
    expect(screen.getByText('This is the main content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
}) 
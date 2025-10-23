import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'This is a test response about wine country.'
            }
          }],
          usage: {
            prompt_tokens: 50,
            completion_tokens: 20,
            total_tokens: 70
          }
        })
      }
    }
  }))
})

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset rate limit store between tests
    jest.resetModules()
  })

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test message' }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('response')
    })

    it('should return 429 when rate limit exceeded', async () => {
      const requests = []

      // Make 11 requests (exceeds limit of 10)
      for (let i = 0; i < 11; i++) {
        const request = new NextRequest('http://localhost:3000/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: `Test message ${i}` }),
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': '127.0.0.2'
          }
        })
        requests.push(POST(request))
      }

      const responses = await Promise.all(requests)
      const lastResponse = responses[responses.length - 1]

      expect(lastResponse.status).toBe(429)
      const data = await lastResponse.json()
      expect(data).toHaveProperty('error')
      expect(data.error).toContain('Rate limit exceeded')
    })
  })

  describe('Input Validation', () => {
    it('should return 400 for missing message', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.3'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Message is required')
    })

    it('should return 400 for non-string message', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 123 }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.4'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Message must be a string')
    })

    it('should return 400 for message too long', async () => {
      const longMessage = 'a'.repeat(501) // Exceeds 500 char limit
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: longMessage }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.5'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toContain('Message too long')
    })

    it('should return 400 for message too short', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'a' }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.6'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Message is too short')
    })
  })

  describe('Successful Requests', () => {
    it('should return a successful response with valid input', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Tell me about Napa Valley wineries' }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.7'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('response')
      expect(typeof data.response).toBe('string')
    })

    it('should include rate limit headers in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test message' }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.8'
        }
      })

      const response = await POST(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })
  })
})

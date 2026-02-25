import { describe, it, expect } from 'vitest'
import { parseDataAmount, parsePrice, parseDuration } from './telesur-scraper'

describe('parseDataAmount', () => {
  it('parses MB values', () => {
    expect(parseDataAmount('150 MB')).toBe(150)
  })

  it('parses GB values and converts to MB', () => {
    expect(parseDataAmount('5 GB')).toBe(5120)
    expect(parseDataAmount('75 GB')).toBe(76800)
  })

  it('handles case insensitivity', () => {
    expect(parseDataAmount('5 gb')).toBe(5120)
    expect(parseDataAmount('150 mb')).toBe(150)
  })

  it('returns 0 for unrecognized input', () => {
    expect(parseDataAmount('')).toBe(0)
    expect(parseDataAmount('unlimited')).toBe(0)
    expect(parseDataAmount('no data')).toBe(0)
  })
})

describe('parsePrice', () => {
  it('parses simple decimal prices', () => {
    expect(parsePrice('SRD 33.00')).toBe(33)
  })

  it('parses comma as decimal separator', () => {
    expect(parsePrice('SRD 565,00')).toBe(565)
  })

  it('parses thousands separator with dot decimal', () => {
    expect(parsePrice('SRD 3,799.00')).toBe(3799)
  })

  it('handles price without currency prefix', () => {
    expect(parsePrice('127.00')).toBe(127)
  })

  it('handles comma as thousands separator without decimal', () => {
    expect(parsePrice('SRD 1,200')).toBe(1200)
  })
})

describe('parseDuration', () => {
  it('converts Dutch plural hours to English', () => {
    expect(parseDuration('12 uren')).toBe('12 hours')
  })

  it('converts Dutch singular hour to English', () => {
    expect(parseDuration('1 uur')).toBe('1 hour')
  })

  it('converts Dutch singular day to English', () => {
    expect(parseDuration('1 dag')).toBe('1 day')
  })

  it('converts Dutch plural days to English', () => {
    expect(parseDuration('3 dagen')).toBe('3 days')
    expect(parseDuration('7 dagen')).toBe('7 days')
    expect(parseDuration('30 dagen')).toBe('30 days')
  })

  it('returns lowercase for unrecognized input', () => {
    expect(parseDuration('30 days')).toBe('30 days')
  })

  it('trims whitespace', () => {
    expect(parseDuration('  12 uren  ')).toBe('12 hours')
    expect(parseDuration('  1 dag  ')).toBe('1 day')
  })
})

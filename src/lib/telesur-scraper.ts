import { load } from 'cheerio'

export type DataPlan = {
  id: number
  duration: string
  data: number // in MB
  price: number
  code: string
  features?: string[]
}

type CacheEntry = {
  data: DataPlan[]
  timestamp: number
}

// In-memory cache
let cache: CacheEntry | null = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Checks if the cache is still valid (less than 24 hours old)
 */
function isCacheValid(): boolean {
  if (!cache) return false
  const now = Date.now()
  return now - cache.timestamp < CACHE_DURATION
}

/**
 * Parses data amount string and converts to MB
 * Examples: "150 MB" -> 150, "5 GB" -> 5120, "75 GB" -> 76800
 */
export function parseDataAmount(dataStr: string): number {
  const match = dataStr.match(/(\d+)\s*(MB|GB)/i)
  if (!match) return 0

  const amount = parseInt(match[1])
  const unit = match[2].toUpperCase()

  return unit === 'GB' ? amount * 1024 : amount
}

/**
 * Parses price string and converts to number
 * Handles both comma and dot as decimal separators
 * Examples: "SRD 33.00" -> 33, "SRD 565,00" -> 565, "SRD 3,799.00" -> 3799
 */
export function parsePrice(priceStr: string): number {
  // Remove everything except digits, commas, and dots
  let cleanPrice = priceStr.replace(/[^\d.,]/g, '')

  // Handle European format (565,00) vs American format (565.00)
  // If there's both comma and dot, assume comma is thousands separator
  if (cleanPrice.includes(',') && cleanPrice.includes('.')) {
    cleanPrice = cleanPrice.replace(/,/g, '')
  } else if (cleanPrice.includes(',')) {
    // If only comma, check if it's decimal separator or thousands
    // If it's at the end (like 565,00), it's decimal
    if (cleanPrice.match(/,\d{2}$/)) {
      cleanPrice = cleanPrice.replace(',', '.')
    } else {
      // Otherwise it's thousands separator
      cleanPrice = cleanPrice.replace(/,/g, '')
    }
  }

  return parseFloat(cleanPrice)
}

/**
 * Parses duration string (supports Dutch and English)
 * Examples: "12 uren" -> "12 hours", "1 dag" -> "1 day", "3 dagen" -> "3 days"
 */
export function parseDuration(durationStr: string): string {
  const lower = durationStr.trim().toLowerCase()

  // Convert Dutch to English
  if (lower.includes('uren') || lower.includes('uur')) {
    if (lower.startsWith('1 ')) {
      return lower.replace(/uren|uur/, 'hour').trim()
    }
    return lower.replace(/uren|uur/, 'hours').trim()
  }
  if (lower.includes('dag')) {
    // "1 dag" -> "1 day", "3 dagen" -> "3 days"
    if (lower.startsWith('1 ')) {
      return '1 day'
    }
    return lower.replace('dagen', 'days').replace('dag', 'days').trim()
  }

  return lower
}

/**
 * Scrapes the Telesur prepaid page and extracts data plans
 */
export async function scrapeTelesurPrepaid(): Promise<DataPlan[]> {
  // Check cache first
  if (isCacheValid() && cache) {
    console.log('Returning cached Telesur data')
    return cache.data
  }

  console.log('Fetching fresh Telesur data...')

  try {
    const response = await fetch('https://www.telesur.sr/prepaid/')
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      )
    }

    const html = await response.text()
    const $ = load(html)

    const plans: DataPlan[] = []
    let idCounter = 1

    // The site uses Visual Composer, look for column containers
    // Each pricing plan is in a .vc_col-sm-4 or similar column
    $('.vc_col-sm-4, .vc_col-sm-3, .vc_col-sm-6').each((_, element) => {
      const $card = $(element)
      const fullText = $card.text().trim()

      // Check if this column contains pricing information
      if (
        !fullText.includes('SRD') ||
        !(fullText.includes('GB') || fullText.includes('MB'))
      ) {
        return
      }

      // Parse the text content line by line
      const lines = fullText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

      let durationText = ''
      let priceText = ''
      let dataText = ''
      let codeText = ''

      // Extract information from lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // First line with time unit is usually duration
        if (!durationText && (line.includes('uren') || line.includes('dag'))) {
          durationText = line
        }

        // Line with SRD is price
        if (line.includes('SRD')) {
          priceText = line
        }

        // Line with GB or MB is data amount
        // Only capture the data amount, not activation codes
        if (
          (line.includes('GB') || line.includes('MB')) &&
          !line.toLowerCase().includes('activeringscode')
        ) {
          // Extract just the number and unit
          const dataMatch = line.match(/(\d+)\s*(GB|MB)/i)
          if (dataMatch && !dataText) {
            dataText = dataMatch[0]
          }
        }

        // Line with NET or 'go ' is activation code
        if (line.match(/NET\s+\w+|sms\s+go\s+\d+|\d+GB/i)) {
          codeText = line
        }
      }

      // Skip if we don't have essential information
      if (!priceText || !dataText || !durationText) return

      // Extract activation code
      let code = ''
      const codeMatch = codeText.match(/NET\s+\w+|go\s+\d+|\d+GB/i)
      if (codeMatch) {
        code = codeMatch[0].toUpperCase()
      }

      // Check for special features
      const features: string[] = []
      const lowerText = fullText.toLowerCase()
      if (lowerText.includes('rollover')) {
        features.push('Rollover Pakket')
      }
      if (lowerText.includes('5g')) {
        features.push('5G')
      }

      const plan: DataPlan = {
        id: idCounter++,
        duration: parseDuration(durationText),
        data: parseDataAmount(dataText),
        price: parsePrice(priceText),
        code,
        ...(features.length > 0 && { features }),
      }

      plans.push(plan)
    })

    // If generic scraping didn't work, return hardcoded fallback with updated prices
    // based on the web fetch results we saw
    if (plans.length === 0) {
      console.warn('Scraping failed, using fallback data with current prices')
      const fallbackPlans: DataPlan[] = [
        {
          id: 1,
          duration: '12 hours',
          data: 150, // 150 MB
          price: 33,
          code: 'NET 12',
        },
        {
          id: 2,
          duration: '1 day',
          data: 5120, // 5 GB
          price: 63,
          code: 'NET 1D',
          features: ['Rollover Pakket'],
        },
        {
          id: 3,
          duration: '3 days',
          data: 10240, // 10 GB
          price: 127,
          code: 'NET 3D',
        },
        {
          id: 4,
          duration: '7 days',
          data: 25600, // 25 GB
          price: 317,
          code: 'NET 7D',
          features: ['Rollover Pakket'],
        },
        {
          id: 5,
          duration: '30 days',
          data: 76800, // 75 GB
          price: 953,
          code: 'NET 30D',
          features: ['Rollover Pakket'],
        },
        {
          id: 6,
          duration: '30 days',
          data: 51200, // 50 GB
          price: 3799,
          code: '50GB',
          features: ['5G', 'Rollover Pakket'],
        },
        {
          id: 7,
          duration: '30 days',
          data: 46080, // 45 GB
          price: 565,
          code: 'go 4',
          features: ['Rollover Pakket'],
        },
        {
          id: 8,
          duration: '30 days',
          data: 71680, // 70 GB
          price: 883,
          code: 'go 10',
          features: ['Rollover Pakket'],
        },
        {
          id: 9,
          duration: '30 days',
          data: 97280, // 95 GB
          price: 1199,
          code: 'go 15',
          features: ['Rollover Pakket'],
        },
      ]

      // Cache the fallback data
      cache = {
        data: fallbackPlans,
        timestamp: Date.now(),
      }

      return fallbackPlans
    }

    // Cache the scraped data
    cache = {
      data: plans,
      timestamp: Date.now(),
    }

    return plans
  } catch (error) {
    console.error('Error scraping Telesur prepaid page:', error)

    // If we have cached data, return it even if expired
    if (cache) {
      console.log('Returning expired cached data due to scraping error')
      return cache.data
    }

    // Last resort fallback with current prices
    return [
      {
        id: 1,
        duration: '12 hours',
        data: 150,
        price: 33,
        code: 'NET 12',
      },
      {
        id: 2,
        duration: '1 day',
        data: 5120,
        price: 63,
        code: 'NET 1D',
        features: ['Rollover Pakket'],
      },
      {
        id: 3,
        duration: '3 days',
        data: 10240,
        price: 127,
        code: 'NET 3D',
      },
      {
        id: 4,
        duration: '7 days',
        data: 25600,
        price: 317,
        code: 'NET 7D',
        features: ['Rollover Pakket'],
      },
      {
        id: 5,
        duration: '30 days',
        data: 76800,
        price: 953,
        code: 'NET 30D',
        features: ['Rollover Pakket'],
      },
    ]
  }
}

/**
 * Clears the cache (useful for testing)
 */
export function clearCache(): void {
  cache = null
}

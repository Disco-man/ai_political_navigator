// Mapping of country names to ISO codes for world map
export const COUNTRY_CODE_MAP = {
  'United States': 'USA',
  'United Kingdom': 'GBR',
  'Russia': 'RUS',
  'China': 'CHN',
  'India': 'IND',
  'Germany': 'DEU',
  'France': 'FRA',
  'Japan': 'JPN',
  'Brazil': 'BRA',
  'Canada': 'CAN',
  'Australia': 'AUS',
  'South Korea': 'KOR',
  'Italy': 'ITA',
  'Spain': 'ESP',
  'Mexico': 'MEX',
  'Indonesia': 'IDN',
  'Turkey': 'TUR',
  'Saudi Arabia': 'SAU',
  'Iran': 'IRN',
  'Israel': 'ISR',
  'Egypt': 'EGY',
  'South Africa': 'ZAF',
  'Nigeria': 'NGA',
  'Pakistan': 'PAK',
  'Bangladesh': 'BGD',
  'Ukraine': 'UKR',
  'Poland': 'POL',
  'Argentina': 'ARG',
  'Colombia': 'COL',
  'Venezuela': 'VEN',
  'Chile': 'CHL',
  'Peru': 'PER',
  'Vietnam': 'VNM',
  'Thailand': 'THA',
  'Malaysia': 'MYS',
  'Philippines': 'PHL',
  'Netherlands': 'NLD',
  'Belgium': 'BEL',
  'Sweden': 'SWE',
  'Norway': 'NOR',
  'Finland': 'FIN',
  'Denmark': 'DNK',
  'Switzerland': 'CHE',
  'Austria': 'AUT',
  'Greece': 'GRC',
  'Portugal': 'PRT',
  'Czech Republic': 'CZE',
  'Romania': 'ROU',
  'Hungary': 'HUN',
  'New Zealand': 'NZL',
  'Singapore': 'SGP',
  'Ireland': 'IRL',
}

// Get country ID from name
export const getCountryId = (countryName) => {
  return countryName.toLowerCase().replace(/\s+/g, '_')
}

// Get country code from name
export const getCountryCode = (countryName) => {
  return COUNTRY_CODE_MAP[countryName] || null
}

// Sample countries for quick testing
export const SAMPLE_COUNTRIES = [
  'United States',
  'Russia',
  'China',
  'United Kingdom',
  'France',
  'Germany',
  'India',
  'Japan',
  'Brazil',
  'Ukraine',
  'Israel',
  'Iran',
  'Saudi Arabia',
  'Turkey',
  'South Korea',
]

/**
 * Country groups (EU, NATO, etc.) for event "Related Countries".
 * Only countries that exist in the app can be linked; others are shown but not clickable.
 */

export const COUNTRY_GROUPS = {
  'European Union': [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
    'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden'
  ],
  'European Union countries': [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
    'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden'
  ],
  'NATO': [
    'Albania', 'Belgium', 'Bulgaria', 'Canada', 'Croatia', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Iceland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Montenegro',
    'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania',
    'Slovakia', 'Slovenia', 'Spain', 'Turkey', 'United Kingdom',
    'United States of America'
  ],
  'NATO countries': [
    'Albania', 'Belgium', 'Bulgaria', 'Canada', 'Croatia', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Iceland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Montenegro',
    'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania',
    'Slovakia', 'Slovenia', 'Spain', 'Turkey', 'United Kingdom',
    'United States of America'
  ]
}

/** Check if a string is a known group key (case-insensitive match) */
export function getGroupKey(relatedName) {
  const lower = (relatedName || '').toLowerCase()
  for (const key of Object.keys(COUNTRY_GROUPS)) {
    if (key.toLowerCase() === lower) return key
  }
  return null
}

export function getGroupMembers(groupKey) {
  return COUNTRY_GROUPS[groupKey] || []
}

/**
 * Quiz questions based on app data (countries, events, figures).
 * 3 levels, 5 questions per level.
 */
export const QUIZ_LEVELS = [
  { id: 1, name: 'Level 1', description: 'Basics' },
  { id: 2, name: 'Level 2', description: 'Intermediate' },
  { id: 3, name: 'Level 3', description: 'Expert' }
]

export const QUIZ_QUESTIONS = [
  // Level 1
  {
    id: 'q1',
    level: 1,
    question: 'What is the capital of France?',
    options: ['Lyon', 'Paris', 'Marseille', 'Berlin'],
    correctIndex: 1
  },
  {
    id: 'q2',
    level: 1,
    question: 'What is the capital of Japan?',
    options: ['Osaka', 'Kyoto', 'Tokyo', 'Seoul'],
    correctIndex: 2
  },
  {
    id: 'q3',
    level: 1,
    question: 'Who is the President of Russia?',
    options: ['Dmitry Medvedev', 'Vladimir Putin', 'Sergei Lavrov', 'Mikhail Gorbachev'],
    correctIndex: 1
  },
  {
    id: 'q4',
    level: 1,
    question: 'In which year did the United Kingdom leave the European Union?',
    options: ['2019', '2020', '2021', '2016'],
    correctIndex: 1
  },
  {
    id: 'q5',
    level: 1,
    question: 'What is the capital of Kazakhstan?',
    options: ['Almaty', 'Astana', 'Bishkek', 'Tashkent'],
    correctIndex: 1
  },
  // Level 2
  {
    id: 'q6',
    level: 2,
    question: 'Which country held a historic 2024 presidential election with Trump and Harris as main candidates?',
    options: ['United Kingdom', 'Canada', 'United States of America', 'Australia'],
    correctIndex: 2
  },
  {
    id: 'q7',
    level: 2,
    question: 'What is the capital of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctIndex: 2
  },
  {
    id: 'q8',
    level: 2,
    question: 'Who was the German Chancellor from 2005 to 2021?',
    options: ['Olaf Scholz', 'Gerhard Schröder', 'Angela Merkel', 'Helmut Kohl'],
    correctIndex: 2
  },
  {
    id: 'q9',
    level: 2,
    question: 'In which year did the full-scale Russian invasion of Ukraine begin?',
    options: ['2021', '2022', '2023', '2014'],
    correctIndex: 1
  },
  {
    id: 'q10',
    level: 2,
    question: 'Which country signed normalization agreements with Israel in the Abraham Accords (2020)?',
    options: ['Saudi Arabia', 'Egypt', 'United Arab Emirates', 'Jordan'],
    correctIndex: 2
  },
  // Level 3
  {
    id: 'q11',
    level: 3,
    question: 'Which country implemented the Zero-COVID policy that ended in December 2022?',
    options: ['South Korea', 'Japan', 'China', 'Vietnam'],
    correctIndex: 2
  },
  {
    id: 'q12',
    level: 3,
    question: 'Who became President of Brazil after defeating Bolsonaro in the 2022 election?',
    options: ['Dilma Rousseff', 'Fernando Haddad', 'Luiz Inácio Lula da Silva', 'Marina Silva'],
    correctIndex: 2
  },
  {
    id: 'q13',
    level: 3,
    question: 'In which year did the January 6 Capitol riot occur in the United States?',
    options: ['2020', '2021', '2022', '2019'],
    correctIndex: 1
  },
  {
    id: 'q14',
    level: 3,
    question: 'What is the capital of Turkey?',
    options: ['Istanbul', 'Izmir', 'Ankara', 'Antalya'],
    correctIndex: 2
  },
  {
    id: 'q15',
    level: 3,
    question: 'Which country hosted the 2020 Summer Olympics (held in 2021)?',
    options: ['China', 'South Korea', 'Japan', 'Australia'],
    correctIndex: 2
  }
]

export const XP_PER_QUESTION = 10
/** Bonus XP for answering the AI-generated extra question correctly */
export const XP_EXTRA_QUESTION = 15
export const RANKS = [
  { id: 'intern', name: 'Intern', minXp: 0, maxXp: 49 },
  { id: 'attache', name: 'Attaché', minXp: 50, maxXp: 149 },
  { id: 'ambassador', name: 'Ambassador', minXp: 150, maxXp: Infinity }
]

export function getRankForXp(xp) {
  return RANKS.find(r => xp >= r.minXp && xp <= r.maxXp) || RANKS[0]
}

export function getQuestionsForLevel(level) {
  return QUIZ_QUESTIONS.filter(q => q.level === level)
}

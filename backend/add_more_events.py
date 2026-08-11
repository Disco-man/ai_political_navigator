import json

# Load current data
with open('political_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# More events for remaining countries
more_events = {
    "germany": [
        {
          "id": "germany_migration_crisis",
          "title": "European Migration Crisis",
          "date": "2015-09-04",
          "category": "social",
          "description": "Germany accepts over 1 million refugees, Merkel's 'Wir schaffen das' policy reshapes European politics.",
          "severity": "high",
          "related_countries": ["Syria", "Turkey"],
          "related_figures": ["Angela Merkel"]
        },
        {
          "id": "germany_coalition_2021",
          "title": "Traffic Light Coalition Formation",
          "date": "2021-12-08",
          "category": "domestic_policy",
          "description": "SPD, Greens, and FDP form first-ever three-way coalition government, ending Merkel era.",
          "severity": "high",
          "related_countries": [],
          "related_figures": []
        },
        {
          "id": "germany_nord_stream",
          "title": "Nord Stream 2 Suspension",
          "date": "2022-02-22",
          "category": "foreign_policy",
          "description": "Germany halts Nord Stream 2 pipeline certification after Russian invasion of Ukraine, major policy shift.",
          "severity": "high",
          "related_countries": ["Russia", "Ukraine"],
          "related_figures": []
        }
    ],
    "france": [
        {
          "id": "france_paris_attacks",
          "title": "Paris Terror Attacks",
          "date": "2015-11-13",
          "category": "military",
          "description": "Coordinated ISIS terror attacks kill 130 people, leading to state of emergency and security reforms.",
          "severity": "high",
          "related_countries": [],
          "related_figures": []
        },
        {
          "id": "france_yellow_vests",
          "title": "Yellow Vests Movement",
          "date": "2018-11-17",
          "category": "social",
          "description": "Mass protests against fuel taxes evolve into broader anti-government movement lasting months.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Emmanuel Macron"]
        },
        {
          "id": "france_macron_reelection",
          "title": "Macron Re-election 2022",
          "date": "2022-04-24",
          "category": "domestic_policy",
          "description": "Emmanuel Macron defeats Marine Le Pen to become first French president re-elected in 20 years.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": ["Emmanuel Macron"]
        }
    ],
    "ukraine": [
        {
          "id": "ukraine_euromaidan",
          "title": "Euromaidan Revolution",
          "date": "2014-02-22",
          "category": "domestic_policy",
          "description": "Pro-European protests lead to ouster of President Yanukovych, triggering crisis with Russia.",
          "severity": "high",
          "related_countries": ["Russia"],
          "related_figures": []
        },
        {
          "id": "ukraine_crimea_annexation",
          "title": "Crimea Annexation",
          "date": "2014-03-18",
          "category": "military",
          "description": "Russia annexes Crimea following controversial referendum, beginning conflict in eastern Ukraine.",
          "severity": "high",
          "related_countries": ["Russia"],
          "related_figures": []
        },
        {
          "id": "ukraine_zelenskyy_election",
          "title": "Zelenskyy Election Victory",
          "date": "2019-04-21",
          "category": "domestic_policy",
          "description": "Comedian Volodymyr Zelenskyy wins landslide presidential victory, promising anti-corruption reforms.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": ["Volodymyr Zelenskyy"]
        }
    ],
    "australia": [
        {
          "id": "australia_bushfires",
          "title": "Black Summer Bushfires",
          "date": "2019-12-01",
          "category": "social",
          "description": "Catastrophic bushfire season burns 18 million hectares, killing billions of animals and highlighting climate crisis.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Scott Morrison"]
        },
        {
          "id": "australia_aukus",
          "title": "AUKUS Security Pact",
          "date": "2021-09-15",
          "category": "foreign_policy",
          "description": "Australia, UK, US form trilateral security partnership for Indo-Pacific, includes nuclear submarine deal.",
          "severity": "high",
          "related_countries": ["United States", "United Kingdom", "China"],
          "related_figures": []
        },
        {
          "id": "australia_labor_victory",
          "title": "Labor Party Electoral Victory",
          "date": "2022-05-21",
          "category": "domestic_policy",
          "description": "Anthony Albanese leads Labor to victory, ending 9 years of conservative government.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": []
        }
    ],
    "united_kingdom": [
        {
          "id": "uk_brexit_referendum",
          "title": "Brexit Referendum Vote",
          "date": "2016-06-23",
          "category": "foreign_policy",
          "description": "UK votes 52% to 48% to leave European Union in historic referendum.",
          "severity": "high",
          "related_countries": [],
          "related_figures": []
        },
        {
          "id": "uk_covid_lockdown",
          "title": "First COVID-19 Lockdown",
          "date": "2020-03-23",
          "category": "domestic_policy",
          "description": "UK implements first national lockdown in response to COVID-19 pandemic.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Boris Johnson"]
        }
    ],
    "united_states_of_america": [
        {
          "id": "us_trump_election",
          "title": "Donald Trump Election",
          "date": "2016-11-08",
          "category": "domestic_policy",
          "description": "Donald Trump wins surprising presidential victory, defeating Hillary Clinton.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Donald Trump"]
        },
        {
          "id": "us_capitol_riot",
          "title": "January 6 Capitol Riot",
          "date": "2021-01-06",
          "category": "domestic_policy",
          "description": "Supporters of Trump storm US Capitol attempting to overturn election results.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Donald Trump"]
        }
    ],
    "russia": [
        {
          "id": "russia_crimea_2014",
          "title": "Crimea Annexation 2014",
          "date": "2014-03-18",
          "category": "military",
          "description": "Russia annexes Crimea from Ukraine following revolution in Kyiv.",
          "severity": "high",
          "related_countries": ["Ukraine"],
          "related_figures": ["Vladimir Putin"]
        },
        {
          "id": "russia_navalny",
          "title": "Navalny Poisoning and Imprisonment",
          "date": "2020-08-20",
          "category": "domestic_policy",
          "description": "Opposition leader Alexei Navalny poisoned, later imprisoned upon return to Russia.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Vladimir Putin"]
        }
    ],
    "china": [
        {
          "id": "china_hong_kong_law",
          "title": "Hong Kong National Security Law",
          "date": "2020-06-30",
          "category": "domestic_policy",
          "description": "China implements security law in Hong Kong, effectively ending 'one country, two systems'.",
          "severity": "high",
          "related_countries": ["Hong Kong"],
          "related_figures": ["Xi Jinping"]
        }
    ]
}

# Add events to countries
for country in data['countries']:
    country_id = country['id']
    if country_id in more_events:
        country['current_events'].extend(more_events[country_id])
        print(f"[OK] Added {len(more_events[country_id])} events to {country['name']}")

# Save updated data
with open('political_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n[OK] All additional events added!")
total_events = sum(len(c['current_events']) for c in data['countries'])
print(f"Total events across all countries: {total_events}")

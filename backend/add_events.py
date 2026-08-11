import json

# Load current data
with open('political_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Additional events to add
additional_events = {
    "israel": [
        {
          "id": "israel_abraham_accords",
          "title": "Abraham Accords Normalization",
          "date": "2020-09-15",
          "category": "foreign_policy",
          "description": "Israel signs historic normalization agreements with UAE and Bahrain, transforming Middle East diplomacy.",
          "severity": "high",
          "related_countries": ["United Arab Emirates", "Bahrain", "United States"],
          "related_figures": ["Benjamin Netanyahu"]
        },
        {
          "id": "israel_gaza_conflict_2021",
          "title": "Gaza Conflict 2021",
          "date": "2021-05-10",
          "category": "military",
          "description": "11-day conflict between Israel and Hamas results in hundreds of casualties and international mediation efforts.",
          "severity": "high",
          "related_countries": ["Palestine"],
          "related_figures": []
        },
        {
          "id": "israel_netanyahu_trial",
          "title": "Netanyahu Corruption Trial",
          "date": "2020-05-24",
          "category": "domestic_policy",
          "description": "Prime Minister Netanyahu goes on trial for corruption charges while still in office, unprecedented in Israeli history.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Benjamin Netanyahu"]
        }
    ],
    "iran": [
        {
          "id": "iran_nuclear_deal",
          "title": "JCPOA Nuclear Agreement",
          "date": "2015-07-14",
          "category": "foreign_policy",
          "description": "Iran signs historic nuclear deal with world powers, agreeing to limit nuclear program in exchange for sanctions relief.",
          "severity": "high",
          "related_countries": ["United States", "Russia", "China", "France", "United Kingdom", "Germany"],
          "related_figures": []
        },
        {
          "id": "iran_us_withdrawal",
          "title": "US Withdraws from Nuclear Deal",
          "date": "2018-05-08",
          "category": "foreign_policy",
          "description": "Trump administration withdraws from JCPOA and reimplements sanctions, escalating tensions with Iran.",
          "severity": "high",
          "related_countries": ["United States"],
          "related_figures": []
        },
        {
          "id": "iran_soleimani_killing",
          "title": "Assassination of Qasem Soleimani",
          "date": "2020-01-03",
          "category": "military",
          "description": "US drone strike kills Iranian General Qasem Soleimani in Iraq, bringing US and Iran to brink of war.",
          "severity": "high",
          "related_countries": ["United States", "Iraq"],
          "related_figures": []
        }
    ],
    "turkey": [
        {
          "id": "turkey_coup_attempt",
          "title": "2016 Coup Attempt",
          "date": "2016-07-15",
          "category": "military",
          "description": "Failed military coup attempt leads to widespread purges and state of emergency declaration.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Recep Tayyip Erdogan"]
        },
        {
          "id": "turkey_syria_operations",
          "title": "Syrian Military Operations",
          "date": "2019-10-09",
          "category": "military",
          "description": "Turkey launches military operations in northern Syria against Kurdish forces.",
          "severity": "high",
          "related_countries": ["Syria", "United States"],
          "related_figures": ["Recep Tayyip Erdogan"]
        },
        {
          "id": "turkey_erdogan_reelection",
          "title": "Erdogan Re-election 2023",
          "date": "2023-05-28",
          "category": "domestic_policy",
          "description": "President Erdogan wins runoff election extending his rule despite economic challenges and opposition unity.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Recep Tayyip Erdogan"]
        }
    ],
    "south_korea": [
        {
          "id": "sk_impeachment_2017",
          "title": "Park Geun-hye Impeachment",
          "date": "2017-03-10",
          "category": "domestic_policy",
          "description": "President Park Geun-hye impeached and removed from office in corruption scandal.",
          "severity": "high",
          "related_countries": [],
          "related_figures": []
        },
        {
          "id": "sk_north_summit",
          "title": "Inter-Korean Summit 2018",
          "date": "2018-04-27",
          "category": "foreign_policy",
          "description": "Historic summit between North and South Korean leaders raises hopes for peace on peninsula.",
          "severity": "high",
          "related_countries": ["North Korea", "United States"],
          "related_figures": ["Moon Jae-in"]
        },
        {
          "id": "sk_covid_response",
          "title": "COVID-19 Response Success",
          "date": "2020-03-15",
          "category": "domestic_policy",
          "description": "South Korea's effective pandemic response through testing and contact tracing becomes global model.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": []
        }
    ],
    "canada": [
        {
          "id": "canada_legalization",
          "title": "Cannabis Legalization",
          "date": "2018-10-17",
          "category": "domestic_policy",
          "description": "Canada becomes second country to legalize recreational cannabis nationwide.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": ["Justin Trudeau"]
        },
        {
          "id": "canada_truckers_protest",
          "title": "Freedom Convoy Protests",
          "date": "2022-01-29",
          "category": "domestic_policy",
          "description": "Trucker protests against COVID mandates paralyze Ottawa, leading to emergency measures.",
          "severity": "high",
          "related_countries": [],
          "related_figures": ["Justin Trudeau"]
        },
        {
          "id": "canada_election_2021",
          "title": "Federal Election 2021",
          "date": "2021-09-20",
          "category": "domestic_policy",
          "description": "Trudeau's Liberals win minority government in snap election amid pandemic.",
          "severity": "medium",
          "related_countries": [],
          "related_figures": ["Justin Trudeau"]
        }
    ]
}

# Add events to countries
for country in data['countries']:
    country_id = country['id']
    if country_id in additional_events:
        # Add new events to existing ones
        country['current_events'].extend(additional_events[country_id])
        print(f"[OK] Added {len(additional_events[country_id])} events to {country['name']}")

# Save updated data
with open('political_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n[OK] All events added successfully!")
print(f"Total countries: {len(data['countries'])}")

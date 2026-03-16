# Africa Tourism Intelligence Platform — PRD
> **Africa-First • Budget-Aware • AI-Assisted • Community-Driven • Mobile-First**

---

## PART 1: PRODUCT REQUIREMENTS (PRD)

### 1. Problem

Despite Africa's vast cultural diversity, natural beauty, and unique travel experiences, intra-African tourism remains significantly underdeveloped.

**Many Africans prefer traveling outside the continent due to:**
- Limited awareness of African destinations
- Lack of centralized, trusted travel information
- Perception that African travel is expensive, unsafe, or complex

**Existing global travel platforms:**
- Are designed primarily for non-African travelers
- Do not optimize for African budgets, visa realities, or regional transport
- Overlook local insights, informal travel patterns, and community knowledge

Practical travel intelligence (visa rules, safety tips, real costs, cultural norms) is fragmented across blogs, social media, and outdated websites.

**Impact:**
- Africans miss opportunities to explore their own continent
- Local tourism economies lose potential growth
- Cultural exchange within Africa remains limited

**Need:**
A single, Africa-first travel intelligence platform that helps Africans discover, plan, and share affordable, authentic travel experiences within Africa — built around real constraints, not idealized tourism.

---

### 2. Solution (What We'll Build)

The **Africa Tourism Intelligence Platform** is a smart travel companion designed specifically for Africans.

It will provide:

- **Interactive AI Planner (Concierge):** Interviews the user (preferences, budget, vibe) and generates a tailored itinerary using LLMs (Gemini/GPT)
- **Community Package Marketplace:** Users publish trip paths as public "Packages" that others can view, rate, and replicate
- **Streamer Tracks:** Dedicated section for famous routes (starting with "IShowSpeed Tour") — fans walk in the footsteps of their favorite creators
- **Destination Showcase:** African destinations with local context, cultural depth, and practical guidance
- **Budget-Conscious Planning:** Personalized trips with clear, actionable travel intelligence (visa, safety, customs, costs)

The platform focuses on **accessibility, affordability, and authenticity**, encouraging Africans to explore Africa.

---

### 3. Goals & Success Metrics (V1)

#### Adoption
| Metric | Target |
|--------|--------|
| Registered users within 2 months | ≥ 5,000 |
| Users creating at least one itinerary | ≥ 30% |

#### Engagement
| Metric | Target |
|--------|--------|
| Sessions exploring 3+ destinations | ≥ 40% |
| Active users interacting with community content | ≥ 25% |

#### Planning Effectiveness
| Metric | Target |
|--------|--------|
| Itinerary creation flows completed | ≥ 60% |
| Average itinerary generation time | ≤ 4 seconds |

#### Content Trust
| Metric | Target |
|--------|--------|
| Destination pages with source + "last updated" | ≥ 90% |

---

### 4. Core Principles

| Principle | Description |
|-----------|-------------|
| **Africa-First** | Built for Africans, not adapted from global platforms |
| **Budget-Aware by Default** | Always surface affordable and realistic options |
| **Practical over Aspirational** | Clear guidance beats glossy marketing |
| **Community-Led** | Real traveler insights matter more than ads |
| **Transparent** | Clearly label estimates, uncertainty, and data freshness |

---

### 5. In-Scope vs Out-of-Scope (V1)

#### ✅ In-Scope
- African destination discovery (countries, cities, regions)
- Budget-friendly travel insights (cost ranges, low-cost stays, transport modes)
- Interactive AI Wizard: Questionnaire-based planning (Budget, Duration, Vibe)
- AI-assisted itinerary planning
- LLM Integration: Direct API calls to Gemini/OpenAI for itinerary logic
- Travel guides: visa requirements, local customs & etiquette, safety considerations
- Adventure activity discovery (safari, hiking, cultural immersion)
- Celebrity Paths: Hard-coded "IShowSpeed" and other influencer routes
- User-Generated Packages: Public profile for trip creators; ability to publish itineraries
- Community experience sharing (posts, tips, photos)
- Ranking System: Sorting packages by Rating (Stars) and Popularity (View count)
- Package-specific chat rooms/discussion threads
- Multi-country tour support
- Climate-based filtering

#### ❌ Out-of-Scope
- Direct booking or payments
- Flight/hotel ticketing
- Visa application processing
- Travel insurance or financial products
- Influencer monetization tools

---

### 6. Key Features (V1)

#### Discovery

**Destination Showcase**
Curated African destinations with:
- Cultural and historical context
- Highlights & unique experiences
- Best time to visit
- Estimated daily budget (low / medium / high)
- Tags: "Good for students", "Family-friendly", "Adventure-heavy"

**The AI Planning Concierge**

*The Interview:* Upon clicking "Plan a Trip," the user is guided through a conversational UI:

| Step | Question | Input Type |
|------|----------|------------|
| Q1 | "Where to?" | Specific Country/City or "Surprise Me" |
| Q2 | "How long?" | Duration in days |
| Q3 | "What's the budget?" | Low/Student, Medium, Luxury |
| Q4 | "What is your vibe?" | Tags: Adventure, Relaxed, Foodie, History, Party |
| Q5 | "What's your preferred climate?" | Tropical, Desert, Coastal, Highland |

*The Output:* The app calls the AI API (Gemini/GPT) to generate a structured Day-by-Day plan matching exact constraints.

**Budget-Friendly Options**
Cost indicators for:
- Accommodation
- Local transport
- Food & activities
- Clear labeling of estimates vs confirmed costs

---

#### Planning

**Custom Itineraries**
AI-assisted itinerary generator:
- **Inputs:** budget, duration, interests, travel style
- **Outputs:** day-by-day plan with estimated costs
- Editable itineraries (add/remove/reorder days)
- Save and reuse itineraries

**Guides & Resources**
- Visa requirements by nationality (clearly sourced)
- Safety notes & cultural etiquette
- Currency, payment methods, and local transport tips

---

#### Adventure

**Adventure Planning**
Discover and explore:
- Safari and wildlife tours
- Mountain hiking & nature trips
- Cultural immersion experiences

**Streamer Packages**
- Map overlay showing the streamer's stops
- Embedded clips/links to stream moments at those locations
- "Vibe Check" tags (e.g., "High Energy," "Crowded," "Viral Spots")
- Filter by activity type and difficulty level

---

#### Community

**Experience Sharing**
- Users share trips, tips, photos, and recommendations
- Destination-specific discussions
- Save and upvote helpful content
- Clear moderation and reporting rules

**Community Packages (User Paths)**
- **Create & Publish:** Users can take their AI-generated plan (or build one manually), give it a title, and toggle it to "Public"
- **The Marketplace:** Main feed listing all public packages
- **Sorting:** Sort by "Highest Rated" or "Most Popular" (Views)
- **Interaction:** Other users can leave 1–5 star rating and comment on the path
- **Real-Time Interactions:** Each package includes chat rooms/discussion threads

---

### 7. Target Users

**Africans aged 18–45:**
- Young professionals
- University students and recent graduates
- Families seeking regional travel

**African diaspora:**
- Reconnecting with heritage and culture
- Budget-conscious travelers
- Culture and adventure enthusiasts

---

### 8. Early Adopters

- Young African professionals in major cities
- African travel bloggers and creators
- Diaspora communities
- University students and campus travel clubs
- Youth-focused cultural and adventure groups

---

## PART 2: DESIGN PLAN

### 1. Information Architecture

| Section | Description |
|---------|-------------|
| **Home/Feed** | Top Rated Packages, IShowSpeed Feature, Trending Destinations |
| **AI Planner (FAB)** | Central trigger to start the planning interview |
| **Marketplace** | Searchable list of user packages (Sort: Ratings, Views) |
| **My Trips** | Drafts, Saved Packages, Published Paths |

### 2. Core UI Components

**The "Package" Card:**
- Title ("Hidden Gems of Lagos") + Author Username
- Star Rating (4.8/5) + View Count (1.2k views)
- Tags (Foodie, $200 Budget)

**The Streamer Badge:** Special "Verified Streamer Route" icon for IShowSpeed packages

**The Wizard UI:** Sleek, step-by-step form for AI inputs (buttons/sliders, not text fields)

**Other Components:**
- Destination Card: Image, country, budget range, tags
- Budget Meter: Low / Medium / High cost indicator
- Itinerary Timeline: Day-by-day plan with cost estimates
- Travel Info Badge: Visa | Safety | Cost | Updated
- Community Post Card: User, destination, tip, upvotes

### 3. Visual Style

**Colors:** Earthy, warm tones (sand, green, sunset orange) — neutral backgrounds for readability

**Typography:** Clean, modern sans-serif — strong hierarchy for mobile readability

**Imagery:** Real African locations and people — avoid over-polished stock visuals

### 4. Tone
- Inspiring but grounded
- Inclusive and pan-African
- Honest about challenges and constraints
- Community-respectful, no elitism

---

## PART 3: TECHNICAL ARCHITECTURE

### 1. High-Level System Flow

> **Architecture:** Modular Monolith (V1 simplicity, easy future scaling)

```
User Input (Preferences)
    → Prompt Engineering
    → LLM API (Gemini/GPT)
    → JSON Response
    → UI Rendering
    → User Saves/Publishes
    → Community Database
```

**System Flow Layers:**

| Layer | Responsibility |
|-------|---------------|
| **Presentation (Mobile App)** | User inputs, maps, offline local storage |
| **API Gateway / Backend** | Validates requests, manages auth, orchestrates data |
| **Service Layer** | Planner, Community, AI services |
| **Data Layer** | PostgreSQL, Redis, Object Storage |

### 2. Tech Stack (V1)

| Layer | Technology |
|-------|-----------|
| **Mobile** | Flutter (Android priority, offline-friendly) |
| **Web** | Next.js |
| **Backend** | Go (mks) |
| **AI** | Google Gemini Pro / OpenAI GPT-4o-mini |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Storage** | Object Storage (images) |

**AI Constraints:**
- No model training
- Strict prompt constraints (no hallucination)
- Strict JSON Mode enforcement

---

### 3. Data Models

#### Users Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| username | String | Unique display name |
| email | String | User email |
| role | Enum | user, admin, verified_creator |
| avatar_url | String | Profile image URL |

#### Packages (Itineraries) Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| creator_id | UUID | FK → Users |
| title | String | e.g., "IShowSpeed's Chaos Tour" |
| description | Text | Short summary |
| country | String | Target country |
| city | String | Target city (nullable for multi-city) |
| climate_pref | String | Target climate |
| is_multi_country | Boolean | Multi-country trip flag |
| is_public | Boolean | Visible in marketplace |
| is_streamer_verified | Boolean | Verified streamer badge flag |
| streamer_name | String | e.g., IShowSpeed (nullable) |
| total_cost_est | Decimal | Calculated total estimated cost |
| currency | String | e.g., USD, KES |
| view_count | Integer | For "Popular" sorting |
| avg_rating | Decimal | Cached average rating (1.0–5.0) |
| created_via_ai | Boolean | AI-generated vs manual |

#### Itinerary_Items (The Path) Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| package_id | UUID | FK → Packages |
| day_number | Integer | Day number (Day 1, Day 2, etc.) |
| order_index | Integer | Sequence within day |
| location_name | String | e.g., Black Star Gate |
| geo_lat | Float | Latitude |
| geo_long | Float | Longitude |
| activity_type | Enum | food, adventure, culture, party |
| notes | Text | AI-generated tip or user-added note |

#### Reviews Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| package_id | UUID | FK → Packages |
| user_id | UUID | FK → Users |
| rating | Integer | 1–5 Stars |
| comment | Text | User feedback |

#### Chat Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → Users |
| package_id | UUID | FK → Packages |

---

### 4. API Specification (Core Endpoints)

#### A. AI Planning Endpoints

**`POST /api/v1/planner/generate`**

Request Body:
```json
{
  "destination": "Nairobi, Kenya",
  "duration_days": 3,
  "budget_level": "medium",
  "vibe_tags": ["adventure", "nightlife"],
  "group_size": 2
}
```

Logic:
1. Check Redis Cache for identical request
2. If cache miss → build Prompt
3. Call AI API
4. Parse and validate JSON
5. Return structured plan (preview mode)

---

#### B. Marketplace Endpoints

**`GET /api/v1/packages`**

Query Params:
- `sort_by`: rating | views | newest
- `streamer_only`: true
- `country`: Ghana

Response: Paginated list of Package Cards

---

**`POST /api/v1/packages/{id}/publish`**

Action: Toggles `is_public` to `true`. Validates trip has title + at least 3 items.

---

**`POST /api/v1/packages/{id}/rate`**

Request Body:
```json
{
  "rating": 5,
  "comment": "Loved the path!"
}
```

Logic: Updates Reviews table AND recalculates `avg_rating` on Packages table (async job).

---

### 5. AI Orchestration Logic (The "Brain")

**Prompt Structure:**
```
Role: You are an expert African travel guide.
Context: Create a structured itinerary for a user.
Input Data:
  - City: {User_City}
  - Budget: {User_Budget} (Be realistic with prices in {User_City})
  - Vibe: {User_Tags}

Constraint 1: Output MUST be valid JSON.
Constraint 2: Do not invent hotels. Use real, well-known landmarks.
Constraint 3: Include an estimated price for each activity in USD.

JSON Schema:
{
  "title": "String",
  "currency": "USD",
  "days": [
    {
      "day_num": 1,
      "activities": [
        {
          "name": "Place Name",
          "type": "food/adventure",
          "description": "Short tip",
          "est_cost": 20
        }
      ]
    }
  ]
}
```

**Validation Layer (Before saving to DB):**
1. JSON Syntax Check: Is it valid JSON?
2. Hallucination Check (V1.5): Cross-reference "Place Name" with Google Places API — flag or remove non-existent locations

---

## PART 4: EXECUTION PLAN

### Team (18–20)
- Backend: 9
- Web: 5
- Mobile: 5

### Timeline (6 Weeks + 2 Buffer)

| Week | Focus | Deliverable |
|------|-------|-------------|
| Week 1 | Foundations | Browse destinations, static guides |
| Week 2 | Discovery & Guides | End-to-end discovery flow |
| Week 3 | Itinerary Planning | Generate and save itineraries |
| Week 4 | Community | Share and browse experiences |
| Week 5 | Polish & Optimization | Performance, offline, freshness badges |
| Week 6 | Demo & Hardening | Bug fixes, demo scripts, monitoring |
| +2 Weeks | Buffer | Contingency |

---

## PART 5: RISK REGISTER

| ID | Risk | Impact | Likelihood | Mitigation |
|----|------|--------|------------|------------|
| R1 | Inaccurate cost estimates | High | Medium | Use ranges + disclaimers |
| R2 | Visa info complexity | High | Medium | Passport-specific labels |
| R3 | AI hallucinations | High | Low | Strict prompts + field-only inputs |
| R4 | Community spam | Medium | Medium | Moderation & reporting |
| R5 | Offline UX weak | Medium | Medium | Cache guides & trips |
| R6 | Content staleness | Medium | Medium | "Last updated" badges |

---

## PART 6: TEST PLAN

### Functional
- Destination discovery works
- Itinerary generation returns valid plans
- Guides display correct sources
- Community posts render correctly
- Save & offline access works

### Edge Cases
- Missing visa info → clear message
- Empty community → prompt first post
- Low connectivity → cached content
- Partial itinerary inputs

### Performance
| Test | Target |
|------|--------|
| Destination load | ≤ 2.5s |
| Itinerary generation | ≤ 4s |
| Scrolling (low-RAM devices) | Smooth |

### Localization
- Currency display by country
- Regional date formats
- Expandable language support

---

## PART 7: HAND-OFF NOTES FOR JUNIOR ENGINEERS

> ⚠️ **Critical Rules:**

- Do **NOT** build booking flows in V1
- Treat **all costs as estimates**
- **Always show** data source and freshness
- **Cache aggressively**
- AI summarizes only **provided data**

> ✅ **Priority Flow:**
> **Discover → Plan → Share**

Build for **clarity and trust**, not feature count.
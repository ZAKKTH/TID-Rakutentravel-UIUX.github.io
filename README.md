# Rakuten Travel AI - Kaizen改善 Edition

A semantic hotel search interface designed around the **One-shot Semantic Query UX** philosophy from `kaizen.md`.

## Kaizen Philosophy: One-Shot Semantic Query

This application eliminates inefficiencies of traditional multi-turn conversation AI:

### Core Principles

1. **One-Shot Input** - Express complete travel criteria in a single natural language query
   - Example: "三島駅 5km以内 朝食付き ダブルベッド"
   - No back-and-forth clarification needed

2. **Semantic Understanding** - AI instantly parses natural language into structured criteria
   - Recognizes locations, amenities, budget, dates, room types
   - Visual "Criteria Parser" shows the AI's interpretation

3. **Instant Results** - Hotel recommendations appear immediately after submission
   - Card-based layout for quick visual scanning
   - Booking actions readily accessible

4. **Minimal Questioning** - Only essential missing information is requested
   - "Essential Questions" component provides simple choice buttons
   - Eliminates cognitive load and form friction

## Technical Stack

- **Next.js 16** with App Router & TypeScript
- **Tailwind CSS v4** with semantic design tokens
- **Lucide React** for icons
- **Mock Hotel Data** (ready for real API integration)

## Component Architecture

```
components/
├── search-input.tsx        # One-shot query input with examples
├── criteria-parser.tsx     # Shows AI's semantic understanding
├── essential-questions.tsx # Minimal follow-up questions
├── hotel-card.tsx          # Individual hotel card
├── hotel-grid.tsx          # Responsive result grid
└── ui/
    ├── button.tsx
    └── card.tsx
```

## Rakuten Brand Colors

- **Primary**: Crimson Red `#b71c1c`
- **Background**: White `#ffffff`
- **Text**: Dark Gray `#1f2937`
- **Secondary**: Light Gray `#f3f4f6`

## Example Queries

- "三島駅 5km以内 朝食付き ダブルベッド"
- "駅前の格安ホテル WiFi完備"
- "温泉スパ完備 贅沢な環境"
- "今週末 お手頃価格 3つ星以上"

## Getting Started

```bash
pnpm dev
```

Visit `http://localhost:3001`

## TID-Rakutentravel-UIUX.github.io

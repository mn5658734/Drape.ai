# Drape.ai UI/UX Flow

## Clickable Prototype Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   SPLASH    │────▶│    LOGIN    │────▶│  PROFILE SETUP  │────▶│ WARDROBE ONBOARD │
│  (2.5 sec)  │     │ Phone + OTP │     │ Name, Style,    │     │ Upload clothes    │
└─────────────┘     └─────────────┘     │ Skin tone       │     └────────┬───────────┘
                                        └─────────────────┘              │
                                                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MAIN (Tab Navigator)                                   │
├──────────────┬──────────────┬──────────────┬──────────────┐
│   DASHBOARD  │   WARDROBE   │   DECLUTTER  │   PROFILE    │
│   (Home)     │   (My items) │   (Donate)   │   (Settings) │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘
       │              │              │              │
       │              │              │              └── Edit profile, Payments (coming soon)
       │              │              │
       │              │              └── Select NGO → Schedule Pickup → Success
       │              │
       │              └── Add clothes, View grid of items
       │
       ├── "I'm Getting Late!" ──▶ RUSH MODE (instant outfit)
       │
       ├── Occasion selector (Office, Party, Dating, etc.)
       │
       └── "Get outfit suggestions" ──▶ OUTFIT SWIPE
                                         Like / Skip / Save
```

---

## Screen-by-Screen

| Screen | Key Actions | Navigation |
|--------|-------------|------------|
| **Splash** | Auto-navigate after 2.5s, or tap Skip | → Login |
| **Login** | Enter phone → Send OTP → Verify | → Profile Setup |
| **Profile Setup** | Name, Gender, Style, Skin tone | → Wardrobe Onboarding |
| **Wardrobe Onboarding** | Add clothes (mock), Done | → Main (Dashboard) |
| **Dashboard** | Rush Mode, Occasion, Get Suggestions | → RushMode, OutfitSwipe |
| **Outfit Swipe** | Like, Skip, Save | ← Back to Dashboard |
| **Rush Mode** | View AI outfit, Got it | ← Back to Dashboard |
| **Wardrobe** | Add clothes, View items | — |
| **Donate** | Select NGO, Schedule | Success state |
| **Profile** | Edit, Preferences, Payments | — |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f0f23` | Main background |
| Card | `#1a1a2e` | Cards, inputs |
| Accent | `#e94560` | Primary CTA, active states |
| Muted | `#8892b0` | Secondary text |
| Border | `#16213e` | Borders, dividers |

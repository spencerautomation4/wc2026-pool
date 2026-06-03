// ─── POOL TIERS CONFIG ────────────────────────────────────────────────────────
// Edit this file to update tiers and odds before the tournament.
// Tiers go from 1 (favorites) to 12 (longest shots).
// Tiers 9–12 earn double points.
// Each tier must have exactly 4 teams. Team names must match exactly
// how they appear in the group definitions in App.jsx.
//
// Last updated: June 3, 2026 — FanDuel odds via SI.com
// Tiers are sorted strictly by odds. Group conflicts within a tier are
// handled at draw time by the constrained assignment algorithm.

export const DRAFT_TIERS = {
  1:  ["Brazil","England","France","Spain"],
  2:  ["Argentina","Germany","Netherlands","Portugal"],
  3:  ["Belgium","Colombia","Japan","Norway"],
  4:  ["Mexico","Morocco","United States","Uruguay"],
  5:  ["Croatia","Ecuador","Switzerland","Turkey"],
  6:  ["Austria","Canada","Ivory Coast","Senegal"],
  7:  ["Egypt","Paraguay","Scotland","Sweden"],
  8:  ["Bosnia and Herzegovina","Czech Republic","Ghana","South Korea"],
  9:  ["Algeria","DR Congo","Iran","Tunisia"],
  10: ["Australia","Cape Verde","Iraq","Jordan"],
  11: ["New Zealand","Panama","Qatar","Saudi Arabia"],
  12: ["Curaçao","Haiti","South Africa","Uzbekistan"],
};

// Tiers that earn double points (longest shots — drawn last)
export const DOUBLE_PT_TIERS = new Set([9, 10, 11, 12]);

// Draft order: start from favorites (Tier 1) and work down to longest shots (Tier 12)
export const DRAFT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Odds displayed in the team reference table at the bottom of the Draft page
// Source: FanDuel via SI.com, June 3 2026
export const TIER_ODDS = {
  1:  { Brazil: "+850",    England: "+650",   France: "+460",   Spain: "+420"    },
  2:  { Argentina: "+1000", Germany: "+1300", Netherlands: "+1600", Portugal: "+1000" },
  3:  { Belgium: "+2200",  Colombia: "+4000", Japan: "+4500",   Norway: "+3500"  },
  4:  { Mexico: "+6500",   Morocco: "+6000",  "United States": "+6000", Uruguay: "+6000" },
  5:  { Croatia: "+7000",  Ecuador: "+10000", Switzerland: "+6500", Turkey: "+8000" },
  6:  { Austria: "+12500", Canada: "+17500",  "Ivory Coast": "+17500", Senegal: "+12500" },
  7:  { Egypt: "+25000",   Paraguay: "+20000", Scotland: "+30000", Sweden: "+17500" },
  8:  { "Bosnia and Herzegovina": "+40000", "Czech Republic": "+60000", Ghana: "+60000", "South Korea": "+70000" },
  9:  { Algeria: "+250000", "DR Congo": "+250000", Iran: "+100000", Tunisia: "+200000" },
  10: { Australia: "+250000", "Cape Verde": "+250000", Iraq: "+250000", Jordan: "+250000" },
  11: { "New Zealand": "+250000", Panama: "+250000", Qatar: "+250000", "Saudi Arabia": "+250000" },
  12: { "Curaçao": "+250000", Haiti: "+250000", "South Africa": "+250000", Uzbekistan: "+250000" },
};

// ─── POOL TIERS CONFIG ────────────────────────────────────────────────────────
// Edit this file to update tiers and odds before the tournament.
// Tiers go from 1 (favorites) to 12 (longest shots).
// Tiers 9–12 earn double points.
// Each tier must have exactly 4 teams. Team names must match exactly
// how they appear in the group definitions in App.jsx.
//
// Last updated: June 3, 2026 — DraftKings odds (source of truth)
// Tiers sorted strictly by odds. Group conflicts handled at draw time.

export const DRAFT_TIERS = {
  1:  ["Brazil","England","France","Spain"],
  2:  ["Argentina","Germany","Netherlands","Portugal"],
  3:  ["Belgium","Colombia","Morocco","Norway"],
  4:  ["Japan","Switzerland","United States","Uruguay"],
  5:  ["Croatia","Ecuador","Mexico","Turkey"],
  6:  ["Austria","Scotland","Senegal","Sweden"],
  7:  ["Canada","Czech Republic","Ivory Coast","Paraguay"],
  8:  ["Algeria","Egypt","Ghana","South Korea"],
  9:  ["Australia","Bosnia and Herzegovina","Iran","Tunisia"],
  10: ["Cape Verde","DR Congo","Panama","Saudi Arabia"],
  11: ["Iraq","New Zealand","Qatar","South Africa"],
  12: ["Curaçao","Haiti","Jordan","Uzbekistan"],
};

// Tiers that earn double points (longest shots — drawn last)
export const DOUBLE_PT_TIERS = new Set([9, 10, 11, 12]);

// Draft order: start from favorites (Tier 1) and work down to longest shots (Tier 12)
export const DRAFT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Odds displayed in the team reference table at the bottom of the Draft page
// Source: DraftKings, June 3 2026
export const TIER_ODDS = {
  1:  { Brazil: "+850",    England: "+700",   France: "+475",   Spain: "+475"    },
  2:  { Argentina: "+900", Germany: "+1400",  Netherlands: "+2200", Portugal: "+1000" },
  3:  { Belgium: "+3500",  Colombia: "+4000", Morocco: "+5000",  Norway: "+3500"  },
  4:  { Japan: "+6500",    Switzerland: "+6500", "United States": "+6000", Uruguay: "+6500" },
  5:  { Croatia: "+9000",  Ecuador: "+8000",  Mexico: "+8000",  Turkey: "+9000"  },
  6:  { Austria: "+15000", Scotland: "+20000", Senegal: "+9000", Sweden: "+12000" },
  7:  { Canada: "+20000",  "Czech Republic": "+25000", "Ivory Coast": "+25000", Paraguay: "+30000" },
  8:  { Algeria: "+35000", Egypt: "+30000",   Ghana: "+30000",  "South Korea": "+40000" },
  9:  { Australia: "+60000", "Bosnia and Herzegovina": "+50000", Iran: "+70000", Tunisia: "+50000" },
  10: { "Cape Verde": "+100000", "DR Congo": "+100000", Panama: "+100000", "Saudi Arabia": "+100000" },
  11: { Iraq: "+150000",   "New Zealand": "+150000", Qatar: "+150000", "South Africa": "+100000" },
  12: { "Curaçao": "+250000", Haiti: "+250000", Jordan: "+250000", Uzbekistan: "+150000" },
};

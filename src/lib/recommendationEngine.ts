import { BaseHeritageSite } from "@/data/heritageSites";
import { PersonaData, getPersona, loadPersonaAssessment } from "@/lib/personaStorage";

export interface ScoredSite extends BaseHeritageSite {
  matchScore: number;
  matchedPersonaIds: string[];
  isRecommended: boolean;
}

export interface PersonaDefinition {
  id: string;
  name: string;
  icon: string;
  highAffinityCategories: string[];
  mediumAffinityCategories: string[];
}

// ACUX Typology - 8 Cultural Heritage Visitor Personas
export const PERSONA_DEFINITIONS: PersonaDefinition[] = [
  {
    id: "archaeologist",
    name: "Archaeologist",
    icon: "🏛️",
    highAffinityCategories: ["Archaeological Site", "Museum", "Historic District"],
    mediumAffinityCategories: ["Fortress", "Cultural Experience"],
  },
  {
    id: "religious-seeker",
    name: "Religious Seeker",
    icon: "🙏",
    highAffinityCategories: ["Religious Site"],
    mediumAffinityCategories: ["Historic District", "Cultural Experience"],
  },
  {
    id: "art-seeker",
    name: "Art Seeker",
    icon: "🎨",
    highAffinityCategories: ["Museum", "Performing Arts", "Cultural Experience"],
    mediumAffinityCategories: ["Traditional Crafts", "Historic District"],
  },
  {
    id: "naturalist",
    name: "Naturalist",
    icon: "🌿",
    highAffinityCategories: ["Traditional Crafts", "Maritime Heritage"],
    mediumAffinityCategories: ["Cultural Experience", "Food Heritage"],
  },
  {
    id: "gourmand",
    name: "Gourmand",
    icon: "🍷",
    highAffinityCategories: ["Food Heritage", "Cultural Experience"],
    mediumAffinityCategories: ["Traditional Crafts", "Historic District"],
  },
  {
    id: "traditionalist",
    name: "Traditionalist",
    icon: "📜",
    highAffinityCategories: ["Traditional Crafts", "Historic District", "Food Heritage"],
    mediumAffinityCategories: ["Religious Site", "Cultural Experience"],
  },
  {
    id: "viral-seeker",
    name: "Viral Seeker",
    icon: "📸",
    highAffinityCategories: ["Cultural Experience", "Performing Arts"],
    mediumAffinityCategories: ["Fortress", "Historic District", "Maritime Heritage"],
  },
  {
    id: "leisure-seeker",
    name: "Leisure Seeker",
    icon: "🌅",
    highAffinityCategories: ["Maritime Heritage", "Fortress"],
    mediumAffinityCategories: ["Cultural Experience", "Food Heritage"],
  },
];

// Get persona definition by ID
export function getPersonaDefinition(personaId: string): PersonaDefinition | undefined {
  return PERSONA_DEFINITIONS.find((p) => p.id === personaId);
}

// Calculate match score between a site and a single persona
function calculateSinglePersonaScore(site: BaseHeritageSite, personaId: string): number {
  const definition = getPersonaDefinition(personaId);
  if (!definition) return 0;

  let score = 0;

  // Direct persona match from site data (highest weight)
  if (site.personas.includes(personaId)) {
    score += 50;
  }

  // Category affinity scoring
  if (definition.highAffinityCategories.includes(site.category)) {
    score += 35;
  } else if (definition.mediumAffinityCategories.includes(site.category)) {
    score += 20;
  }

  // Rating boost (0-15 points based on 4.0-5.0 rating range)
  const ratingBoost = Math.max(0, (site.rating - 4.0) * 15);
  score += ratingBoost;

  return Math.min(100, Math.round(score));
}

// Calculate match score for a site against user's persona(s)
export function calculateMatchScore(
  site: BaseHeritageSite,
  userPersona: PersonaData | null,
  userPersonaIds: string[] = []
): { score: number; matchedPersonaIds: string[] } {
  const personaIds = userPersonaIds.length > 0 
    ? userPersonaIds 
    : userPersona?.id 
      ? [userPersona.id] 
      : [];

  if (personaIds.length === 0) {
    // No persona - return base score from rating
    return {
      score: Math.round((site.rating / 5) * 100),
      matchedPersonaIds: [],
    };
  }

  const scores = personaIds.map((id) => ({
    id,
    score: calculateSinglePersonaScore(site, id),
  }));

  // Take highest score among user's personas
  const maxScore = Math.max(...scores.map((s) => s.score));
  
  // Collect all personas that contributed to a good score (>50)
  const matchedPersonaIds = scores
    .filter((s) => s.score > 50)
    .map((s) => s.id);

  return {
    score: maxScore,
    matchedPersonaIds,
  };
}

// Get personalized recommendations
export function getPersonaRecommendations(
  sites: BaseHeritageSite[],
  userPersona: PersonaData | null,
  limit?: number
): ScoredSite[] {
  // Get all user persona IDs from assessment if available
  const assessment = loadPersonaAssessment();
  const userPersonaIds = assessment?.topPersonas.map((p) => p.id) || 
    (userPersona?.id ? [userPersona.id] : []);

  const scoredSites: ScoredSite[] = sites.map((site) => {
    const { score, matchedPersonaIds } = calculateMatchScore(site, userPersona, userPersonaIds);
    return {
      ...site,
      matchScore: score,
      matchedPersonaIds,
      isRecommended: score >= 75,
    };
  });

  // Sort by match score descending
  scoredSites.sort((a, b) => b.matchScore - a.matchScore);

  return limit ? scoredSites.slice(0, limit) : scoredSites;
}

// Get count of sites matching each persona
export function getPersonaMatchCounts(sites: BaseHeritageSite[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const persona of PERSONA_DEFINITIONS) {
    counts[persona.id] = sites.filter((site) => 
      site.personas.includes(persona.id) ||
      persona.highAffinityCategories.includes(site.category)
    ).length;
  }

  return counts;
}

// Filter sites by persona IDs
export function filterSitesByPersonas(
  sites: ScoredSite[],
  activePersonaIds: string[]
): ScoredSite[] {
  if (activePersonaIds.length === 0) return sites;

  return sites.filter((site) =>
    activePersonaIds.some(
      (personaId) =>
        site.personas.includes(personaId) ||
        site.matchedPersonaIds.includes(personaId)
    )
  );
}

// Get user's active persona(s)
export function getUserPersonas(): { primary: PersonaData | null; all: PersonaData[] } {
  const primary = getPersona();
  const assessment = loadPersonaAssessment();
  
  return {
    primary,
    all: assessment?.topPersonas || (primary ? [primary] : []),
  };
}

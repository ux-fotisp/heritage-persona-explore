export interface BaseHeritageSite {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  duration: string;
  coordinates: [number, number]; // [lng, lat]
  image: string;
  personas: string[]; // persona ids
  country: string;
  city: string;
}

// Greece-only dataset: 5 destinations x 20 options each = 100 dummy sites
// Destinations: Athens, Thessaloniki, Heraklion, Santorini, Rhodes

const CITIES = [
  { key: "ath", city: "Athens", base: [23.7275, 37.9838] as [number, number] },
  { key: "thes", city: "Thessaloniki", base: [22.9444, 40.6401] as [number, number] },
  { key: "her", city: "Heraklion", base: [25.1442, 35.3387] as [number, number] },
  { key: "san", city: "Santorini", base: [25.4283, 36.3932] as [number, number] },
  { key: "rho", city: "Rhodes", base: [28.2280, 36.4349] as [number, number] },
];

const DURATIONS = ["1-2 hours", "2-3 hours", "3-4 hours"];
const CATEGORIES = [
  "Archaeological Site",
  "Museum",
  "Historic District",
  "Religious Site",
  "Cultural Experience",
  "Traditional Crafts",
  "Performing Arts",
  "Food Heritage",
  "Maritime Heritage",
  "Fortress",
];

const PERSONA_IDS = [
  "archaeologist",
  "traditionalist",
  "art-seeker",
  "religious-seeker",
  "gourmand",
  "naturalist",
  "viral-seeker",
  "leisure-seeker",
];

const IMAGES = [
  "/src/assets/heritage-temple.jpg",
  "/src/assets/heritage-museum.jpg",
  "/src/assets/heritage-castle.jpg",
];

function getImageForCategory(category: string) {
  if (category.includes("Religious")) return IMAGES[0];
  if (category.includes("Museum")) return IMAGES[1];
  if (category.includes("Fortress") || category.includes("Historic")) return IMAGES[2];
  // default rotate
  return IMAGES[0];
}

function personaSet(index: number) {
  // deterministic 2-3 personas based on index
  const a = PERSONA_IDS[index % PERSONA_IDS.length];
  const b = PERSONA_IDS[(index + 3) % PERSONA_IDS.length];
  const c = PERSONA_IDS[(index + 5) % PERSONA_IDS.length];
  return index % 3 === 0 ? [a, b, c] : [a, b];
}

function makeName(city: string, category: string, i: number) {
  const base = category
    .replace("Archaeological Site", "Ancient Heritage")
    .replace("Historic District", "Old Town")
    .replace("Religious Site", "Sacred Site")
    .replace("Cultural Experience", "Cultural Hub")
    .replace("Traditional Crafts", "Crafts Quarter")
    .replace("Performing Arts", "Performing Arts Venue")
    .replace("Food Heritage", "Gastronomy Heritage")
    .replace("Maritime Heritage", "Maritime Heritage")
    .replace("Fortress", "Fortress");
  return `${city} ${base} ${i + 1}`;
}

export const HERITAGE_SITES: BaseHeritageSite[] = CITIES.flatMap(({ key, city, base }) =>
  Array.from({ length: 20 }, (_, i) => {
    const category = CATEGORIES[(i + (key.length % 3)) % CATEGORIES.length];
    const image = getImageForCategory(category);
    const lng = Number((base[0] + (i % 5) * 0.002).toFixed(6));
    const lat = Number((base[1] + Math.floor(i / 5) * 0.002).toFixed(6));
    return {
      id: `gr-${key}-${String(i + 1).padStart(2, "0")}`,
      name: makeName(city, category, i),
      description: `Explore ${city}'s ${category.toLowerCase()} showcasing diverse cultural interests and stories. Dummy data #${i + 1}.`,
      category,
      rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
      duration: DURATIONS[i % DURATIONS.length],
      coordinates: [lng, lat],
      image,
      personas: personaSet(i),
      country: "Greece",
      city,
    } as BaseHeritageSite;
  })
);

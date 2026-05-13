export interface GenerateNameRequest {
  originalName: string;
  gender: "male" | "female" | "neutral";
  language: string;
  country?: string;
  birthYear?: number;
  profession?: string;
  interests?: string[];
  personality?: string;
  religion?: string;
  charCount?: 2 | 3 | 4;
  style?: string;
  themes?: string[];
  culturalRef?: string[];
  taboo?: string;
}

const VALID_GENDERS = ["male", "female", "neutral"];
const VALID_LANGUAGES = [
  "english", "french", "german", "spanish", "italian",
  "russian", "portuguese", "arabic", "japanese", "korean", "other",
];
const VALID_STYLES = [
  "classical", "modern", "literary", "minimalist",
  "cute", "powerful",
];
const VALID_THEMES = [
  "wisdom", "courage", "beauty", "nature", "fortune",
  "virtue", "success", "freedom", "peace",
];
const VALID_CULTURAL_REFS = [
  "historical", "poetry", "taoism", "zen", "wuxia",
];

export function validateRequest(body: unknown): {
  valid: boolean;
  data?: GenerateNameRequest;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const req = body as Record<string, unknown>;

  if (!req.originalName || typeof req.originalName !== "string") {
    return { valid: false, error: "originalName is required and must be a string" };
  }
  const originalName = req.originalName.trim();

  if (originalName.length === 0 || originalName.length > 100) {
    return { valid: false, error: "originalName must be between 1 and 100 characters" };
  }

  // Reject obviously malicious input
  if (/[<>{}]/.test(originalName)) {
    return { valid: false, error: "originalName contains invalid characters" };
  }

  if (!req.gender || !VALID_GENDERS.includes(req.gender as string)) {
    return { valid: false, error: `gender must be one of: ${VALID_GENDERS.join(", ")}` };
  }

  if (!req.language || !VALID_LANGUAGES.includes(req.language as string)) {
    return { valid: false, error: `language must be one of: ${VALID_LANGUAGES.join(", ")}` };
  }

  const data: GenerateNameRequest = {
    originalName,
    gender: req.gender as GenerateNameRequest["gender"],
    language: req.language as string,
  };

  if (req.country && typeof req.country === "string") {
    data.country = req.country.trim().slice(0, 60);
  }

  if (req.birthYear !== undefined && req.birthYear !== null) {
    const year = Number(req.birthYear);
    if (Number.isInteger(year) && year >= 1900 && year <= 2026) {
      data.birthYear = year;
    }
  }

  if (req.profession && typeof req.profession === "string") {
    data.profession = req.profession.trim().slice(0, 60);
  }

  if (req.interests && Array.isArray(req.interests)) {
    data.interests = (req.interests as string[])
      .filter((i) => typeof i === "string")
      .map((i) => i.trim().slice(0, 40))
      .slice(0, 10);
  }

  if (req.personality && typeof req.personality === "string") {
    data.personality = req.personality.trim().slice(0, 40);
  }

  if (req.religion && typeof req.religion === "string") {
    data.religion = req.religion.trim().slice(0, 40);
  }

  if (req.charCount !== undefined && req.charCount !== null) {
    const cc = Number(req.charCount);
    if ([2, 3, 4].includes(cc)) {
      data.charCount = cc as 2 | 3 | 4;
    }
  }

  if (req.style && VALID_STYLES.includes(req.style as string)) {
    data.style = req.style as string;
  }

  if (req.themes && Array.isArray(req.themes)) {
    data.themes = (req.themes as string[])
      .filter((t) => VALID_THEMES.includes(t as string))
      .slice(0, 3);
  }

  if (req.culturalRef && Array.isArray(req.culturalRef)) {
    data.culturalRef = (req.culturalRef as string[])
      .filter((c) => VALID_CULTURAL_REFS.includes(c as string))
      .slice(0, 3);
  }

  if (req.taboo && typeof req.taboo === "string") {
    data.taboo = req.taboo.trim().slice(0, 100);
  }

  return { valid: true, data };
}

export function hashRequest(req: GenerateNameRequest): string {
  // Simple hash for caching
  const str = JSON.stringify(req);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

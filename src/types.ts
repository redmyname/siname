export interface CandidateName {
  chineseName: string;
  pinyin: string;
  surname: {
    char: string;
    meaning: string;
    reason: string;
  };
  givenName: {
    char: string;
    meaning: string;
    reason: string;
  }[];
  overallMeaning: string;
  style: string;
}

export interface GenerateResponse {
  candidates: CandidateName[];
}

export interface FormData {
  originalName: string;
  gender: "male" | "female" | "neutral";
  language: string;
  country: string;
  birthYear: string;
  profession: string;
  interests: string[];
  personality: string;
  religion: string;
  charCount: string;
  style: string;
  themes: string[];
  culturalRef: string[];
  taboo: string;
}



/**
 * Generates a universally unique identifier (UUID).
 * Uses the standard `crypto.randomUUID` if available in a secure context,
 * otherwise falls back to a simple pseudo-random string to ensure
 * functionality in non-secure contexts (like HTTP) or older browsers.
 */
export function generateUUID(): string {
  if (self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  // Basic fallback for insecure contexts (http) or older browsers
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


export enum Credibility {
  High = 'بسیار معتبر',
  Medium = 'معتبر',
  Low = 'نیازمند بررسی',
}

export interface Filters {
  query: string;
  categories: string[];
  regions: string[];
  sources: string[];
}

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  publicationTime: string;
  credibility: Credibility | string;
  link: string;
  category: string;
  imageUrl?: string;
}

export interface TickerArticle {
  title: string;
  link: string;
}

export interface FactCheckSource {
    url: string;
    title: string;
}

export interface OriginalSourceInfo {
    name: string;
    credibility: string;
    publicationDate: string;
    author: string;
    evidenceType: string;
    evidenceCredibility: string;
    authorCredibility: string;
    link: string;
}

export interface StanceHolder {
    name: string;
    argument: string;
}

export interface FactCheckResult {
    overallCredibility: Credibility;
    summary: string;
    originalSource: OriginalSourceInfo;
    acceptancePercentage: number;
    proponents: StanceHolder[];
    opponents: StanceHolder[];
    relatedSuggestions?: string[];
    relatedSources: FactCheckSource[];
}

export interface ChartData {
    type: 'bar' | 'pie' | 'line' | 'table';
    title: string;
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color?: string; // Optional: for multi-color charts
    }[];
}

export interface StructuredSource {
    name: string;
    link: string;
    publicationDate: string;
    author: string;
    credibility: string;
}

export interface StructuredAnalysis {
    proponents: StanceHolder[];
    opponents: StanceHolder[];
    acceptancePercentage: number;
    currentValidity: string;
    alternativeResults?: string;
}

export interface StatisticsResult {
    title: string;
    summary: string;
    keywords: string[];
    chart: ChartData;
    sourceDetails: StructuredSource & {
        methodology: string;
        sampleSize: string;
    };
    analysis: StructuredAnalysis;
    relatedSuggestions: string[];
    references: FactCheckSource[];
}

export interface ScientificArticleResult {
    title:string;
    summary: string;
    keywords: string[];
    sourceDetails: StructuredSource & {
        researchType: string;
        targetAudience: string;
    };
    analysis: StructuredAnalysis;
    relatedSuggestions: string[];
    references: FactCheckSource[];
}

export type MediaFile = {
    name: string;
    type: string; // Mime type
    data: string; // Base64 data
    url: string; // Object URL for preview
};

// --- New Web Search Result Types ---
export interface WebResult {
    title: string;
    link: string;
    source: string;
    description: string;
    imageUrl?: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

// --- Video Converter Result Types ---
export interface VideoAnalysisEvidence {
    evidenceText: string;
    isReal: boolean;
    isCredible: boolean;

    isRelevant: boolean;
    sourceLink: string;
}

export interface VideoAnalysisClaim {
    claimText: string;
    analysis: string;
    evidence: VideoAnalysisEvidence[];
}

export interface VideoFactCheckResult {
    overallVerdict: string;
    claims: VideoAnalysisClaim[];
}

export interface VideoTimestamp {
    keyword: string;
    sentence: string;
    timestamp: string; // HH:MM:SS
}

export interface VideoTimestampResult {
    found: boolean;
    timestamps: VideoTimestamp[];
}


// --- SETTINGS ---

export type SourceCategory = 'fact-check' | 'news-agencies' | 'social-media' | 'financial' | 'analytical';

export const sourceCategoryLabels: Record<SourceCategory, string> = {
  'fact-check': 'منابع فکت چک',
  'news-agencies': 'خبرگزاری‌ها',
  'social-media': 'شبکه‌های اجتماعی',
  'financial': 'بازار مالی',
  'analytical': 'تحلیلی'
};

export interface Source {
  id: string;
  name: string;
  field: string;
  url: string;
  activity: string;
  credibility: string;
  region: string;
}

export type Sources = Record<SourceCategory, Source[]>;

export type AIInstructionType = 'fact-check' | 'news-search' | 'news-display' | 'news-ticker' | 'statistics-search' | 'science-search' | 'religion-search' | 'video-search' | 'audio-search' | 'book-search' | 'telegram-bot' | 'discord-bot' | 'website-bot' | 'twitter-bot' | 'music-search' | 'dollar-search' | 'video-converter' | 'analyzer-political' | 'analyzer-religious' | 'analyzer-logical' | 'analyzer-philosophical' | 'analyzer-philosophy-of-science' | 'analyzer-historical' | 'analyzer-physics' | 'analyzer-theological' | 'analyzer-fallacy-finder' | 'browser-agent' | 'general-topics' | 'seo-keywords' | 'website-names' | 'domain-names' | 'article-generation' | 'page-creator' | 'video-translate';

export const aiInstructionLabels: Record<AIInstructionType, string> = {
  'fact-check': 'فکت چک و ردیابی شایعه',
  'news-search': 'جستجوی خبر',
  'video-search': 'جستجوی ویدئو',
  'audio-search': 'جستجوی صدا',
  'book-search': 'جستجوی کتاب و سایت',
  'news-display': 'نمایش اخبار زنده',
  'news-ticker': 'نوار اخبار متحرک',
  'statistics-search': 'جستجوی آمار',
  'science-search': 'جستجوی علمی',
  'religion-search': 'جستجوی دینی',
  'telegram-bot': 'رفتار ربات تلگرام',
  'discord-bot': 'رفتار ربات دیسکورد',
  'website-bot': 'رفتار ربات وب‌سایت',
  'twitter-bot': 'رفتار ربات توییتر',
  'music-search': 'جستجوی موزیک و آهنگ',
  'dollar-search': 'جستجوی قیمت دلار',
  'video-converter': 'تحلیل و تبدیل ویدئو',
  'video-translate': 'ترجمه و زیرنویس ویدئو',
  'analyzer-political': 'تحلیل سیاسی',
  'analyzer-religious': 'تحلیل دینی',
  'analyzer-logical': 'تحلیل منطقی',
  'analyzer-philosophical': 'تحلیل فلسفی',
  'analyzer-philosophy-of-science': 'تحلیل فلسفه علم',
  'analyzer-historical': 'تحلیل تاریخی',
  'analyzer-physics': 'تحلیل فیزیک',
  'analyzer-theological': 'تحلیل کلامی',
  'analyzer-fallacy-finder': 'مغلطه یاب',
  'browser-agent': 'عامل هوشمند وب',
  'general-topics': 'جستجوی موضوعات عمومی',
  'seo-keywords': 'تولید کلمات کلیدی سئو',
  'website-names': 'پیشنهاد نام سایت',
  'domain-names': 'پیشنهاد نام دامنه',
  'article-generation': 'تولید محتوای مقاله',
  'page-creator': 'عامل هوشمند صفحه‌ساز',
};

export type AIInstructions = Record<AIInstructionType, string>;

export interface Theme {
  id: string;
  name: string;
  className: string;
}

export interface DisplaySettings {
    columns: number;
    articlesPerColumn: number;
    showImages: boolean;
    slideshow: {
        enabled: boolean;
        delay: number; // in seconds
    };
    allowedCategories: string[];
}

export interface TickerSettings {
    categories: string[];
    speed: number; // seconds for full marquee
    direction: 'left' | 'right';
    textColor: string;
    hoverColor: string;
    linkColor: string;
    borderColor: string;
    pauseOnHover: boolean;
    effect: 'none' | 'glow';
}

export interface WebsiteSettings {
    apiUrl: string;
    apiKey: string;
    botUserId: string;
    roomIds: string[];
}

export interface TwitterSettings {
    apiKey: string;
    apiSecretKey: string;
    accessToken: string;
    accessTokenSecret: string;
}

export interface AppwriteSettings {
    endpoint: string;
    projectId: string;
    apiKey: string; // Used for server-side operations, not client-side db.
    databaseId: string;
    settingsCollectionId: string;
    newsArticlesCollectionId: string;
    chatHistoryCollectionId: string;
}

export interface SupabaseSettings {
    projectUrl: string;
    anonKey: string;
}

export interface IntegrationSettings {
    telegram: {
        botToken: string;
        chatId: string;
    };
    discord: {
        webhookUrl: string;
    };
    website: WebsiteSettings;
    twitter: TwitterSettings;
    appwrite: AppwriteSettings;
    supabase: SupabaseSettings;
    // New settings for Cloudflare D1 backend
    cloudflareWorkerUrl: string;
    cloudflareWorkerToken: string;
}

export interface DatabaseSettings {
    name: string;
    host: string;
    password: string
}

export interface AIProviderSettings {
    apiKey: string;
}

export interface AppAIModelSettings {
    gemini: AIProviderSettings;
    openai: AIProviderSettings;
    openrouter: AIProviderSettings & {
      modelName?: string;
    };
    groq: AIProviderSettings;
}

export interface FontSettings {
  family: string;
  size: number;
  color: {
    from: string;
    to: string;
  };
}

export interface UpdateSettings {
  autoCheck: boolean;
  interval: number; // in minutes
}

export interface LiveNewsSpecificSettings {
  categories: string[];
  newsGroups: string[];
  regions: string[];
  selectedSources: Record<string, string[]>;
  font: FontSettings;
  updates: UpdateSettings;
  autoSend: boolean;
}

export type SearchTab = 'news' | 'video' | 'audio' | 'book' | 'stats' | 'science' | 'religion' | 'music' | 'dollar' | 'converter' | 'general_topics' | 'content-creator';

export interface SearchOptions {
    categories: string[];
    regions: string[];
    sources: string[];
}

export type AIModelProvider = 'gemini' | 'openai' | 'openrouter' | 'groq';

export interface AppSettings {
    theme: Theme;
    sources: Sources;
    aiInstructions: AIInstructions;
    display: DisplaySettings;
    ticker: TickerSettings;
    liveNewsSpecifics: LiveNewsSpecificSettings;
    integrations: IntegrationSettings;
    database: DatabaseSettings;
    aiModelSettings: AppAIModelSettings;
    customCss: string;
    searchOptions: Record<SearchTab, SearchOptions>;
    allTickerCategories: string[];
    password?: string;
    structuredSearchDomains: string[];
    structuredSearchRegions: string[];
    structuredSearchSources: string[];
    generalTopicDomains: string[];
    modelAssignments: Partial<Record<AIInstructionType, AIModelProvider>>;
}

// --- New General Topics Search Result Type ---
export interface GeneralTopicResult {
    title: string;
    summary: string;
    keyPoints: { title: string; description: string }[];
    comparison: {
        topicA: string;
        topicB: string;
        points: { aspect: string; analysisA: string; analysisB: string }[];
    } | null;
    sources: GroundingSource[];
}

// --- CHAT ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}


// --- ANALYZER ---

export type AnalyzerTabId = 'political' | 'religious' | 'logical' | 'philosophical' | 'philosophy-of-science' | 'historical' | 'physics' | 'theological' | 'fallacy-finder';

export const analyzerTabLabels: Record<AnalyzerTabId, string> = {
  'political': 'تحلیل سیاسی',
  'religious': 'تحلیل دینی',
  'logical': 'تحلیل منطقی',
  'philosophical': 'تحلیل فلسفی',
  'philosophy-of-science': 'فلسفه علم',
  'historical': 'تحلیل تاریخی',
  'physics': 'تحلیل فیزیک',
  'theological': 'تحلیل کلامی',
  'fallacy-finder': 'مغلطه یاب',
};

export interface ClarificationResponse {
    clarificationNeeded: boolean;
    question: string;
}

export interface AnalysisStance {
    name: string;
    argument: string;
    scientificLevel: number; // A rating from 1 to 5
}

export interface AnalysisExample {
    title: string;
    content: string;
}

export interface AnalysisResult {
    understanding: string;
    analysis: string;
    proponents: AnalysisStance[];
    opponents: AnalysisStance[];
    proponentPercentage: number; // 0-100
    sources: { title: string; url: string; }[];
    techniques: string[];
    suggestions: { title: string; url: string; }[];
    examples: AnalysisExample[];
}

export interface Fallacy {
    type: string;
    quote: string;
    explanation: string;
    correctedStatement: string;
}

export interface FallacyResult {
    identifiedFallacies: Fallacy[];
}

// --- WEB AGENT ---
export interface AgentQuestion {
    questionText: string;
    questionType: 'multiple-choice' | 'text-input';
    options?: string[]; // For multiple-choice
}
export interface AgentClarificationRequest {
    isClear: boolean;
    questions: AgentQuestion[];
    refinedPrompt: string; // AI might refine it in one go
}

export interface AgentExecutionResult {
    summary: string;
    steps: { title: string; description: string; }[];
    sources: GroundingSource[];
}

// --- PAGE CREATOR ---
export interface PageCreatorResult {
    title: string;
    plainText: string;
    htmlContent: string;
    suggestedPalette: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    }
}
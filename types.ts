
export enum Classification {
    PHISHING = "phishing",
    LEGITIMATE = "legitimate",
    SUSPICIOUS = "suspicious",
}

export enum RiskLevel {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    NONE = "None",
}

export interface FeatureAnalysis {
    feature: string;
    status: string;
    risk: RiskLevel;
    details: string;
}

export interface AnalysisResult {
    classification: Classification;
    confidenceScore: number;
    riskLevel: RiskLevel;
    summary: string;
    featureAnalysis: FeatureAnalysis[];
}

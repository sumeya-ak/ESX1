/**
 * IPO Readiness Scoring Engine
 * Aligned with ESX Growth Market Requirements
 */

export interface FinancialScoreInput {
  currentRatio: number;
  debtToEquity: number;
  netProfitMargin: number;
  returnOnAssets: number;
  revenueGrowth: number; // year-over-year as decimal
  yearsInOperation: number;
  liquidAssets: number;
  totalAssets: number;
}

export interface GovernanceScoreInput {
  hasBoard: boolean;
  hasCFO: boolean;
  hasAuditCommittee: boolean;
  auditedFinancials: boolean;
  corporateGovernanceCode: number; // 1-5
  ownershipConcentration: number; // 0-100, lower is better
  conflictOfInterest: number; // 1-5, rating
}

export interface OperationalScoreInput {
  totalEmployees: number;
  hasHRPolicy: boolean;
  hasQualityControl: boolean;
  customerRetention: number; // 0-100
  marketPosition: number; // 1-5
  hasSuccessionPlan: boolean;
  hasITInfrastructure: boolean;
}

export function calculateFinancialReadinessScore(data: FinancialScoreInput): {
  score: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let totalScore = 0;
  let weightSum = 0;

  // Current Ratio (Liquidity) - Weight: 15%
  let currentRatioScore = Math.min(100, (data.currentRatio / 2) * 100);
  if (data.currentRatio < 1) currentRatioScore = Math.max(0, data.currentRatio * 100);
  breakdown['Liquidity (Current Ratio)'] = currentRatioScore;
  totalScore += currentRatioScore * 0.15;
  weightSum += 0.15;

  // Debt to Equity - Weight: 20%
  let debtToEquityScore = 100;
  if (data.debtToEquity > 3) debtToEquityScore = 30;
  else if (data.debtToEquity > 2) debtToEquityScore = 50;
  else if (data.debtToEquity > 1.5) debtToEquityScore = 70;
  else if (data.debtToEquity > 1) debtToEquityScore = 85;
  breakdown['Leverage (Debt-to-Equity)'] = debtToEquityScore;
  totalScore += debtToEquityScore * 0.2;
  weightSum += 0.2;

  // Net Profit Margin - Weight: 20%
  const netMarginScore = Math.min(100, Math.max(0, (data.netProfitMargin * 100) / 0.15 * 100));
  breakdown['Profitability (Net Margin)'] = Math.min(100, data.netProfitMargin * 1000);
  totalScore += Math.min(100, data.netProfitMargin * 1000) * 0.2;
  weightSum += 0.2;

  // Return on Assets - Weight: 15%
  const roaScore = Math.min(100, Math.max(0, (data.returnOnAssets * 100) / 0.1 * 100));
  breakdown['Return on Assets'] = roaScore;
  totalScore += roaScore * 0.15;
  weightSum += 0.15;

  // Revenue Growth - Weight: 15%
  let growthScore = 0;
  if (data.revenueGrowth >= 0.15) growthScore = 100;
  else if (data.revenueGrowth >= 0.1) growthScore = 80;
  else if (data.revenueGrowth >= 0.05) growthScore = 60;
  else if (data.revenueGrowth >= 0) growthScore = 40;
  else growthScore = 20;
  breakdown['Revenue Growth'] = growthScore;
  totalScore += growthScore * 0.15;
  weightSum += 0.15;

  // Years in Operation - Weight: 5%
  let operationScore = 0;
  if (data.yearsInOperation >= 5) operationScore = 100;
  else if (data.yearsInOperation >= 3) operationScore = 80;
  else if (data.yearsInOperation >= 2) operationScore = 60;
  else operationScore = 40;
  breakdown['Years in Operation'] = operationScore;
  totalScore += operationScore * 0.05;
  weightSum += 0.05;

  // Asset Liquidity - Weight: 10%
  const liquidityRatio = data.totalAssets ? data.liquidAssets / data.totalAssets : 0;
  const assetLiquidityScore = Math.min(100, liquidityRatio * 150);
  breakdown['Asset Liquidity'] = assetLiquidityScore;
  totalScore += assetLiquidityScore * 0.1;
  weightSum += 0.1;

  return {
    score: Math.round((totalScore / weightSum) * 100) / 100,
    breakdown,
  };
}

export function calculateGovernanceReadinessScore(data: GovernanceScoreInput): {
  score: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let totalScore = 0;

  // Board Structure - Weight: 25%
  let boardScore = 0;
  if (data.hasBoard && data.hasCFO && data.hasAuditCommittee) boardScore = 100;
  else if (data.hasBoard && (data.hasCFO || data.hasAuditCommittee)) boardScore = 70;
  else if (data.hasBoard) boardScore = 50;
  else boardScore = 20;
  breakdown['Board Structure'] = boardScore;
  totalScore += boardScore * 25;

  // Audited Financials - Weight: 25%
  const auditScore = data.auditedFinancials ? 100 : 30;
  breakdown['Audited Financials'] = auditScore;
  totalScore += auditScore * 25;

  // Corporate Governance Code - Weight: 20%
  const govScore = (data.corporateGovernanceCode / 5) * 100;
  breakdown['Governance Code Compliance'] = govScore;
  totalScore += govScore * 20;

  // Ownership Structure - Weight: 20%
  let ownershipScore = 100;
  if (data.ownershipConcentration > 80) ownershipScore = 30;
  else if (data.ownershipConcentration > 60) ownershipScore = 50;
  else if (data.ownershipConcentration > 40) ownershipScore = 75;
  breakdown['Ownership Structure'] = ownershipScore;
  totalScore += ownershipScore * 20;

  // Conflict of Interest Management - Weight: 10%
  const conflictScore = (data.conflictOfInterest / 5) * 100;
  breakdown['Conflict Management'] = conflictScore;
  totalScore += conflictScore * 10;

  return {
    score: Math.round(totalScore / 100),
    breakdown,
  };
}

export function calculateOperationalReadinessScore(data: OperationalScoreInput): {
  score: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let totalScore = 0;

  // Company Size - Weight: 15%
  let sizeScore = 0;
  if (data.totalEmployees >= 500) sizeScore = 100;
  else if (data.totalEmployees >= 250) sizeScore = 90;
  else if (data.totalEmployees >= 100) sizeScore = 80;
  else if (data.totalEmployees >= 50) sizeScore = 70;
  else if (data.totalEmployees >= 20) sizeScore = 60;
  else sizeScore = 40;
  breakdown['Company Scale'] = sizeScore;
  totalScore += sizeScore * 15;

  // HR & People Management - Weight: 20%
  let hrScore = data.hasHRPolicy ? 80 : 30;
  if (data.hasSuccessionPlan) hrScore += 20;
  hrScore = Math.min(100, hrScore);
  breakdown['HR & People Management'] = hrScore;
  totalScore += hrScore * 20;

  // Operational Controls - Weight: 20%
  let controlScore = data.hasQualityControl ? 70 : 30;
  if (data.hasITInfrastructure) controlScore += 30;
  controlScore = Math.min(100, controlScore);
  breakdown['Operational Controls'] = controlScore;
  totalScore += controlScore * 20;

  // Customer Retention - Weight: 20%
  const customerScore = Math.min(100, (data.customerRetention / 100) * 100);
  breakdown['Customer Retention'] = data.customerRetention;
  totalScore += data.customerRetention * 20;

  // Market Position - Weight: 25%
  const marketScore = (data.marketPosition / 5) * 100;
  breakdown['Market Position'] = marketScore;
  totalScore += marketScore * 25;

  return {
    score: Math.round(totalScore / 100),
    breakdown,
  };
}

export function calculateOverallIPOReadinessScore(
  financialScore: number,
  governanceScore: number,
  operationalScore: number
): { score: number; recommendation: string; readinessLevel: string } {
  // Weighted average: Financial 40%, Governance 35%, Operational 25%
  const overallScore = financialScore * 0.4 + governanceScore * 0.35 + operationalScore * 0.25;
  const roundedScore = Math.round(overallScore);

  let readinessLevel = '';
  let recommendation = '';

  if (roundedScore >= 80) {
    readinessLevel = 'HIGHLY READY';
    recommendation =
      'Your company demonstrates strong IPO readiness. Consider proceeding with IPO preparation and engaging with ESX advisors.';
  } else if (roundedScore >= 65) {
    readinessLevel = 'MODERATELY READY';
    recommendation =
      'Your company shows good potential for IPO listing. Focus on addressing identified gaps in financial, governance, and operational areas.';
  } else if (roundedScore >= 50) {
    readinessLevel = 'PARTIALLY READY';
    recommendation =
      'Significant improvements needed in key areas. Develop a structured action plan to enhance financial performance and governance standards.';
  } else {
    readinessLevel = 'NOT READY';
    recommendation =
      'Your company requires substantial improvements before considering IPO. Focus on strengthening financial foundations and governance structures.';
  }

  return {
    score: roundedScore,
    recommendation,
    readinessLevel,
  };
}

/**
 * Qualitative section scoring (Green/Yellow/Red or 1-5 scale)
 */
export type QualitativeAnswer = 'green' | 'yellow' | 'red' | number; // 1-5 numeric scale

export function scoreQualitativeAnswer(ans: QualitativeAnswer): number {
  if (typeof ans === 'string') {
    switch (ans.toLowerCase()) {
      case 'green':
        return 100;
      case 'yellow':
        return 60;
      case 'red':
        return 20;
      default:
        return 0;
    }
  }
  // assume 1-5 scale
  const numeric = Math.max(1, Math.min(5, ans));
  return (numeric / 5) * 100;
}

export function calculateQualitativeSectionScore(answers: QualitativeAnswer[]): number {
  if (!answers.length) return 0;
  const total = answers.reduce<number>((sum, a) => sum + scoreQualitativeAnswer(a as any), 0);
  return Math.round(total / answers.length);
}

/**
 * Extended overall ESX readiness score across up to 7 sections.
 * weights param allows custom weighting; defaults to equal weight.
 */
export function calculateOverallESXReadiness(
  sectionScores: number[],
  weights?: number[]
): number {
  if (!sectionScores.length) return 0;
  const ws = weights && weights.length === sectionScores.length ? weights : Array(sectionScores.length).fill(1);
  const totalWeight = ws.reduce((a, b) => a + b, 0);
  const weightedSum = sectionScores.reduce((sum, score, idx) => sum + score * ws[idx], 0);
  return Math.round((weightedSum / totalWeight));
}

export interface RiskItem {
  category: 'financial' | 'governance' | 'operational' | 'market';
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function assessRisks(
  financialData: FinancialScoreInput,
  governanceData: GovernanceScoreInput,
  operationalData: OperationalScoreInput
): RiskItem[] {
  const risks: RiskItem[] = [];

  // Financial Risks
  if (financialData.currentRatio < 1) {
    risks.push({
      category: 'financial',
      type: 'Liquidity Risk',
      description: 'Current ratio below 1.0 indicates potential difficulty meeting short-term obligations',
      severity: 'high',
    });
  }

  if (financialData.debtToEquity > 2) {
    risks.push({
      category: 'financial',
      type: 'Leverage Risk',
      description: 'High debt-to-equity ratio exceeding safe limits for public companies',
      severity: 'high',
    });
  }

  if (financialData.revenueGrowth < 0) {
    risks.push({
      category: 'financial',
      type: 'Revenue Decline',
      description: 'Declining revenue trend may concern potential investors',
      severity: 'medium',
    });
  }

  if (financialData.yearsInOperation < 3) {
    risks.push({
      category: 'financial',
      type: 'Operating History',
      description: 'Limited operating history (<3 years) increases investment risk perception',
      severity: 'medium',
    });
  }

  // Governance Risks
  if (!governanceData.auditedFinancials) {
    risks.push({
      category: 'governance',
      type: 'Financial Audit Gap',
      description: 'Financial statements not independently audited - ESX requirement',
      severity: 'critical',
    });
  }

  if (!governanceData.hasBoard) {
    risks.push({
      category: 'governance',
      type: 'Board Structure',
      description: 'Lacks formal board of directors - required for ESX listing',
      severity: 'critical',
    });
  }

  if (governanceData.ownershipConcentration > 80) {
    risks.push({
      category: 'governance',
      type: 'Ownership Concentration',
      description: 'Ownership highly concentrated with few shareholders - governance risk',
      severity: 'high',
    });
  }

  // Operational Risks
  if (operationalData.totalEmployees < 20) {
    risks.push({
      category: 'operational',
      type: 'Limited Scale',
      description: 'Small company size may limit institutional investor interest',
      severity: 'medium',
    });
  }

  if (!operationalData.hasHRPolicy) {
    risks.push({
      category: 'operational',
      type: 'HR Infrastructure',
      description: 'Lack of formal HR policies may indicate operational immaturity',
      severity: 'medium',
    });
  }

  if (!operationalData.hasSuccessionPlan) {
    risks.push({
      category: 'operational',
      type: 'Succession Planning',
      description: 'No formal succession plan identified - key person dependency risk',
      severity: 'high',
    });
  }

  return risks;
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QuestionnaireResponse from "@/models/QuestionnaireResponse";
import Company from "@/models/Company";
import {
  calculateFinancialReadinessScore,
  calculateGovernanceReadinessScore,
  calculateOperationalReadinessScore,
  calculateQualitativeSectionScore,
  calculateOverallESXReadiness,
  type FinancialScoreInput,
  type GovernanceScoreInput,
  type OperationalScoreInput,
  QualitativeAnswer,
} from "@/lib/scoring";

// POST: create new questionnaire response and return scores
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    companyId,
    financial,
    governance,
    operational,
    legal,
    business,
    market,
    equityStory,
    rawAnswers,
  } = body || {};

  if (!financial || !governance || !operational) {
    return NextResponse.json({ error: "Missing required sections" }, { status: 400 });
  }

  await dbConnect();

  let company = null;
  if (companyId) {
    company = await Company.findById(companyId).lean();
  }

  // Calculate section scores
  const finRes = calculateFinancialReadinessScore(financial as FinancialScoreInput);
  const govRes = calculateGovernanceReadinessScore(governance as GovernanceScoreInput);
  const opRes = calculateOperationalReadinessScore(operational as OperationalScoreInput);

  const legalScore = legal ? calculateQualitativeSectionScore(legal as QualitativeAnswer[]) : 0;
  const businessScore = business ? calculateQualitativeSectionScore(business as QualitativeAnswer[]) : 0;
  const marketScore = market ? calculateQualitativeSectionScore(market as QualitativeAnswer[]) : 0;
  const equityScore = equityStory ? calculateQualitativeSectionScore(equityStory as QualitativeAnswer[]) : 0;

  const sections = [
    finRes.score,
    govRes.score,
    opRes.score,
    legalScore,
    businessScore,
    marketScore,
    equityScore,
  ];
  // Remove zeros corresponding to missing sections for weighting
  const filteredSections = sections.filter((s) => s > 0);
  const overall = calculateOverallESXReadiness(filteredSections);

  // Determine readiness level and recommendation
  let readinessLevel = "NOT READY";
  let recommendation = "Your company requires substantial improvements before considering IPO.";
  if (overall >= 80) {
    readinessLevel = "HIGHLY READY";
    recommendation = "Strong IPO readiness. Consider proceeding with IPO preparation and engaging advisors.";
  } else if (overall >= 65) {
    readinessLevel = "MODERATELY READY";
    recommendation = "Good potential for listing. Address identified gaps in financial, governance, and operational areas.";
  } else if (overall >= 50) {
    readinessLevel = "PARTIALLY READY";
    recommendation = "Significant improvements needed. Develop an action plan to enhance financial performance and governance.";
  }

  const doc = await QuestionnaireResponse.create({
    company: companyId || undefined,
    answers: rawAnswers ?? body,
    sectionScores: {
      financial: finRes.score,
      governance: govRes.score,
      operational: opRes.score,
      legal: legalScore,
      business: businessScore,
      market: marketScore,
      equityStory: equityScore,
    },
    overallScore: overall,
    readinessLevel,
    recommendation,
  });

  return NextResponse.json({ id: doc._id, overallScore: overall, sectionScores: doc.sectionScores });
}

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  if (!companyId) return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  await dbConnect();
  const latest = await QuestionnaireResponse.findOne({ company: companyId })
    .sort({ createdAt: -1 })
    .lean();
  if (!latest) return NextResponse.json({ error: "No assessment found" }, { status: 404 });
  return NextResponse.json(latest);
}

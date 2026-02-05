-- ESX IPO Readiness Analyzer Database Schema

-- Users/SME Accounts Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  sme_id VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
  company_registration_number VARCHAR(100),
  industry VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  profile_complete BOOLEAN DEFAULT FALSE,
  INDEX idx_email (email),
  INDEX idx_sme_id (sme_id)
);

-- Financial Data Table (Annual Snapshots)
CREATE TABLE IF NOT EXISTS financial_data (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  fiscal_year INT NOT NULL,
  
  -- Income Statement
  revenue DECIMAL(18, 2),
  cost_of_goods_sold DECIMAL(18, 2),
  gross_profit DECIMAL(18, 2),
  operating_expenses DECIMAL(18, 2),
  operating_income DECIMAL(18, 2),
  interest_expense DECIMAL(18, 2),
  tax_expense DECIMAL(18, 2),
  net_income DECIMAL(18, 2),
  
  -- Balance Sheet
  total_assets DECIMAL(18, 2),
  current_assets DECIMAL(18, 2),
  non_current_assets DECIMAL(18, 2),
  total_liabilities DECIMAL(18, 2),
  current_liabilities DECIMAL(18, 2),
  non_current_liabilities DECIMAL(18, 2),
  total_equity DECIMAL(18, 2),
  paid_in_capital DECIMAL(18, 2),
  retained_earnings DECIMAL(18, 2),
  
  -- Operational Information
  total_employees INT,
  revenue_per_employee DECIMAL(18, 2),
  asset_turnover DECIMAL(10, 4),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_year (user_id, fiscal_year),
  INDEX idx_user_id (user_id)
);

-- Calculated Financial Ratios
CREATE TABLE IF NOT EXISTS financial_ratios (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  financial_data_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  
  -- Liquidity Ratios
  current_ratio DECIMAL(10, 4),
  quick_ratio DECIMAL(10, 4),
  
  -- Profitability Ratios
  gross_profit_margin DECIMAL(10, 4),
  operating_profit_margin DECIMAL(10, 4),
  net_profit_margin DECIMAL(10, 4),
  return_on_assets DECIMAL(10, 4),
  return_on_equity DECIMAL(10, 4),
  
  -- Leverage Ratios
  debt_to_equity DECIMAL(10, 4),
  debt_to_assets DECIMAL(10, 4),
  equity_multiplier DECIMAL(10, 4),
  
  -- Efficiency Ratios
  asset_turnover DECIMAL(10, 4),
  inventory_turnover DECIMAL(10, 4),
  receivables_turnover DECIMAL(10, 4),
  
  -- Valuation Ratios (if applicable)
  earnings_per_share DECIMAL(18, 2),
  price_to_earnings DECIMAL(10, 4),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (financial_data_id) REFERENCES financial_data(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- IPO Readiness Assessment
CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Overall Scores
  financial_readiness_score INT,
  governance_readiness_score INT,
  operational_readiness_score INT,
  overall_ipo_readiness_score INT,
  
  -- Status
  assessment_status ENUM('draft', 'in_progress', 'completed') DEFAULT 'draft',
  
  -- Recommendation
  recommendation TEXT,
  key_gaps JSON,
  priority_actions JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_assessment_date (assessment_date)
);

-- IPO Readiness Questionnaire Responses
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  assessment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  question_text TEXT,
  category VARCHAR(50), -- 'governance', 'operational', 'financial'
  response_value INT, -- 1-5 scale
  response_text TEXT,
  weight DECIMAL(10, 4) DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assessment_id (assessment_id),
  INDEX idx_category (category)
);

-- Risk Assessment Results
CREATE TABLE IF NOT EXISTS risk_assessments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  assessment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  
  risk_category VARCHAR(100), -- 'financial', 'governance', 'operational', 'market'
  risk_type VARCHAR(150),
  risk_description TEXT,
  risk_score INT, -- 1-10 scale
  impact_level ENUM('low', 'medium', 'high', 'critical'),
  probability ENUM('low', 'medium', 'high'),
  
  mitigation_recommendation TEXT,
  priority INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assessment_id (assessment_id),
  INDEX idx_risk_category (risk_category)
);

-- Assessment Progress Tracking
CREATE TABLE IF NOT EXISTS assessment_progress (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  
  -- Section Completion
  financial_data_complete BOOLEAN DEFAULT FALSE,
  questionnaire_complete BOOLEAN DEFAULT FALSE,
  risk_assessment_complete BOOLEAN DEFAULT FALSE,
  
  -- Progress Percentage
  overall_progress INT DEFAULT 0,
  
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user (user_id)
);

-- ESX Growth Market Requirements Checklist
CREATE TABLE IF NOT EXISTS esx_requirements_checklist (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  assessment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  
  requirement_id VARCHAR(100) NOT NULL,
  requirement_category VARCHAR(100), -- 'financial', 'governance', 'disclosure'
  requirement_text VARCHAR(500),
  requirement_description TEXT,
  met_status ENUM('not_met', 'partially_met', 'met') DEFAULT 'not_met',
  
  evidence_file VARCHAR(255),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assessment_id (assessment_id),
  INDEX idx_category (requirement_category)
);

-- Assessment Reports
CREATE TABLE IF NOT EXISTS assessment_reports (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  assessment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  
  report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Report Content
  executive_summary TEXT,
  financial_analysis TEXT,
  governance_analysis TEXT,
  operational_analysis TEXT,
  risk_summary TEXT,
  recommendations TEXT,
  
  -- Report Metadata
  report_status ENUM('draft', 'finalized') DEFAULT 'draft',
  generated_by VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Create indexes for common queries
CREATE INDEX idx_users_created ON users(created_at);
CREATE INDEX idx_financial_data_user_year ON financial_data(user_id, fiscal_year);
CREATE INDEX idx_assessments_user_date ON assessments(user_id, assessment_date);

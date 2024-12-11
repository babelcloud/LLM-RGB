export default interface TestResultRaw {
  version: number;
  results: Result[];
  stats: Stats;
  table: Table;
}

export interface Result {
  provider: Provider;
  prompt: Prompt;
  vars: Vars;
  response: Response;
  success: boolean;
  score: number;
  latencyMs: number;
  gradingResult: GradingResult;
}

export interface GradingResult {
  pass: boolean;
  score: number;
  reason: string;
  tokensUsed: Token;
  componentResults: ComponentResult[];
  assertion: null;
}

export interface ComponentResult {
  pass: boolean;
  score: number;
  reason: string;
  assertion: Assertion;
}

export interface Assertion {
  type: string;
  value: string[] | string;
  weight: number;
}

export interface Token {
  total: number;
  prompt: number;
  completion: number;
  cached?: number;
}

export interface Prompt {
  raw: string;
  display: string;
}

export interface Provider {
  id: string;
}

export interface Response {
  output: string;
  tokenUsage: Token;
  cached: boolean;
}

export interface Difficulties {
  'context-length': number;
  'reasoning-depth': number;
  'instruction-compliance': number;
}

export interface Vars {
  name: string;
  difficulties: Difficulties;
  prompt: string;
}

export interface Stats {
  successes: number;
  failures: number;
  tokenUsage: Token;
}

export interface Table {
  head: Head;
  body: Body[];
}

export interface Body {
  outputs: Output[];
  vars: string[];
}

export interface Output {
  pass: boolean;
  score: number;
  text: string;
  prompt: string;
  provider: string;
  latencyMs: number;
  tokenUsage: Token;
  gradingResult: GradingResult;
}

export interface Head {
  prompts: Prompt[];
  vars: string[];
}

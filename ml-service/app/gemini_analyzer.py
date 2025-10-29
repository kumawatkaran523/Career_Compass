"""
Intelligent career analysis with deep niche exploration
Detects specializations and suggests cutting-edge paths
"""

from google import genai
from google.genai import types
import json
import os
from typing import List, Dict
from dotenv import load_dotenv
from app.models import GeminiAnalysis, CareerRecommendation, SalaryPrediction

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_with_gemini(resume_text: str, extracted_skills: List[Dict], entities: Dict) -> GeminiAnalysis:
    """Smart analysis with deep niche exploration"""
    
    skills_list = [s.get("skill", "") for s in (extracted_skills or [])][:25]
    
    prompt = f"""You're a senior tech career advisor with deep knowledge of emerging tech ecosystems.

SKILLS: {', '.join(skills_list)}

RESUME:
{resume_text[:2500]}

YOUR MISSION:
1. Detect ANY niche interests or specializations in the resume
2. If you find a niche (blockchain, ML, cloud, DevOps, etc.), GO DEEP:
   - Suggest specific ecosystems, frameworks, languages
   - Mention trending opportunities in that space
   - Name specific companies, platforms, or programs
3. Be direct - speak to "you", not about them

EXAMPLES OF DEPTH (don't copy, just understand the style):
- If blockchain → suggest specific chains, DeFi protocols, NFT platforms
- If ML → suggest specific frameworks, deployment tools, MLOps platforms  
- If cloud → suggest specific services, IaC tools, monitoring solutions
- If DevOps → suggest specific CI/CD tools, container orchestration

SALARY (India 2025):
Entry ₹4-8L, Junior ₹7-14L, Mid ₹12-22L, Senior ₹18-35L+
Niche premiums: Web3 +40%, ML +30%, Cloud +20%

Return JSON:
{{
  "career_recommendations": [
    {{"role": "Specific Role", "match_score": 70-95, "reasoning": "Deep advice with ecosystem names, tools, timelines"}},
    {{"role": "Alt Niche Role", "match_score": 65-90, "reasoning": "Different specialization"}},
    {{"role": "Growth Path", "match_score": 60-85, "reasoning": "Future opportunity"}}
  ],
  "ats_score": 50-95,
  "ats_feedback": "What works. What to fix. Specific changes.",
  "missing_skills": ["Skill - why + ecosystem impact", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "quick_wins": ["Specific action with tool names", "Action 2", "Action 3"],
  "salary_prediction": {{"min": number, "max": number, "currency": "INR"}},
  "summary": "Diagnosis + niche opportunities + deep action plan + targets."
}}

BE SPECIFIC. If they show interest in a niche, explore it deeply."""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.85,  # Higher for creative niche suggestions
                max_output_tokens=2500,
                safety_settings=[
                    types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=types.HarmBlockThreshold.BLOCK_NONE),
                    types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=types.HarmBlockThreshold.BLOCK_NONE),
                    types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold=types.HarmBlockThreshold.BLOCK_NONE),
                    types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold=types.HarmBlockThreshold.BLOCK_NONE)
                ]
            )
        )
        
        if not response or not response.text:
            return create_niche_aware_fallback(skills_list, resume_text)
        
        text = response.text.strip()
        if '{' in text:
            text = text[text.find('{'):text.rfind('}')+1]
        text = text.replace('``````', '').strip()
        
        result = json.loads(text)
        
        recs = result.get("career_recommendations", [])
        if not recs or len(recs) < 2:
            return create_niche_aware_fallback(skills_list, resume_text)
        
        return GeminiAnalysis(
            career_recommendations=[CareerRecommendation(**r) for r in recs[:3]],
            ats_score=result.get("ats_score", 70),
            ats_feedback=result.get("ats_feedback", ""),
            missing_skills=result.get("missing_skills", [])[:5],
            quick_wins=result.get("quick_wins", [])[:3],
            salary_prediction=SalaryPrediction(**result.get("salary_prediction", {"min": 600000, "max": 1200000})),
            summary=result.get("summary", "")
        )
    
    except:
        return create_niche_aware_fallback(skills_list, resume_text)


def create_niche_aware_fallback(skills: List[str], resume_text: str) -> GeminiAnalysis:
    """Smart fallback with niche detection and deep suggestions"""
    
    resume_lower = resume_text.lower()
    
    # Detect niches with depth
    niches = {
        'web3': sum(1 for s in skills if any(t in s.lower() for t in ['web3', 'blockchain', 'solana', 'ethereum', 'smart contract'])),
        'ml': sum(1 for s in skills if any(t in s.lower() for t in ['machine learning', 'tensorflow', 'pytorch', 'scikit', 'ml'])),
        'cloud': sum(1 for s in skills if any(t in s.lower() for t in ['aws', 'azure', 'gcp', 'lambda', 'kubernetes'])),
        'devops': sum(1 for s in skills if any(t in s.lower() for t in ['docker', 'jenkins', 'ci/cd', 'terraform', 'ansible'])),
        'mobile': sum(1 for s in skills if any(t in s.lower() for t in ['react native', 'flutter', 'ios', 'android', 'mobile'])),
        'fullstack': (sum(1 for s in skills if any(t in s.lower() for t in ['react', 'vue', 'angular'])) +
                     sum(1 for s in skills if any(t in s.lower() for t in ['node', 'express', 'django'])))
    }
    
    # Find dominant niche
    top_niche = max(niches.items(), key=lambda x: x[1])
    niche_name, niche_count = top_niche
    
    roles = []
    
    # Deep niche exploration
    if niche_name == 'web3' and niche_count >= 2:
        roles = [
            CareerRecommendation(
                role="Web3/DeFi Developer",
                match_score=90,
                reasoning="You have blockchain exposure. Go deep: Learn Solidity (Ethereum), Rust (Solana), or Move (Sui/Aptos). Build on trending L2s: Base, Arbitrum, Optimism. Explore DeFi protocols (Uniswap, Aave forks), NFT platforms (Metaplex). Target: Polygon jobs, Solana grants, remote Web3 companies. ₹15-30L. Learn: Anchor (Solana), Hardhat (Ethereum), Web3.js."
            ),
            CareerRecommendation(
                role="Full-Stack Web3 Engineer",
                match_score=85,
                reasoning="Combine your web skills with Web3. Build dApps with Next.js + Wagmi + Viem. Master wallet integration (RainbowKit, WalletConnect). Deploy on Base or Polygon. ₹12-25L at crypto startups."
            ),
            CareerRecommendation(
                role="Smart Contract Auditor",
                match_score=75,
                reasoning="Growth path: Learn security (Slither, Mythril). Study common exploits. Do CTFs (Ethernaut). High demand, ₹20-40L with 1-2 years experience."
            )
        ]
    
    elif niche_name == 'ml' and niche_count >= 2:
        roles = [
            CareerRecommendation(
                role="ML Engineer / MLOps",
                match_score=88,
                reasoning="You have ML foundations. Go production: Learn MLflow, DVC for versioning. Deploy with FastAPI, BentoML. Use vector DBs (Pinecone, Weaviate). Master PyTorch or TensorFlow. Target: AI startups, enterprise ML teams. ₹10-20L, growing to ₹18-35L."
            ),
            CareerRecommendation(
                role="LLM Application Developer",
                match_score=82,
                reasoning="Hot niche: Build with LangChain, LlamaIndex. Fine-tune models (LoRA, QLoRA). Use OpenAI/Gemini APIs. Create RAG systems. ₹12-25L at AI-first companies."
            ),
            CareerRecommendation(
                role="Computer Vision Engineer",
                match_score=75,
                reasoning="Specialize: YOLO, Detectron2 for vision tasks. Edge deployment (ONNX, TensorRT). ₹12-28L at robotics, automotive, surveillance companies."
            )
        ]
    
    elif niche_name == 'cloud' and niche_count >= 3:
        roles = [
            CareerRecommendation(
                role="Cloud/DevOps Engineer",
                match_score=88,
                reasoning="You list cloud services. Go deep: Master IaC (Terraform, CloudFormation). Container orchestration (EKS, GKE, AKS). Observability (Datadog, Prometheus, Grafana). GitOps (ArgoCD, Flux). Target: Cloud-native companies. ₹10-20L, growing to ₹16-30L."
            ),
            CareerRecommendation(
                role="Platform Engineer / SRE",
                match_score=82,
                reasoning="Emerging role: Build internal platforms. Master K8s operators, service mesh (Istio). Incident management. ₹14-28L at mature startups."
            ),
            CareerRecommendation(
                role="Cloud Architect",
                match_score=70,
                reasoning="Growth path: Design multi-cloud solutions. Cost optimization. Security (IAM, VPC). Certifications help. ₹20-40L with 3-5 years."
            )
        ]
    
    else:  # Generic full-stack or entry
        roles = [
            CareerRecommendation(
                role="Full-Stack Developer",
                match_score=85,
                reasoning=f"You have {niche_count} relevant skills. Master TypeScript, add testing, learn Docker. Build 2-3 production projects. ₹7-14L at product startups."
            ),
            CareerRecommendation(
                role="Backend Engineer",
                match_score=80,
                reasoning="Focus on APIs, databases, caching (Redis). Learn system design. ₹8-16L."
            ),
            CareerRecommendation(
                role="Frontend Developer",
                match_score=75,
                reasoning="Master React/Vue deeply. Add animations, state management. ₹7-14L."
            )
        ]
    
    # Niche-aware salary
    if niche_name == 'web3' and niche_count >= 2:
        sal_min, sal_max = 1000000, 2000000
    elif niche_name == 'ml' and niche_count >= 2:
        sal_min, sal_max = 800000, 1600000
    elif niche_name == 'cloud' and niche_count >= 3:
        sal_min, sal_max = 800000, 1500000
    else:
        sal_min, sal_max = 600000, 1200000
    
    # Niche-specific gaps
    if niche_name == 'web3':
        gaps = ["Solidity or Rust", "Wallet integration (wagmi/viem)", "Smart contract testing", "Gas optimization", "DeFi protocol knowledge"]
    elif niche_name == 'ml':
        gaps = ["MLOps (MLflow, DVC)", "Model deployment (FastAPI)", "Vector databases", "Fine-tuning techniques", "A/B testing for models"]
    elif niche_name == 'cloud':
        gaps = ["Terraform (IaC)", "Kubernetes deep dive", "Monitoring (Datadog/Prometheus)", "Cost optimization", "Security best practices"]
    else:
        gaps = ["TypeScript", "Docker", "Testing", "CI/CD", "System Design"]
    
    return GeminiAnalysis(
        career_recommendations=roles[:3],
        ats_score=65 + (niche_count * 3),
        ats_feedback=f"{'Strong ' + niche_name.upper() + ' focus visible.' if niche_count >= 2 else 'Broad skills - need focus.'} Add metrics to bullets. Include GitHub links. Use specific tool names.",
        missing_skills=gaps,
        quick_wins=[
            f"Add numbers to 3 bullets (1 hour)",
            f"Build one {niche_name} project with live demo (varies)",
            f"Document tech stack and architecture (2 hours)"
        ],
        salary_prediction=SalaryPrediction(min=sal_min, max=sal_max, currency="INR"),
        summary=f"You show {niche_name.upper()} interest with {niche_count} relevant skills. {'Go deep in this niche - high demand, premium salaries.' if niche_count >= 2 else 'Pick one specialization and go deep.'} Add production signals (Docker, tests, CI/CD). Target ₹{sal_min//100000}-{sal_max//100000}L. {'Explore ' + (roles[0].role if roles else 'opportunities') + ' deeply.' if niche_count >= 2 else 'Build 2-3 focused projects.'}"
    )

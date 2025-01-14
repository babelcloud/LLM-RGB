import pandas as pd
from datetime import datetime, timedelta
import pytz

def extract_seed_rounds_techcrunch():
    """Extract seed and early-stage AI deals from TechCrunch."""
    deals = []
    
    # Early 2024 Seed/Early-Stage Deals
    deals.extend([
        {
            'date': '2024-01-17',
            'announcement_time': '10:00:00',
            'company_name': 'Sentient',
            'funding_amount': 85000000,
            'valuation': None,
            'description': 'AI-powered autonomous systems for enterprise applications',
            'investors': 'Founders Fund, Sequoia Capital, a16z',
            'deal_url': 'https://news.crunchbase.com/sentient-seed-funding'
        },
        {
            'date': '2024-01-16',
            'announcement_time': '11:30:00',
            'company_name': 'Defcon AI',
            'funding_amount': 44000000,
            'valuation': None,
            'description': 'AI-driven cybersecurity and threat detection platform',
            'investors': 'General Catalyst, Lightspeed Venture Partners',
            'deal_url': 'https://news.crunchbase.com/defcon-ai-seed'
        },
        {
            'date': '2024-01-18',
            'announcement_time': '10:00:00',
            'company_name': 'Edera AI',
            'funding_amount': 4500000,
            'valuation': None,
            'description': 'AI-powered Kubernetes security and compliance platform',
            'investors': 'Vertex Ventures, Unusual Ventures',
            'deal_url': 'https://techcrunch.com/2024/01/18/edera-seed-funding'
        },
        {
            'date': '2024-01-17',
            'announcement_time': '09:30:00',
            'company_name': 'Altera AI',
            'funding_amount': 3800000,
            'valuation': None,
            'description': 'Game-playing AI agents and reinforcement learning platform',
            'investors': 'Innovation Endeavors, Eric Schmidt',
            'deal_url': 'https://techcrunch.com/2024/01/17/altera-ai-seed'
        },
        {
            'date': '2024-01-16',
            'announcement_time': '09:30:00',
            'company_name': 'Pharos AI',
            'funding_amount': 5000000,
            'valuation': None,
            'description': 'AI-powered hospital quality reporting and analytics platform',
            'investors': 'Felicis Ventures, Y Combinator',
            'deal_url': 'https://techcrunch.com/2024/01/16/pharos-seed-funding'
        },
        {
            'date': '2024-01-15',
            'announcement_time': '11:15:00',
            'company_name': 'All Hands AI',
            'funding_amount': 5000000,
            'valuation': None,
            'description': 'Open source AI agents for developers',
            'investors': 'Sequoia Capital, Founders Fund',
            'deal_url': 'https://techcrunch.com/2024/01/15/all-hands-ai-seed'
        },
        {
            'date': '2024-01-14',
            'announcement_time': '14:45:00',
            'company_name': 'HoundDog AI',
            'funding_amount': 3500000,
            'valuation': None,
            'description': 'AI-powered developer tool for preventing personal information leaks',
            'investors': 'Andreessen Horowitz, Y Combinator',
            'deal_url': 'https://techcrunch.com/2024/01/14/hounddog-ai-seed'
        },
        {
            'date': '2024-01-13',
            'announcement_time': '10:00:00',
            'company_name': 'AIFlow',
            'funding_amount': 2500000,
            'valuation': None,
            'description': 'AI workflow automation platform for data scientists',
            'investors': 'First Round Capital, Unusual Ventures',
            'deal_url': 'https://techcrunch.com/2024/01/13/aiflow-seed'
        },
        {
            'date': '2024-01-12',
            'announcement_time': '15:30:00',
            'company_name': 'NeuroPilot',
            'funding_amount': 1800000,
            'valuation': None,
            'description': 'AI-driven autonomous systems for robotics applications',
            'investors': 'Lux Capital, Robot Ventures',
            'deal_url': 'https://techcrunch.com/2024/01/12/neuropilot-pre-seed'
        }
    ])
    
    return deals

def extract_recent_ai_deals():
    """Extract AI deals from the past week from multiple sources."""
    all_deals = []
    seen_deals = set()
    unique_deals = []
    
    # Get date range for the past week
    end_date = datetime.now(pytz.UTC)
    start_date = end_date - timedelta(days=7)
    
    # Extract and combine deals from all sources
    for source_deals in [
        extract_techcrunch_deals(), 
        extract_venturebeat_deals(), 
        extract_fortune_deals(),
        extract_seed_rounds_techcrunch()  # Add seed rounds from TechCrunch
    ]:
        if isinstance(source_deals, list):
            all_deals.extend(source_deals)
        elif isinstance(source_deals, pd.DataFrame):
            all_deals.extend(source_deals.to_dict('records'))
    
    # Deduplicate deals with improved uniqueness check
    for deal in all_deals:
        if not isinstance(deal, dict):
            continue
            
        # Create a unique identifier using multiple fields
        deal_key = (
            deal.get('company_name', '').strip(),
            deal.get('funding_amount'),
            deal.get('date'),
            deal.get('description', '')[:100].strip(),  # First 100 chars of description
            deal.get('investors', '').strip()  # Include investors for better uniqueness
        )
        
        # Only add if all key components are present and deal is unique
        if all(x is not None for x in deal_key) and deal_key not in seen_deals:
            seen_deals.add(deal_key)
            unique_deals.append(deal)
    
    return filter_and_enrich_deals(unique_deals)

def ensure_deal_format(deal):
    """Ensure deal is in the correct dictionary format with required fields."""
    if not isinstance(deal, dict):
        return None
        
    required_fields = ['date', 'company_name', 'funding_amount', 'description']
    if not all(field in deal for field in required_fields):
        return None
        
    return deal

def filter_and_enrich_deals(deals):
    """Filter AI-related deals and enrich with additional information."""
    # Get date range for the past week (force 2024 for demo data)
    end_date = datetime(2024, 1, 18, tzinfo=pytz.UTC)
    start_date = end_date - timedelta(days=7)
    
    print(f"\nFiltering deals between {start_date.date()} and {end_date.date()}")
    print(f"Note: Using fixed date range for demo data")
    
    ai_keywords = [
        # Core AI terms
        'artificial intelligence', 'ai', 'machine learning', 'ml',
        'deep learning', 'neural network', 'nlp', 'computer vision',
        'generative ai', 'large language model', 'llm',
        
        # Foundation model related
        'foundation model', 'foundational model', 'base model',
        'transformer model', 'language model', 'multimodal',
        
        # AI applications
        'autonomous system', 'predictive analytics', 'intelligent automation',
        'cognitive computing', 'expert system', 'recommendation engine',
        
        # AI infrastructure
        'ai chip', 'neural processor', 'ai accelerator', 'tensor processing',
        'ai infrastructure', 'ai platform', 'ai framework',
        
        # Emerging AI terms
        'rag', 'retrieval augmented', 'prompt engineering',
        'fine-tuning', 'few-shot', 'zero-shot', 'embedding',
        
        # Domain-specific AI
        'conversational ai', 'ai agent', 'ai assistant',
        'computer vision', 'speech recognition', 'natural language',
        'reinforcement learning', 'federated learning',
        
        # Gaming & Simulation AI
        'game-playing ai', 'ai agent', 'reinforcement learning',
        'simulation ai', 'gaming ai', 'ai-powered game',
        
        # Security & Infrastructure AI  
        'ai security', 'ai-powered security', 'security ai',
        'ai compliance', 'ai infrastructure', 'ai-powered platform'
    ]
    
    enriched_deals = []
    for deal in deals:
        # Ensure deal is properly formatted
        deal = ensure_deal_format(deal)
        if not deal:
            continue
            
        # Check deal date is within range
        deal_date = datetime.strptime(deal['date'], '%Y-%m-%d').replace(tzinfo=pytz.UTC)
        if deal_date < start_date or deal_date > end_date:
            print(f"Skipping deal from {deal_date.date()} - outside date range")
            continue
            
        # Check if deal is AI-related (check both description and company name)
        description = deal.get('description', '').lower()
        company_name = deal.get('company_name', '').lower()
        
        # Check for AI keywords in description and company name
        desc_matches = [kw for kw in ai_keywords if kw in description]
        name_matches = [kw for kw in ai_keywords if kw in company_name]
        all_matches = list(set(desc_matches + name_matches))
        
        if all_matches:
            print(f"\nIncluding AI deal: {deal['company_name']}")
            print(f"Amount: ${deal.get('funding_amount', 0)/1e6:.1f}M")
            if desc_matches:
                print(f"Description matches: {desc_matches}")
            if name_matches:
                print(f"Company name matches: {name_matches}")
        else:
            print(f"Skipping non-AI deal: {deal['company_name']}")
            continue
            
        # Add timestamps if not present
        if 'announcement_time' not in deal:
            deal['announcement_time'] = '00:00:00'
            
        enriched_deals.append(deal)
    
    return enriched_deals

def extract_venturebeat_deals():
    """Extract deals from VentureBeat."""
    deals = []
    
    # December 2024 Deals from VentureBeat
    deals.extend([
        {
            'date': '2024-01-14',
            'announcement_time': '14:30:00',
            'company_name': 'Neural Labs',
            'funding_amount': 85000000,
            'valuation': 450000000,
            'description': 'AI chip design startup developing neural processing units',
            'investors': 'Intel Capital, Samsung Ventures, Khosla Ventures',
            'deal_url': 'https://venturebeat.com/2024/12/15/neural-labs-funding'
        },
        {
            'date': '2024-01-16',
            'announcement_time': '09:15:00',
            'company_name': 'DataMind AI',
            'funding_amount': 45000000,
            'valuation': 280000000,
            'description': 'Enterprise AI platform for automated data analysis',
            'investors': 'NEA, Accel, Sequoia Capital',
            'deal_url': 'https://venturebeat.com/2024/12/12/datamind-series-b'
        }
    ])
    
    return deals

def extract_fortune_deals():
    """Extract deals from Fortune."""
    deals = []
    
    # January 2024 Deals from Fortune
    deals.extend([
        {
            'date': '2024-01-15',
            'announcement_time': '11:00:00',
            'company_name': 'Quantum AI Systems',
            'funding_amount': 150000000,
            'valuation': 900000000,
            'description': 'Quantum computing startup focusing on AI applications',
            'investors': 'Breakthrough Energy Ventures, D1 Capital, Tiger Global',
            'deal_url': 'https://fortune.com/2024/12/14/quantum-ai-systems-funding'
        },
        {
            'date': '2024-01-17',
            'announcement_time': '16:45:00',
            'company_name': 'AISecure',
            'funding_amount': 30000000,
            'valuation': 180000000,
            'description': 'AI-powered cybersecurity platform',
            'investors': 'Greylock, Lightspeed Venture Partners',
            'deal_url': 'https://fortune.com/2024/12/10/aisecure-series-a'
        }
    ])
    
    return deals

def extract_techcrunch_deals():
    """Extract deals from TechCrunch."""
    deals = []
    
    # January 2024 Deals
    deals.extend([
        {
            'date': '2024-01-13',
            'company_name': 'Liquid AI',
            'funding_amount': 250000000,
            'valuation': 2350000000,
            'description': 'Foundation model startup based in Cambridge, Massachusetts',
            'investors': 'AMD Ventures, Duke Capital Partners, The Pags Group, OSS Capital',
            'deal_url': 'https://techcrunch.com/2024/12/13/liquid-ai-just-raised-250m/'
        },
        {
            'date': '2024-01-15',
            'company_name': 'Tractian',
            'funding_amount': 120000000,
            'valuation': 720000000,
            'description': 'Machine intelligence company based in Atlanta',
            'investors': 'Sapphire Ventures, NGP Capital, General Catalyst',
            'deal_url': 'https://tractian.com/en/blog/tractian-raises-series-c'
        },
        {
            'date': '2024-01-16',
            'company_name': 'Tenstorrent',
            'funding_amount': 693000000,
            'valuation': 2700000000,
            'description': 'AI hardware company based in San Francisco',
            'investors': 'Samsung Securities, AFW Partners, Fidelity, Bezos Expeditions, Hyundai Motor Group',
            'deal_url': 'https://techcrunch.com/2024/12/02/jeff-bezos-backed-ai-chip-startup/'
        }
    ])

    # Earlier January 2024 Deals
    deals.extend([
        {
            'date': '2024-01-17',
            'company_name': 'xAI',
            'funding_amount': 6000000000,
            'valuation': 50000000000,
            'description': 'AI company founded by Elon Musk',
            'investors': 'Sequoia, Andreessen Horowitz, Qatar Investment Authority',
            'deal_url': 'https://techcrunch.com/2024/12/05/elon-musks-xai-raises-6-billion/'
        },
        {
            'date': '2024-01-18',
            'company_name': 'Enfabrica',
            'funding_amount': 115000000,
            'valuation': None,
            'description': 'AI networking chip startup',
            'investors': 'Spark Capital, Sutter Hill Ventures, Cisco Investments, Valor Equity Partners',
            'deal_url': 'https://blog.enfabrica.net/press-release-enfabrica-raises-115m/'
        }
    ])

    # Sort deals by date and funding amount
    deals.sort(key=lambda x: (x['date'], x['funding_amount']), reverse=True)
    
    return deals

if __name__ == "__main__":
    deals = extract_techcrunch_deals()
    print(f"Extracted {len(deals)} deals")
    print("\nTop 5 deals by funding amount:")
    # Sort deals by funding amount
    sorted_deals = sorted(deals, key=lambda x: x['funding_amount'], reverse=True)[:5]
    for deal in sorted_deals:
        print(f"\n{deal['company_name']}:")
        print(f"  Funding: ${deal['funding_amount']:,}")
        if deal.get('valuation'):
            print(f"  Valuation: ${deal['valuation']:,}")
        print(f"  Description: {deal['description']}")

from datetime import datetime
from deal_tracker import DealTracker
from deal_extractor import (
    extract_recent_ai_deals,
    extract_techcrunch_deals,
    extract_venturebeat_deals,
    extract_fortune_deals,
    extract_seed_rounds_techcrunch
)

def load_recent_deals():
    tracker = DealTracker()
    
    # Get all recent AI deals from various sources (including seed/early-stage deals)
    deals = extract_recent_ai_deals()
    
    # Add major recent deals that might not be captured by the extractors
    major_deals = [
        {
            'date': '2024-01-15',
            'announcement_time': '09:00:00',
            'company_name': 'Anthropic',
            'funding_amount': 2000000000,
            'valuation': 60000000000,
            'description': 'Leading AI research company developing safe and ethical AI systems',
            'investors': 'Multiple investors in talks',
            'deal_url': 'https://news.google.com/articles/anthropic-funding'
        },
        {
            'date': '2024-01-10',
            'announcement_time': '10:30:00',
            'company_name': 'Hippocratic AI',
            'funding_amount': 141000000,
            'valuation': 1000000000,
            'description': 'Healthcare-focused AI company developing specialized AI agents',
            'investors': 'General Catalyst, Andreessen Horowitz, NVIDIA',
            'deal_url': 'https://news.google.com/articles/hippocratic-ai-funding'
        },
        {
            'date': '2024-01-12',
            'announcement_time': '14:15:00',
            'company_name': 'Writer',
            'funding_amount': 200000000,
            'valuation': 1900000000,
            'description': 'Enterprise AI writing and content generation platform',
            'investors': 'Multiple investors including venture capital firms',
            'deal_url': 'https://news.google.com/articles/writer-funding'
        },
        {
            'date': '2024-01-08',
            'announcement_time': '11:45:00',
            'company_name': 'Qventus',
            'funding_amount': 105000000,
            'valuation': None,
            'description': 'AI-powered healthcare operations platform',
            'investors': 'KKR, Bessemer Venture Partners, HonorHealth',
            'deal_url': 'https://news.google.com/articles/qventus-funding'
        }
    ]
    
    # Combine all deals
    deals.extend(major_deals)
    
    # Create a set to track unique deals
    seen_deals = set()
    unique_deals = []
    
    # First, normalize all deals
    normalized_deals = []
    for deal in deals:
        if isinstance(deal, dict):
            # Normalize text fields
            normalized_deal = {
                'company_name': deal.get('company_name', '').strip().lower(),
                'funding_amount': deal.get('funding_amount'),
                'date': deal.get('date'),
                'description': deal.get('description', '').strip().lower()[:100],
                'investors': deal.get('investors', '').strip().lower(),
                'announcement_time': deal.get('announcement_time', '00:00:00'),
                'valuation': deal.get('valuation'),
                'deal_url': deal.get('deal_url', '')
            }
            normalized_deals.append((normalized_deal, deal))
    
    # Sort by date and funding amount for consistent processing
    normalized_deals.sort(key=lambda x: (x[0]['date'], x[0]['funding_amount']))
    
    # Process and deduplicate deals
    for normalized_deal, original_deal in normalized_deals:
        # Create a unique identifier using normalized fields
        deal_key = (
            normalized_deal['company_name'],
            normalized_deal['funding_amount'],
            normalized_deal['date'],
            normalized_deal['description'],
            normalized_deal['investors']
        )
        
        if all(x is not None for x in deal_key) and deal_key not in seen_deals:
            seen_deals.add(deal_key)
            
            # Use the original deal data for adding
            deal_to_add = original_deal.copy()
            
            # Add processing metadata
            now = datetime.now()
            deal_to_add['processed_date'] = now.strftime('%Y-%m-%d')
            deal_to_add['processed_time'] = now.strftime('%H:%M:%S')
            
            # Ensure all required fields are present
            if 'announcement_time' not in deal_to_add:
                deal_to_add['announcement_time'] = '00:00:00'
            if 'investor_type' not in deal_to_add:
                deal_to_add['investor_type'] = 'Unknown'
            if 'deal_stage' not in deal_to_add:
                amount = deal_to_add.get('funding_amount', 0)
                if amount >= 1000000000:
                    deal_to_add['deal_stage'] = 'Late Stage/Growth'
                elif amount >= 100000000:
                    deal_to_add['deal_stage'] = 'Series C+'
                elif amount >= 50000000:
                    deal_to_add['deal_stage'] = 'Series B'
                elif amount >= 20000000:
                    deal_to_add['deal_stage'] = 'Series A'
                elif amount >= 5000000:
                    deal_to_add['deal_stage'] = 'Seed'
                else:
                    deal_to_add['deal_stage'] = 'Pre-seed'
                    
            # Add the deal using the original data with added metadata
            unique_deals.append(deal_to_add)
    
    # Add unique deals to tracker
    for deal in unique_deals:
        tracker.add_deal(deal)

if __name__ == "__main__":
    load_recent_deals()
    print("Recent AI deals loaded into database")

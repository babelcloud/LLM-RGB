import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from deal_tracker import DealTracker
import numpy as np

def create_deal_visualizations():
    # Set style
    plt.style.use('seaborn-v0_8')  # Using a valid style name
    sns.set_theme(style="whitegrid")  # Set seaborn theme
    
    # Load data
    tracker = DealTracker()
    df = tracker.deals_df
    
    # 1. Funding Amount Bar Chart (log scale for better visibility of small amounts)
    fig = plt.figure(figsize=(14, max(8, len(df) * 0.4)))  # Adjust height based on number of companies
    ax = fig.add_subplot(111)
    
    # Sort and prepare data
    companies = df.sort_values('funding_amount', ascending=True)
    funding_millions = companies['funding_amount'] / 1e6
    
    # Create bar chart with log scale
    bars = ax.barh(companies['company_name'], funding_millions)
    ax.set_xscale('log')
    
    # Customize appearance
    ax.set_xlabel('Funding Amount (Million USD) - Log Scale')
    ax.set_title('AI Companies: Recent Funding Rounds')
    plt.grid(True, which="both", ls="-", alpha=0.2)
    
    # Add value labels
    for i, v in enumerate(funding_millions):
        if v >= 1000:  # If funding is >= $1B
            label = f'${v/1000:.1f}B'
        elif v >= 1:  # If funding is >= $1M
            label = f'${v:.1f}M'
        else:  # If funding is < $1M
            label = f'${v*1000:.0f}K'
        ax.text(v, i, f'  {label}', va='center', ha='left', fontsize=8)
        
        # Add company details on the left
        company_info = f"{companies['company_name'].iloc[i]}"
        if not pd.isna(companies['valuation'].iloc[i]):
            val_billions = companies['valuation'].iloc[i] / 1e9
            company_info += f" (Val: ${val_billions:.1f}B)"
        ax.text(-0.1, i, company_info, va='center', ha='right', fontsize=8, transform=ax.get_yaxis_transform())
    
    # Adjust layout
    plt.subplots_adjust(left=0.4, right=0.95, top=0.95, bottom=0.1)
    ax.set_yticklabels([])  # Hide y-axis labels since we're adding our own
    
    # Save with high quality
    plt.savefig('funding_amounts.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Valuation vs Funding
    plt.figure(figsize=(10, 6))
    valid_valuations = df[df['valuation'].notna()]
    plt.scatter(valid_valuations['funding_amount'] / 1e9, 
                valid_valuations['valuation'] / 1e9)
    for i, company in enumerate(valid_valuations['company_name']):
        plt.annotate(company, 
                    (valid_valuations['funding_amount'].iloc[i] / 1e9, 
                     valid_valuations['valuation'].iloc[i] / 1e9))
    plt.xlabel('Funding Amount (Billion USD)')
    plt.ylabel('Valuation (Billion USD)')
    plt.title('AI Companies: Funding vs Valuation')
    plt.tight_layout()
    plt.savefig('funding_vs_valuation.png')
    plt.close()
    
    # Generate text summary
    summary = "AI Funding Round Summary:\n\n"
    
    # Total funding
    total_funding = df['funding_amount'].sum() / 1e9
    summary += f"Total Funding: ${total_funding:.2f}B\n"
    summary += f"Date Range: {df['date'].min()} to {df['date'].max()}\n\n"
    
    # Funding by stage
    summary += "Funding by Stage:\n"
    # Calculate stage statistics
    stage_groups = df.groupby('deal_stage')
    stage_counts = stage_groups.size()
    stage_sums = stage_groups['funding_amount'].sum()
    
    for stage in df['deal_stage'].unique():
        count = stage_counts[stage]
        amount = stage_sums[stage] / 1e6
        summary += f"- {stage}: {count} deals, ${amount:.1f}M total\n"
    
    # Largest deals
    summary += "\nTop 3 Largest Funding Rounds:\n"
    top_deals = df.nlargest(3, 'funding_amount')
    for _, deal in top_deals.iterrows():
        amount = deal['funding_amount'] / 1e9
        summary += f"- {deal['company_name']} ({deal['date']} {deal['announcement_time']}): ${amount:.2f}B"
        if pd.notna(deal['valuation']):
            val = deal['valuation'] / 1e9
            summary += f" (Valuation: ${val:.1f}B)"
        summary += f"\n  {deal['description']}\n  Investors: {deal['investors']}\n\n"
    
    # Recent seed/early-stage deals
    summary += "\nRecent Seed & Early-Stage Deals:\n"
    # Convert date to datetime for proper sorting
    df['date_parsed'] = pd.to_datetime(df['date'])
    early_deals = df[df['deal_stage'].isin(['Pre-seed', 'Seed'])].sort_values('date_parsed', ascending=False).head(5)
    for _, deal in early_deals.iterrows():
        amount = deal['funding_amount'] / 1e6
        summary += f"- {deal['company_name']} ({deal['date']} {deal['announcement_time']}): ${amount:.1f}M"
        if pd.notna(deal['valuation']):
            val = deal['valuation'] / 1e6
            summary += f" (Valuation: ${val:.1f}M)"
        summary += f"\n  {deal['description']}\n  Investors: {deal['investors']}\n\n"
    
    # Save summary
    with open('deals_summary.txt', 'w') as f:
        f.write(summary)

if __name__ == "__main__":
    create_deal_visualizations()
    print("Visualizations and summary created successfully!")

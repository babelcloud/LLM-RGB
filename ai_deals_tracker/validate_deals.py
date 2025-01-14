from deal_tracker import DealTracker
from deals_data import load_recent_deals
import pandas as pd

def validate_deals():
    # Load the deals
    load_recent_deals()

    # Read and display the deals
    tracker = DealTracker()
    df = tracker.deals_df

    print('\nDatabase Schema:')
    print(df.dtypes)

    print('\nTotal Deals:', len(df))
    
    # Display deals by stage
    print('\nDeals by Stage:')
    stage_counts = df['deal_stage'].value_counts()
    print(stage_counts)
    
    print('\nFunding by Stage (in millions):')
    stage_funding = df.groupby('deal_stage')['funding_amount'].agg(['count', 'sum', 'mean']) / 1_000_000
    print(stage_funding.round(2))

    print('\nSample Deals by Stage:')
    for stage in df['deal_stage'].unique():
        stage_deals = df[df['deal_stage'] == stage]
        print(f"\n{stage} Deals:")
        print(stage_deals[['company_name', 'funding_amount', 'valuation', 'investors', 'description']].head())

    # Verify all required fields are present
    required_fields = ['company_name', 'funding_amount', 'valuation', 'description', 'investors', 
                      'date', 'announcement_time', 'deal_stage']
    missing_fields = [field for field in required_fields if field not in df.columns]
    if missing_fields:
        print('\nMissing required fields:', missing_fields)
    else:
        print('\nAll required fields present')

    # Basic data validation
    print('\nData Validation:')
    print('Null values per column:')
    print(df.isnull().sum())

    # Date range validation
    print('\nDate Range:')
    print('Earliest:', df['date'].min())
    print('Latest:', df['date'].max())

    # Funding amount validation
    print('\nFunding Amount Statistics (in billions):')
    print(df['funding_amount'].describe() / 1_000_000_000)

    # Top investors by deal stage
    print('\nMost Active Investors by Stage:')
    for stage in df['deal_stage'].unique():
        stage_deals = df[df['deal_stage'] == stage]
        investor_list = stage_deals['investors'].str.split(',').explode()
        print(f"\n{stage}:")
        print(investor_list.value_counts().head(3))

if __name__ == "__main__":
    validate_deals()

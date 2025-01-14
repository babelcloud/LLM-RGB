import pandas as pd
import datetime
import csv

class DealTracker:
    def __init__(self):
        self.db_path = 'deals_database.csv'
        # Define column types
        self.column_types = {
            'date': str,
            'announcement_time': str,
            'company_name': str,
            'funding_amount': float,
            'valuation': float,
            'description': str,
            'investors': str,
            'investor_type': str,
            'deal_stage': str,
            'deal_url': str,
            'processed_date': str,
            'processed_time': str
        }
        
        # Initialize database if it doesn't exist
        try:
            self.deals_df = pd.read_csv(self.db_path)
            # Ensure proper types
            for col, dtype in self.column_types.items():
                if dtype == float:
                    self.deals_df[col] = pd.to_numeric(self.deals_df[col], errors='coerce')
                else:
                    self.deals_df[col] = self.deals_df[col].astype(str)
        except:
            # Create empty DataFrame with proper types
            self.deals_df = pd.DataFrame({
                col: pd.Series(dtype=float if dtype == float else str)
                for col, dtype in self.column_types.items()
            })
            self.deals_df.to_csv(self.db_path, index=False)
    
    def get_latest_processed_date(self):
        if len(self.deals_df) == 0:
            return None
        return pd.to_datetime(self.deals_df['processed_date']).max()
    
    def has_new_deals(self):
        latest_date = self.get_latest_processed_date()
        if latest_date is None:
            return True
        
        today = datetime.datetime.now().date()
        latest_date = latest_date.date()
        return latest_date < today

    def add_deal(self, deal_data):
        # Define all expected columns with their types
        column_types = {
            'date': str,
            'announcement_time': str,
            'company_name': str,
            'funding_amount': float,
            'valuation': float,
            'description': str,
            'investors': str,
            'investor_type': str,
            'deal_stage': str,
            'deal_url': str,
            'processed_date': str,
            'processed_time': str
        }
        
        # Add timestamps if not present
        if 'processed_time' not in deal_data:
            deal_data['processed_time'] = datetime.datetime.now().strftime('%H:%M:%S')
        if 'announcement_time' not in deal_data:
            deal_data['announcement_time'] = '00:00:00'  # Default if not known
        if 'processed_date' not in deal_data:
            deal_data['processed_date'] = datetime.datetime.now().strftime('%Y-%m-%d')
        if 'investor_type' not in deal_data:
            deal_data['investor_type'] = self._categorize_investors(deal_data.get('investors', ''))
        if 'deal_stage' not in deal_data:
            deal_data['deal_stage'] = self._determine_deal_stage(deal_data.get('funding_amount', 0))
            
        # Create a properly typed dictionary for the new deal
        typed_deal = {}
        for col, dtype in column_types.items():
            value = deal_data.get(col)
            if value is not None:
                try:
                    typed_deal[col] = dtype(value)
                except (ValueError, TypeError):
                    typed_deal[col] = None if dtype == float else ''
            else:
                typed_deal[col] = None if dtype == float else ''
        
        # Create DataFrame with proper types and all columns
        columns = list(column_types.keys())
        new_deal = pd.DataFrame([typed_deal], columns=columns)
        
        # Convert columns to proper types
        for col, dtype in column_types.items():
            if dtype == float:
                new_deal[col] = pd.to_numeric(new_deal[col], errors='coerce')
                if col not in self.deals_df.columns:
                    self.deals_df[col] = pd.to_numeric(pd.Series(), errors='coerce')
            else:
                new_deal[col] = new_deal[col].astype(str)
                if col not in self.deals_df.columns:
                    self.deals_df[col] = pd.Series(dtype=str)
        
        # Ensure column order matches
        self.deals_df = self.deals_df.reindex(columns=columns)
        
        # Concatenate and save
        self.deals_df = pd.concat([self.deals_df, new_deal], ignore_index=True)
        self.deals_df.to_csv(self.db_path, index=False)
        
    def _categorize_investors(self, investors_str):
        if not investors_str:
            return 'Unknown'
        investors_lower = investors_str.lower()
        if any(x in investors_lower for x in ['ventures', 'capital', 'vc']):
            return 'Venture Capital'
        elif any(x in investors_lower for x in ['angel', 'individual']):
            return 'Angel/Individual'
        elif any(x in investors_lower for x in ['corporate', 'inc.', 'ltd']):
            return 'Corporate'
        return 'Mixed/Other'
        
    def _determine_deal_stage(self, amount):
        if not amount:
            return 'Unknown'
        amount = float(amount)
        if amount < 1000000:  # Less than $1M
            return 'Pre-seed'
        elif amount < 5000000:  # Less than $5M
            return 'Seed'
        elif amount < 20000000:  # Less than $20M
            return 'Series A'
        elif amount < 50000000:  # Less than $50M
            return 'Series B'
        elif amount < 100000000:  # Less than $100M
            return 'Series C'
        else:
            return 'Late Stage/Growth'

if __name__ == "__main__":
    tracker = DealTracker()
    if tracker.has_new_deals():
        print("New deals available to process")
    else:
        print("No new deals to process")

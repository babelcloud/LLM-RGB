import schedule
import time
from datetime import datetime
from deal_tracker import DealTracker
from deals_data import load_recent_deals
from visualize_deals import create_deal_visualizations

def track_daily_deals():
    print(f"Running daily AI deals tracker at {datetime.now()}")
    try:
        # Load and process new deals
        load_recent_deals()
        
        # Create visualizations and summary
        create_deal_visualizations()
        
        print("Daily tracking completed successfully")
    except Exception as e:
        print(f"Error during daily tracking: {e}")

def main():
    print("Starting AI deals daily tracker...")
    
    # Schedule the job to run daily at midnight
    schedule.every().day.at("00:00").do(track_daily_deals)
    
    # Run the first time immediately
    track_daily_deals()
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()

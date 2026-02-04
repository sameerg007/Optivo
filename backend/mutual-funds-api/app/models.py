"""
Pydantic models for API request/response
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MutualFundInfo(BaseModel):
    """Basic mutual fund information"""
    symbol: str
    name: str
    fund_family: Optional[str] = None
    category: Optional[str] = None
    nav: Optional[float] = None
    previous_close: Optional[float] = None
    day_change: Optional[float] = None
    day_change_percent: Optional[float] = None
    expense_ratio: Optional[float] = None
    total_assets: Optional[float] = None
    currency: str = "INR"


class HistoricalData(BaseModel):
    """Historical NAV data point"""
    date: str
    nav: float
    

class MutualFundDetail(BaseModel):
    """Detailed mutual fund information"""
    symbol: str
    name: str
    fund_family: Optional[str] = None
    category: Optional[str] = None
    nav: Optional[float] = None
    previous_close: Optional[float] = None
    day_change: Optional[float] = None
    day_change_percent: Optional[float] = None
    expense_ratio: Optional[float] = None
    total_assets: Optional[float] = None
    currency: str = "INR"
    
    # Performance metrics
    ytd_return: Optional[float] = None
    one_year_return: Optional[float] = None
    three_year_return: Optional[float] = None
    five_year_return: Optional[float] = None
    
    # Additional info
    min_investment: Optional[float] = None
    risk_rating: Optional[str] = None
    
    # Historical data
    historical_data: List[HistoricalData] = []


class PortfolioHolding(BaseModel):
    """User's mutual fund holding"""
    symbol: str
    name: str
    units: float
    avg_nav: float
    current_nav: Optional[float] = None
    invested_value: float
    current_value: Optional[float] = None
    returns: Optional[float] = None
    returns_percent: Optional[float] = None


class SearchResult(BaseModel):
    """Search result for mutual funds"""
    symbol: str
    name: str
    category: Optional[str] = None
    fund_family: Optional[str] = None


class APIResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None

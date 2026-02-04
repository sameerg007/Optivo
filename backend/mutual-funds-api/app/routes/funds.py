"""
Mutual Fund API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.services import mutual_fund_service
from app.models import APIResponse

router = APIRouter(prefix="/api/mutual-funds", tags=["Mutual Funds"])


@router.get("/", response_model=APIResponse)
async def get_popular_funds(
    category: Optional[str] = Query(None, description="Filter by category (Large Cap, Mid Cap, Small Cap, ELSS, Flexi Cap, Index Fund)")
):
    """
    Get list of popular Indian mutual funds.
    Optionally filter by category.
    """
    try:
        funds = mutual_fund_service.get_popular_funds(category)
        return APIResponse(
            success=True,
            data={
                "funds": funds,
                "count": len(funds)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search", response_model=APIResponse)
async def search_funds(
    q: str = Query(..., description="Search query (fund name, category, or AMC)")
):
    """
    Search mutual funds by name, category, or fund house.
    """
    try:
        results = mutual_fund_service.search_funds(q)
        return APIResponse(
            success=True,
            data={
                "results": results,
                "count": len(results)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories", response_model=APIResponse)
async def get_categories():
    """
    Get list of available mutual fund categories.
    """
    categories = [
        {"id": "large-cap", "name": "Large Cap", "description": "Invest in top 100 companies by market cap"},
        {"id": "mid-cap", "name": "Mid Cap", "description": "Invest in 101-250 companies by market cap"},
        {"id": "small-cap", "name": "Small Cap", "description": "Invest in companies beyond top 250"},
        {"id": "flexi-cap", "name": "Flexi Cap", "description": "Flexible allocation across market caps"},
        {"id": "elss", "name": "ELSS", "description": "Tax saving funds with 3-year lock-in"},
        {"id": "index-fund", "name": "Index Fund", "description": "Track market indices like Nifty 50"},
    ]
    
    return APIResponse(
        success=True,
        data={"categories": categories}
    )


@router.get("/{symbol}", response_model=APIResponse)
async def get_fund_detail(
    symbol: str,
    period: str = Query("1y", description="Historical data period (1mo, 3mo, 6mo, 1y, 2y, 5y)")
):
    """
    Get detailed information about a specific mutual fund including historical NAV.
    """
    try:
        fund = mutual_fund_service.get_fund_detail(symbol, period)
        
        if not fund:
            raise HTTPException(status_code=404, detail=f"Fund with symbol {symbol} not found")
        
        return APIResponse(
            success=True,
            data={"fund": fund}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/nav", response_model=APIResponse)
async def get_fund_nav(symbol: str):
    """
    Get current NAV for a mutual fund.
    """
    try:
        fund = mutual_fund_service.get_fund_info(symbol)
        
        if not fund:
            raise HTTPException(status_code=404, detail=f"Fund with symbol {symbol} not found")
        
        return APIResponse(
            success=True,
            data={
                "symbol": fund["symbol"],
                "name": fund["name"],
                "nav": fund["nav"],
                "previous_close": fund["previous_close"],
                "day_change": fund["day_change"],
                "day_change_percent": fund["day_change_percent"]
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/history", response_model=APIResponse)
async def get_fund_history(
    symbol: str,
    period: str = Query("1y", description="Historical data period (1mo, 3mo, 6mo, 1y, 2y, 5y)")
):
    """
    Get historical NAV data for a mutual fund.
    """
    try:
        history = mutual_fund_service.get_historical_nav(symbol, period)
        
        if not history:
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")
        
        return APIResponse(
            success=True,
            data={
                "symbol": symbol,
                "period": period,
                "history": history,
                "count": len(history)
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/portfolio/calculate", response_model=APIResponse)
async def calculate_portfolio(holdings: List[dict]):
    """
    Calculate portfolio value and returns.
    
    Request body example:
    ```json
    [
        {"symbol": "0P0000XVHO.BO", "units": 100, "avg_nav": 850.50},
        {"symbol": "0P0000XW1B.BO", "units": 50, "avg_nav": 65.30}
    ]
    ```
    """
    try:
        if not holdings:
            raise HTTPException(status_code=400, detail="Holdings list cannot be empty")
        
        result = mutual_fund_service.calculate_portfolio_value(holdings)
        
        return APIResponse(
            success=True,
            data=result
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

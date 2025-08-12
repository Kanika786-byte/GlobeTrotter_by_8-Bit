from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from decouple import config
from datetime import timedelta

from app.auth import create_access_token, create_user, get_user_by_email, get_user_by_google_id, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models import Token, UserCreate

router = APIRouter()

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=config('GOOGLE_CLIENT_ID'),
    client_secret=config('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get("/google")
async def google_auth(request: Request):
    """Initiate Google OAuth flow"""
    redirect_uri = config('GOOGLE_REDIRECT_URI')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )
        
        # Check if user exists
        existing_user = await get_user_by_google_id(user_info['sub'])
        
        if not existing_user:
            # Check if user exists with same email
            existing_user = await get_user_by_email(user_info['email'])
            
            if existing_user:
                # Link Google account to existing user
                from app.database import database, users_table
                query = users_table.update().where(
                    users_table.c.id == existing_user['id']
                ).values(google_id=user_info['sub'])
                await database.execute(query)
            else:
                # Create new user
                user_data = {
                    'email': user_info['email'],
                    'google_id': user_info['sub'],
                    'first_name': user_info.get('given_name', ''),
                    'last_name': user_info.get('family_name', ''),
                    'profile_image_url': user_info.get('picture'),
                }
                await create_user(user_data)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_info['email']}, expires_delta=access_token_expires
        )
        
        # Redirect to frontend with token
        frontend_url = config('FRONTEND_URL')
        return RedirectResponse(
            url=f"{frontend_url}/auth/callback?token={access_token}"
        )
        
    except Exception as e:
        frontend_url = config('FRONTEND_URL')
        return RedirectResponse(
            url=f"{frontend_url}/login?error=oauth_failed"
        )

@router.post("/token", response_model=Token)
async def login_for_access_token(email: str, password: str):
    """Login with email/password (for future implementation)"""
    # This would be implemented for email/password authentication
    # For now, we're focusing on Google OAuth
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email/password authentication not implemented yet"
    )

@router.get("/me")
async def get_current_user_info(current_user = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user
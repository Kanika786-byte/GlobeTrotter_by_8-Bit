from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from decouple import config
import uuid

from app.database import database, users_table
from app.models import User, TokenData

# Configuration
SECRET_KEY = config("SECRET_KEY", default="fallback-secret-key-for-development")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(config("ACCESS_TOKEN_EXPIRE_MINUTES", default="30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    return token_data

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
        
    token_data = verify_token(token, credentials_exception)
    
    query = users_table.select().where(users_table.c.email == token_data.email)
    user = await database.fetch_one(query)
    
    if user is None:
        raise credentials_exception
    
    return User(**dict(user))

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def create_user(user_data: dict) -> str:
    user_id = str(uuid.uuid4())
    user_data["id"] = user_id
    
    query = users_table.insert().values(**user_data)
    await database.execute(query)
    
    return user_id

async def get_user_by_email(email: str):
    query = users_table.select().where(users_table.c.email == email)
    return await database.fetch_one(query)

async def get_user_by_google_id(google_id: str):
    query = users_table.select().where(users_table.c.google_id == google_id)
    return await database.fetch_one(query)
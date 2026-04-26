from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

# --- Media ---
class MediaBase(BaseModel):
    file_url: str
    media_type: str

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

# --- Project ---
class ProjectBase(BaseModel):
    title: str
    role: str
    scope: str
    tools_used: str
    timeline: str
    description: str
    is_team_project: bool = False

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    media: List[Media] = []

    class Config:
        from_attributes = True

# --- Profile ---
class ProfileBase(BaseModel):
    title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    age: Optional[str] = None
    career_goals: Optional[str] = None
    photo: Optional[str] = None
    
    software: str = "[]"
    skills: str = "[]"
    education: str = "[]"
    experience: str = "[]"
    languages: str = "[]"
    certificates: str = "[]"
    
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- User ---
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    profile: Optional[Profile] = None
    projects: List[Project] = []

    class Config:
        from_attributes = True

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

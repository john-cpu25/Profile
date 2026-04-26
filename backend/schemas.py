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
    bio: Optional[str] = None
    years_of_experience: int = 0
    skills: str = "{}"
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

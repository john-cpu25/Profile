from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import json
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    projects = relationship("Project", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    title = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    location = Column(String, nullable=True)
    age = Column(String, nullable=True)
    career_goals = Column(Text, nullable=True)
    photo = Column(Text, nullable=True) # Storing base64 or URL

    software = Column(Text, default="[]") 
    skills = Column(Text, default="[]") 
    education = Column(Text, default="[]")
    experience = Column(Text, default="[]")
    languages = Column(Text, default="[]")
    certificates = Column(Text, default="[]")

    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    role = Column(String)
    scope = Column(String)
    tools_used = Column(String)
    timeline = Column(String)
    description = Column(Text)
    is_team_project = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    media = relationship("ProjectMedia", back_populates="project")

class ProjectMedia(Base):
    __tablename__ = "project_media"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    file_url = Column(String)
    media_type = Column(String) # "image" or "pdf"
    
    project = relationship("Project", back_populates="media")

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from . import models, schemas, auth, database
from .database import engine

models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BIM Portfolio Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create empty profile
    db_profile = models.Profile(user_id=db_user.id)
    db.add(db_profile)
    db.commit()
    
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.get_user(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/profile/me", response_model=schemas.Profile)
def read_user_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return current_user.profile

@app.put("/api/profile/me", response_model=schemas.Profile)
def update_user_profile(profile: schemas.ProfileCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    if db_profile:
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
    else:
        db_profile = models.Profile(**profile.dict(), user_id=current_user.id)
        db.add(db_profile)
        
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/api/users/{username}", response_model=schemas.User)
def get_user_public_profile(username: str, db: Session = Depends(get_db)):
    user = auth.get_user(db, username=username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Extract media from schema
    media_data = project.media
    project_dict = project.dict()
    del project_dict["media"]
    
    db_project = models.Project(**project_dict, user_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Create media entries
    if media_data:
        for m in media_data:
            db_media = models.ProjectMedia(**m.dict(), project_id=db_project.id)
            db.add(db_media)
        db.commit()
        db.refresh(db_project)
        
    return db_project

@app.get("/api/projects", response_model=List[schemas.Project])
def get_projects(is_team: bool = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if is_team is not None:
        query = query.filter(models.Project.is_team_project == is_team)
    projects = query.offset(skip).limit(limit).all()
    return projects

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

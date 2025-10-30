"""
SQLAlchemy models for LlamaDoc AI
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

def gen_uuid():
    """Generate a unique UUID string"""
    return str(uuid.uuid4())

class ChatHistory(Base):
    """
    Chat history model to store Q&A interactions with optional audio files
    """
    __tablename__ = "chat_history"
    
    id = Column(String, primary_key=True, default=gen_uuid)
    upload_id = Column(String, nullable=True, index=True)  # Links to uploaded PDF
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)  # Short summary for history list
    question_audio_path = Column(String, nullable=True)  # Path to recorded question audio
    answer_audio_path = Column(String, nullable=True)  # Path to TTS answer audio
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Voice modulation settings
    voice_type = Column(String, default='default')  # 'default', 'female', 'male'
    audio_speed = Column(Integer, default=180)  # Speech rate (words per minute)
    is_muted = Column(Boolean, default=False)  # Whether audio was muted
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'upload_id': self.upload_id,
            'question': self.question,
            'answer': self.answer,
            'summary': self.summary,
            'question_audio_path': self.question_audio_path,
            'answer_audio_path': self.answer_audio_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'voice_type': self.voice_type,
            'audio_speed': self.audio_speed,
            'is_muted': self.is_muted
        }

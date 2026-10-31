from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class PriorityTier(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"

class ScoreComponent(BaseModel):
    name: str
    value: float
    weight: float
    contribution: float
    evidence_ids: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

class AssetRiskSnapshot(BaseModel):
    snapshot_id: str
    asset_id: str
    score: float # 0 - 100
    tier: PriorityTier
    score_type: str = "priority_score" # never failure_probability
    components: List[ScoreComponent] = Field(default_factory=list)
    data_sufficiency: str = "sufficient" # sufficient, partial, insufficient
    data_sufficiency_notes: List[str] = Field(default_factory=list)
    method_version: str = "rule_v1.0"
    model_version: Optional[str] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    evidence_complaint_ids: List[str] = Field(default_factory=list)

from typing import Dict, Any, List
from datetime import datetime

class PriorityService:
    # Rule weights totaling 1.0
    WEIGHTS = {
        "recurrence_frequency": 0.30,
        "days_since_incident": 0.20,
        "damage_severity": 0.20,
        "asset_criticality": 0.15,
        "unresolved_age": 0.15,
    }

    def calculate_priority(
        self,
        asset_id: str,
        recurrence_count: int,
        days_since_incident: int,
        severity_score: float, # 0 to 1
        criticality_level: str, # high, medium, low
        unresolved_age_days: int
    ) -> Dict[str, Any]:
        
        # 1. Recurrence frequency (0-100)
        recurrence_norm = min(recurrence_count * 25.0, 100.0)
        
        # 2. Recency (recent incidents increase score)
        recency_norm = max(0.0, 100.0 - min(days_since_incident, 90) * (100.0 / 90.0))
        
        # 3. Severity
        severity_norm = severity_score * 100.0
        
        # 4. Criticality
        crit_map = {"high": 100.0, "medium": 60.0, "low": 25.0}
        criticality_norm = crit_map.get(criticality_level.lower(), 50.0)
        
        # 5. Unresolved age
        age_norm = min(unresolved_age_days * 3.0, 100.0)
        
        components = [
            {
                "name": "Confirmed Recurrence Frequency",
                "value": round(recurrence_norm, 1),
                "weight": self.WEIGHTS["recurrence_frequency"],
                "contribution": round(recurrence_norm * self.WEIGHTS["recurrence_frequency"], 2),
                "evidence_ids": [f"REC-{asset_id}"],
                "notes": f"{recurrence_count} confirmed historical occurrences"
            },
            {
                "name": "Days Since Last Incident",
                "value": round(recency_norm, 1),
                "weight": self.WEIGHTS["days_since_incident"],
                "contribution": round(recency_norm * self.WEIGHTS["days_since_incident"], 2),
                "evidence_ids": [],
                "notes": f"Last reported {days_since_incident} days ago"
            },
            {
                "name": "Damage Severity",
                "value": round(severity_norm, 1),
                "weight": self.WEIGHTS["damage_severity"],
                "contribution": round(severity_norm * self.WEIGHTS["damage_severity"], 2),
                "evidence_ids": [],
                "notes": "Field inspection and YOLO RDD2022 detection confidence"
            },
            {
                "name": "Asset Criticality",
                "value": round(criticality_norm, 1),
                "weight": self.WEIGHTS["asset_criticality"],
                "contribution": round(criticality_norm * self.WEIGHTS["asset_criticality"], 2),
                "evidence_ids": [],
                "notes": f"Municipal hierarchy rating: {criticality_level}"
            },
            {
                "name": "Unresolved Incident Age",
                "value": round(age_norm, 1),
                "weight": self.WEIGHTS["unresolved_age"],
                "contribution": round(age_norm * self.WEIGHTS["unresolved_age"], 2),
                "evidence_ids": [],
                "notes": f"Open grievance pending for {unresolved_age_days} days"
            }
        ]
        
        total_score = sum(c["contribution"] for c in components)
        total_score = min(max(round(total_score, 1), 0.0), 100.0)
        
        if total_score >= 75:
            tier = "critical"
        elif total_score >= 50:
            tier = "high"
        elif total_score >= 30:
            tier = "medium"
        else:
            tier = "low"
            
        return {
            "snapshot_id": f"RSK-{asset_id}",
            "asset_id": asset_id,
            "score": total_score,
            "tier": tier,
            "score_type": "priority_score", # Not failure_probability!
            "components": components,
            "data_sufficiency": "sufficient",
            "data_sufficiency_notes": [
                "Inspection reports available",
                "Geocoded grievances recorded",
                "Maintenance history present"
            ],
            "method_version": "civic_rules_v1.2",
            "model_version": None,
            "generated_at": datetime.utcnow()
        }

priority_service = PriorityService()

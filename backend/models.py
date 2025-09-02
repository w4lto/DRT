from pydantic import BaseModel
from typing import List, Optional

class ReportParam(BaseModel):
    name: str
    type: str
    required: bool = False

class ReportDefinition(BaseModel):
    name: str
    query: str
    template: str
    params: Optional[List[ReportParam]] = []

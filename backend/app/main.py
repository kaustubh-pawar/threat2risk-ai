from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="Threat2Risk AI Engine API",
    description="Full-Stack AI/ML Cybersecurity Investigation & Risk Intelligence Platform Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Threat2Risk AI Engine",
        "version": "1.0.0",
        "principle": "RAW SECURITY TELEMETRY -> ATTACK STORY -> BUSINESS RISK -> CONTROL INTELLIGENCE -> ACTION"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

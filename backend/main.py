from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from api.v1.endpoints import analysis, history, users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.get("/")
def root():
    return {"message": "エンドポイント'/'は正常動作しています"}


app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(analysis.router, tags=["analysis"])
app.include_router(history.router, prefix="/job-analysis", tags=["history"])

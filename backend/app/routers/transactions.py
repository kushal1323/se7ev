from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.whisper_service import process_audio_upload
from app.services.db_writer import save_voice_entry

router = APIRouter(prefix="/api/v1/transactions", tags=["transactions"])

@router.post("/voice")
async def record_voice_entry(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Step 1: read uploaded bytes
    audio_bytes = await audio.read()

    # Step 2: run full whisper + groq pipeline
    result = process_audio_upload(audio_bytes)

    # Step 3: save each transaction to DB
    saved_ids = []
    for extracted in result["transactions"]:
        txn = save_voice_entry(db, user_id=1, extracted=extracted)
        saved_ids.append(txn.id)

    return {
        "hinglish":     result["hinglish"],
        "translation":  result["translation"],
        "transactions": result["transactions"],
        "saved_ids":    saved_ids,
    }
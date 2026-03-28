import numpy as np
import torch
import json
import soundfile as sf
import io
from transformers import pipeline
from groq import Groq
from app.config import settings

# -------------------------------
# SETTINGS
# -------------------------------
SAMPLERATE = 16000

# -------------------------------
# DEVICE
# -------------------------------
device = 0 if torch.cuda.is_available() else -1
print(f"🚀 Using: {'GPU' if device == 0 else 'CPU'}")

# -------------------------------
# LOAD MODEL
# -------------------------------
asr_pipe = pipeline(
    "automatic-speech-recognition",
    model="Oriserve/Whisper-Hindi2Hinglish-Swift",
    device=device
)
print("✅ ASR Model loaded!\n")

# -------------------------------
# GROQ CLIENT
# -------------------------------
client = Groq(api_key=settings.GROQ_API_KEY)


def load_audio_from_bytes(audio_bytes: bytes) -> np.ndarray:
    buffer = io.BytesIO(audio_bytes)
    audio, _ = sf.read(buffer, dtype='float32')

    if audio.ndim > 1:
        audio = np.mean(audio, axis=1)

    audio = audio / max(np.max(np.abs(audio)), 1e-5)
    return audio


def speech_to_hinglish(audio: np.ndarray) -> str:
    print("⏳ Speech → Hinglish...")
    result = asr_pipe({
        "array": audio,
        "sampling_rate": SAMPLERATE
    })
    return result.get("text", "").strip()


def process_with_groq(text: str) -> dict:
    print("🧠 Processing with Groq...")
    prompt = f"""
    Convert this Hinglish speech into:
    1. English translation
    2. Structured JSON transactions
    Format:
    {{
      "translation": "...",
      "transactions": [
        {{
          "item": "",
          "quantity": 0,
          "unit": "",
          "price": 0,
          "type": "sale or expense"
        }}
      ]
    }}
    Text: "{text}"
    Return ONLY JSON.
    """
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    raw = completion.choices[0].message.content
    try:
        return json.loads(raw)
    except:
        print("⚠️ JSON parsing failed")
        return {"translation": "", "transactions": []}


def process_audio_upload(audio_bytes: bytes) -> dict:
    audio        = load_audio_from_bytes(audio_bytes)
    hinglish_text = speech_to_hinglish(audio)
    print(f"\n📝 Hinglish: {hinglish_text}")

    result = process_with_groq(hinglish_text)

    transactions = []
    for t in result.get("transactions", []):
        transactions.append({
            "item_name": t.get("item", ""),
            "quantity":  t.get("quantity", 0),
            "unit":      t.get("unit", ""),
            "price":     t.get("price", 0),
            "type":      t.get("type", "sale"),
        })

    return {
        "hinglish":     hinglish_text,
        "translation":  result.get("translation", ""),
        "transactions": transactions,
    }
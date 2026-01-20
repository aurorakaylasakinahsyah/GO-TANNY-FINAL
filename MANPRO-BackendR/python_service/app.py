import os
import json
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import base64
from groq import Groq
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from parent directory if not found in current
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
env_path = os.path.join(parent_dir, '.env')

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini if available
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up Plant Disease Detection API (Pure LLM Mode)...")
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(title="Plant Disease Detection API", lifespan=lifespan)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://go-tanny-final.vercel.app",
        "https://go-tanny-final.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_disease_with_groq(disease_name):
    prompt = f"""
    Saya adalah asisten ahli patologi tanaman. Pengguna telah memindai tanaman dan terdeteksi penyakit: "{disease_name}".
    
    Tugas Anda adalah memberikan informasi detail mengenai penyakit ini dalam format JSON Bahasa Indonesia.
    
    Mohon berikan respon HANYA berupa JSON valid dengan struktur berikut:
    {{
        "summary": "Jelaskan secara ringkas apa itu penyakit ini, penyebabnya (jamur/bakteri/virus), dan dampaknya pada tanaman.",
        "symptoms": [
            "Sebutkan gejala visual pada daun",
            "Sebutkan gejala pada batang atau buah",
            "Tanda-tanda awal infeksi"
        ],
        "treatment": [
            "Langkah pengobatan pertama (misal: fungisida spesifik)",
            "Cara penanganan bagian yang terinfeksi",
            "Solusi organik atau kimiawi"
        ],
        "prevention": [
            "Langkah pencegahan agar tidak menyebar",
            "Praktik sanitasi kebun",
            "Pemilihan varietas tahan penyakit"
        ],
        "environment": [
            "Kondisi cuaca yang memicu (misal: lembab, panas)",
            "Suhu ideal perkembangan penyakit",
            "Faktor lingkungan lain (tanah, air)"
        ]
    }}
    """

    # Try Gemini first if available
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            content = response.text
            # Clean up markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            return json.loads(content)
        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Fallback to Groq or error

    if not GROQ_API_KEY:
        return {
            "error": "API Key not configured",
            "symptoms": ["API Key missing (Gemini/Groq)"],
            "summary": "Cannot fetch details.",
            "treatment": [],
            "environment": [],
            "prevention": []
        }

    client = Groq(api_key=GROQ_API_KEY)
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Anda adalah ahli pertanian profesional. Berikan jawaban yang akurat, praktis, dan mudah dipahami petani. Output wajib JSON valid."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "summary": f"Maaf, detail penyakit tidak dapat dimuat saat ini. (Error: {str(e)})",
            "symptoms": ["Data tidak tersedia"],
            "treatment": ["Konsultasikan dengan ahli pertanian setempat"],
            "prevention": [],
            "environment": []
        }

def analyze_image_with_groq_vision(image_bytes):
    if not GROQ_API_KEY:
        return None

    try:
        # Encode image to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        client = Groq(api_key=GROQ_API_KEY)
        
        prompt = """
        Analisis gambar tanaman ini. Identifikasi nama tanaman dan penyakitnya (jika ada).
        Jika tanaman sehat, katakan sehat.
        
        Berikan output HANYA dalam format JSON valid berikut:
        {
            "plant_name": "Nama Tanaman (Bahasa Indonesia)",
            "disease_name": "Nama Penyakit (Bahasa Indonesia) atau 'Sehat'",
            "confidence": 0.95,
            "details": {
                "summary": "Penjelasan singkat penyakit/kondisi",
                "symptoms": ["Gejala 1", "Gejala 2"],
                "treatment": ["Pengobatan 1", "Pengobatan 2"],
                "prevention": ["Pencegahan 1", "Pencegahan 2"],
                "environment": ["Faktor lingkungan"]
            }
        }
        """

        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Groq Vision Error: {e}")
        return None

@app.post("/analyze")
async def analyze_plant(file: UploadFile = File(...)):
    # 1. Read Image
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    # 2. Try Groq Vision First (Superior Accuracy for Fruits/Complex cases)
    vision_result = analyze_image_with_groq_vision(contents)
    
    if vision_result:
        return {
            "prediction": vision_result.get("disease_name", "Unknown"),
            "plant": vision_result.get("plant_name", "Unknown"),
            "accuracy": f"{vision_result.get('confidence', 0.90):.2%}",
            "details": vision_result.get("details", {})
        }

    # If Vision API fails, we cannot proceed without local model
    raise HTTPException(status_code=503, detail="Vision API failed and local model is disabled.")

if __name__ == "__main__":
    # Use 127.0.0.1 to avoid firewall issues on some Windows setups
    uvicorn.run(app, host="127.0.0.1", port=8000)

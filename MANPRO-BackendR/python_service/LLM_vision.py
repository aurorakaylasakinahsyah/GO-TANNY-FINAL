import os
import sys
import json
import base64
import mimetypes
from glob import iglob
from dotenv import load_dotenv
from groq import Groq

# Ensure UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

ALLOWED_CLASSES = [] # Removed strict class list to allow general identification

def _infer_mime(path: str) -> str:
    mime, _ = mimetypes.guess_type(path)
    return mime or "image/jpeg"

def _encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_fruit_disease(image_path: str) -> dict:
    """
    Klasifikasi penyakit tanaman menggunakan Groq (Llama 3.2 Vision).
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY tidak ditemukan di environment variables")

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image tidak ditemukan: {image_path}")

    print(f"[LOG] Inisialisasi Groq client", file=sys.stderr)
    client = Groq(api_key=api_key)
    
    # Encode image to base64
    base64_image = _encode_image(image_path)
    mime_type = _infer_mime(image_path)
    data_url = f"data:{mime_type};base64,{base64_image}"

    system_prompt = (
        "Anda adalah pakar patologi tanaman profesional. Tugas Anda adalah mengidentifikasi jenis tanaman "
        "dan penyakit yang menyerangnya berdasarkan gambar yang diberikan. "
        "Jawablah dalam Bahasa Indonesia yang baik dan benar."
    )

    user_prompt = """
TUGAS:
1. Identifikasi nama tanaman (misal: Tomat, Kentang, Apel, Mangga, dll).
2. Identifikasi nama penyakit atau kondisi kesehatan tanaman (misal: Hawar Daun, Bercak Bakteri, Sehat, dll).
3. Berikan analisis mendalam mengenai gejala, penyebab, dan solusinya.

Berikan hasil dalam format JSON berikut (tanpa teks tambahan):
{
  "fruit": "Nama Tanaman (Indonesia)",
  "disease": "Nama Penyakit (Indonesia) atau 'Sehat'",
  "confidence": 0.0-1.0 (perkiraan keyakinan Anda),
  "reasons": ["Alasan visual 1", "Alasan visual 2"],
  "symptoms": ["Gejala 1", "Gejala 2"],
  "summary": "Ringkasan singkat kondisi tanaman.",
  "control": ["Langkah pengendalian teknis/budidaya"],
  "treatment": ["Rekomendasi pengobatan (organik/kimia)"],
  "extra_info": ["Info tambahan penting"],
  "environment_factors": ["Faktor lingkungan yang mempengaruhi"]
}

Jika gambar bukan tanaman atau tidak jelas, set "fruit": "Unknown", "disease": "Unknown", "confidence": 0.0.
"""

    print(f"[LOG] Mengirim request ke Groq (Llama 3.2 Vision)", file=sys.stderr)

    
    try:
        completion = client.chat.completions.create(
            model="llama-3.2-90b-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=2048,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"},
        )
        
        print("[LOG] Response diterima", file=sys.stderr)
        content = completion.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"[ERROR] Groq API Error: {e}", file=sys.stderr)
        return {
            "fruit": "unknown",
            "disease": "unknown",
            "confidence": 0.0,
            "reasons": [f"Error: {str(e)}"],
            "symptoms": [],
            "summary": "Gagal memproses gambar.",
            "control": [],
            "treatment": [],
            "extra_info": [],
            "environment_factors": []
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python LLM_vision.py <image_path>", file=sys.stderr)
        print(json.dumps({"success": False, "error": "Missing image_path"}))
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        result = analyze_fruit_disease(image_path)
        print(json.dumps({"success": True, "result": result}, ensure_ascii=False))
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] {str(e)}", file=sys.stderr)
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

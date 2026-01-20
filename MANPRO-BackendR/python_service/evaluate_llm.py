import os
import sys
import time
import json
import base64
import mimetypes
from dotenv import load_dotenv
from groq import Groq

# Load Environment
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("Error: GROQ_API_KEY not found.")
    sys.exit(1)

client = Groq(api_key=api_key)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_llm_performance(image_path):
    if not os.path.exists(image_path):
        print(f"Error: File {image_path} tidak ditemukan.")
        return

    print(f"--- Memulai Evaluasi LLM pada: {image_path} ---")
    
    # 1. Ukur Waktu Encoding
    start_time = time.time()
    base64_image = encode_image(image_path)
    print(f"[1] Encoding Image: {time.time() - start_time:.4f} detik")

    # 2. Siapkan Prompt
    prompt = """
    Identifikasi tanaman dan penyakitnya. Jawab dalam JSON:
    {
        "plant": "nama tanaman",
        "disease": "nama penyakit",
        "status": "sehat/sakit"
    }
    """

    # 3. Ukur Latency API (Waktu Respon AI)
    print("[2] Mengirim request ke Groq (Llama 3.2 Vision)...")
    api_start_time = time.time()
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.2-90b-vision-preview",
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
        api_end_time = time.time()
        latency = api_end_time - api_start_time
        
        content = completion.choices[0].message.content
        result_json = json.loads(content)

        print(f"[3] Respon Diterima!")
        print(f"    Latency (Kecepatan): {latency:.4f} detik")
        print(f"    Output AI: {json.dumps(result_json, indent=2)}")
        
        # 4. Evaluasi Kualitas (Qualitative)
        print("\n--- Hasil Evaluasi ---")
        if latency < 3.0:
            print("✅ Kecepatan: SANGAT CEPAT (< 3s)")
        elif latency < 5.0:
            print("⚠️ Kecepatan: SEDANG (3-5s)")
        else:
            print("❌ Kecepatan: LAMBAT (> 5s)")

        if "plant" in result_json and "disease" in result_json:
            print("✅ Struktur Data: VALID (JSON lengkap)")
        else:
            print("❌ Struktur Data: INVALID (Field hilang)")

    except Exception as e:
        print(f"❌ Error saat testing: {str(e)}")

if __name__ == "__main__":
    # Ganti dengan path gambar yang ingin dites manual
    # Contoh: python evaluate_llm.py "C:/Users/Foto/daun_tomat.jpg"
    if len(sys.argv) > 1:
        test_llm_performance(sys.argv[1])
    else:
        print("Usage: python evaluate_llm.py <path_to_image>")

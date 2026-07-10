import os
import re
import sys
import time
import urllib.request
import urllib.error
import json

# Setup paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, 'src', 'data', 'questions')
AUDIO_OUT_DIR = os.path.join(ROOT_DIR, 'public', 'audio')

# ElevenLabs default configurations
VOICE_ID = "naGqKMAolPCi1s94J9jk"  # Charlotte
STABILITY = 0.55
SIMILARITY_BOOST = 0.75

def load_api_key():
    # Try local environment variable
    key = os.environ.get('VITE_ELEVENLABS_API_KEY')
    if key:
        return key
    
    # Try reading from .env.local
    env_local_path = os.path.join(ROOT_DIR, '.env.local')
    if os.path.exists(env_local_path):
        with open(env_local_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('VITE_ELEVENLABS_API_KEY='):
                    return line.strip().split('=', 1)[1]
                    
    # Try reading from .env
    env_path = os.path.join(ROOT_DIR, '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('VITE_ELEVENLABS_API_KEY='):
                    return line.strip().split('=', 1)[1]
    return None

def extract_standard_questions():
    questions = {}
    files = [
        'teleological.ts', 'risk.ts', 'ontological.ts', 'relational.ts',
        'socioEconomic.ts', 'legalMoral.ts', 'evolutionary.ts', 'geopolitical.ts'
    ]
    
    # Regex to find id: XX and statement: "..." or '...'
    id_pattern = re.compile(r'id:\s*(\d+)')
    statement_pattern = re.compile(r'statement:\s*["\'](.*?)["\']\s*(?:,|\})', re.DOTALL)
    
    for filename in files:
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Warning: Question file not found: {filename}")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all blocks resembling an object { id: ..., statement: ... }
        # A simple scanner: split on { and search
        blocks = content.split('{')
        for block in blocks[1:]:
            id_match = id_pattern.search(block)
            statement_match = statement_pattern.search(block)
            if id_match and statement_match:
                q_id = int(id_match.group(1))
                statement = statement_match.group(1).replace('\\"', '"').replace("\\'", "'")
                questions[q_id] = statement
                
    return questions

def extract_simplified_questions():
    questions = {}
    filepath = os.path.join(DATA_DIR, 'simplifiedQuestions.ts')
    if not os.path.exists(filepath):
        print("Warning: simplifiedQuestions.ts not found.")
        return questions
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Pattern to match: id: "simplified statement"
    # e.g., 1: "A big AI computer center uses..."
    pattern = re.compile(r'(\d+):\s*["\'](.*?)["\']', re.DOTALL)
    matches = pattern.findall(content)
    for q_id_str, statement in matches:
        q_id = int(q_id_str)
        questions[q_id] = statement.replace('\\"', '"').replace("\\'", "'")
        
    return questions

def download_voice_file(text, q_id, type_str, api_key):
    filename = f"q_{q_id}_{type_str}.mp3"
    filepath = os.path.join(AUDIO_OUT_DIR, filename)
    
    if os.path.exists(filepath):
        # Skip if already exists
        return True, "skipped (exists)"
        
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": STABILITY,
            "similarity_boost": SIMILARITY_BOOST
        }
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers=headers, 
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.read())
                return True, "downloaded"
    except urllib.error.HTTPError as e:
        try:
            err_msg = e.read().decode('utf-8')
            err_json = json.loads(err_msg)
            if 'detail' in err_json and 'message' in err_json['detail']:
                return False, f"HTTP Error {e.code}: {err_json['detail']['message']}"
        except:
            pass
        return False, f"HTTP Error {e.code}: {e.reason}"
    except Exception as e:
        return False, str(e)

def main():
    print("--- ElevenLabs TTS Static Asset Downloader ---")
    
    api_key = load_api_key()
    if not api_key:
        print("Error: ElevenLabs API Key is missing.")
        print("Please set VITE_ELEVENLABS_API_KEY environment variable or create .env.local file.")
        sys.exit(1)
        
    # Ensure output directory exists
    if not os.path.exists(AUDIO_OUT_DIR):
        os.makedirs(AUDIO_OUT_DIR)
        print(f"Created audio directory: {AUDIO_OUT_DIR}")
        
    print("Extracting statements...")
    std_questions = extract_standard_questions()
    simp_questions = extract_simplified_questions()
    
    print(f"Found {len(std_questions)} standard questions and {len(simp_questions)} simplified questions.")
    
    total_files = len(std_questions) + len(simp_questions)
    completed = 0
    errors = 0
    
    # Process Standard Questions
    for q_id, text in sorted(std_questions.items()):
        print(f"[{completed+1}/{total_files}] Processing Q{q_id} (standard)... ", end="")
        success, status = download_voice_file(text, q_id, "std", api_key)
        print(status)
        completed += 1
        if not success:
            errors += 1
            if "quota" in status.lower() or "limit" in status.lower():
                print("API limit reached or key issues. Stopping execution.")
                break
        else:
            if "skipped" not in status:
                time.sleep(0.5)  # small rate limit courtesy sleep
                
    # Process Simplified Questions
    for q_id, text in sorted(simp_questions.items()):
        print(f"[{completed+1}/{total_files}] Processing Q{q_id} (simplified)... ", end="")
        success, status = download_voice_file(text, q_id, "simp", api_key)
        print(status)
        completed += 1
        if not success:
            errors += 1
            if "quota" in status.lower() or "limit" in status.lower():
                print("API limit reached or key issues. Stopping execution.")
                break
        else:
            if "skipped" not in status:
                time.sleep(0.5)
                
    print(f"\nDownloader complete. Successfully generated assets. Errors encountered: {errors}")

if __name__ == '__main__':
    main()

# 🚀 Run LlamaDoc AI Server
# This script starts the server with auto-reload

# Activate virtual environment and run
& "C:/Users/Pavan Kumar/Desktop/virtual_space/Scripts/python.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Alternative: Run without reload (for production)
# & "C:/Users/Pavan Kumar/Desktop/virtual_space/Scripts/python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000

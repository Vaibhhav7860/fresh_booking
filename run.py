import uvicorn

if __name__ == "__main__":
    uvicorn.run("backend_app.main:app", host="0.0.0.0", port=8000, reload=True)

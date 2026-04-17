from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from bson import ObjectId
from app.database import get_gridfs
import io

router = APIRouter(prefix="/api/images", tags=["Images"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not allowed. Allowed: {ALLOWED_TYPES}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")

    fs = get_gridfs()
    file_id = fs.put(
        contents,
        filename=file.filename,
        content_type=file.content_type,
    )

    return {"image_id": str(file_id), "filename": file.filename}


@router.get("/{image_id}")
def get_image(image_id: str):
    if not ObjectId.is_valid(image_id):
        raise HTTPException(status_code=400, detail="Invalid image ID")

    fs = get_gridfs()

    if not fs.exists(ObjectId(image_id)):
        raise HTTPException(status_code=404, detail="Image not found")

    grid_out = fs.get(ObjectId(image_id))

    return StreamingResponse(
        io.BytesIO(grid_out.read()),
        media_type=grid_out.content_type or "image/jpeg",
        headers={
            "Cache-Control": "public, max-age=31536000",
            "Content-Disposition": f"inline; filename={grid_out.filename}",
        },
    )

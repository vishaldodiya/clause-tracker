from fastapi import HTTPException, UploadFile

class FileParser:
    @staticmethod
    async def parse_file(file: UploadFile) -> str:
        text = ""
        content = await file.read()

        print("----------")
        print(content)

        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        if file.content_type in ("text/plain", "text/markdown"):
            text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

        return text
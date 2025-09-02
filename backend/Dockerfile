FROM python:3.10-slim

WORKDIR /app

# Install system deps for weasyprint
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev libpango-1.0-0 libpangoft2-1.0-0 \
    libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /srv/kitchenmum
RUN pip install --no-cache-dir fastapi==0.164.0 'uvicorn[standard]==0.54.0' 'psycopg[binary,pool]==3.3.9' google-auth==2.62.2 requests==2.32.5 pydantic==2.13.4
COPY main.py ./main.py
USER 10001:10001
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "127.0.0.1"]

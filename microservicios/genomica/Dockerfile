FROM python:3.11-slim

WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Configurar pip con timeout mayor y retry
RUN pip install --default-timeout=100 --retries 5 --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Recopilar archivos estáticos (opcional)
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
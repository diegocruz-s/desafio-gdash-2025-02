import os
import json
import logging
import time
import httpx
import uuid
import pika
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

RABBIT_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "weather")
ROUTING_KEY = os.getenv("RABBITMQ_ROUTING_KEY", "weather.snapshot")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "weather_queue")

CITY = os.getenv("CITY", "São Paulo")
LAT = os.getenv("LAT", "-23.55052")
LON = os.getenv("LON", "-46.633308")
COLLECT_INTERVAL_SECONDS = int(os.getenv("INTERVAL_SECONDS", 10))

LOG = logging.getLogger("collector")
logging.basicConfig(level=logging.INFO)

def fetchOpenMeteo(lat, lon):
  url = "https://api.open-meteo.com/v1/forecast"
  params = {
    "latitude": lat,
    "longitude": lon,
    "hourly": "temperature_2m,relativehumidity_2m,windspeed_10m",
    "current_weather": "true",
    "timezone": "America/Sao_Paulo"
  }
  with httpx.Client(timeout=10.0) as client:
    r = client.get(url, params=params)
    r.raise_for_status()
    return r.json()

def buildMessage(data):
  now = datetime.now(timezone.utc).isoformat()
  print('now: ', now)
  temperature = data["current_weather"]["temperature"]
  wind_speed = data["current_weather"]["windspeed"]
  collected_at = data["current_weather"]["time"]
  humidity = data["hourly"]["relativehumidity_2m"][0]
  message = {
    "id": str(uuid.uuid4()),
    "collectedAt": now,
    "location": {"city": CITY, "lat": float(LAT), "lon": float(LON)},
    "source": "open-meteo",
    "payload": {
      "temperature": temperature,
      "windSpeed": wind_speed,
      "humidity": humidity,
      "collectedAt": collected_at,
      "city": CITY,
      "source": "open-meteo"
    },
    "meta": {"collectorVersion": "collector/0.1.0", "attempt": 1}
  }
  return message

def publishRabbitMQ(message: dict):
  try:
    credentials = pika.PlainCredentials(
      RABBITMQ_USER,
      RABBITMQ_PASS
    )

    params = pika.ConnectionParameters(
      host=RABBITMQ_HOST,
      port=RABBITMQ_PORT,
      credentials=credentials,
      heartbeat=30,
      blocked_connection_timeout=10
    )

    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    channel.basic_publish(
      exchange="",
      routing_key=RABBITMQ_QUEUE,
      body=json.dumps(message),
      properties=pika.BasicProperties(
        delivery_mode=2 
      )
    )

    connection.close()
    LOG.info("✅ Mensagem enviada para RabbitMQ com sucesso")

  except Exception as e:
    LOG.error(f"❌ Erro ao publicar no RabbitMQ: {e}")
    raise e

def runOnce():
  try:
    data = fetchOpenMeteo(LAT, LON)
    msg = buildMessage(data)
    publishRabbitMQ(msg)
    LOG.info("Published message %s", msg["id"])
  except Exception as e:
    LOG.exception("Collector error: %s", e)

if __name__ == "__main__":
  while True:
    runOnce()
    time.sleep(COLLECT_INTERVAL_SECONDS)

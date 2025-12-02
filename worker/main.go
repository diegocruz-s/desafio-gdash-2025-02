package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	RabbitURL = getEnv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
	QueueName = getEnv("RABBITMQ_QUEUE", "weather_queue")

	ApiURL = getEnv("API_URL", "http://api:3000/weather")
)

type CreateWeatherDTO struct {
	Temperature float64 `json:"temperature"`
	WindSpeed   float64 `json:"windSpeed"`
	Humidity    int     `json:"humidity"`
	CollectedAt string  `json:"collectedAt"`
	City        string  `json:"city,omitempty"`
	Source      string  `json:"source,omitempty"`
}

type Weather struct {
	ID          string `json:"id"`
	CollectedAt string `json:"collectedAt"`
	Payload     struct {
		Temperature float64 `json:"temperature"`
		WindSpeed   float64 `json:"windSpeed"`
		Humidity    int     `json:"humidity"`
		City        string  `json:"city"`
		Source      string  `json:"source"`
	} `json:"payload"`
}

func main() {
	readDatasFromRabbitMQ()
}

func readDatasFromRabbitMQ () {
	var conn *amqp.Connection
	var err error

	for {
		conn, err = amqp.Dial(RabbitURL)
		if err == nil {
			log.Println("✅ Conectado ao RabbitMQ com sucesso")
			break
		}

		log.Println("⏳ RabbitMQ indisponível, tentando novamente em 5 segundos...")
		time.Sleep(5 * time.Second)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir um canal")
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		QueueName,
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to declare a queue")
	log.Printf("Queue '%s' declared successfully!", queue.Name)

	msgs, err := ch.Consume(
		queue.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Erro ao consumir fila")

	log.Println("📥 Aguardando mensagens da fila...")

	forever := make(chan bool)

	go func () {
		for d := range msgs {
			log.Println("📨 Mensagem recebida")

			weather, err := decodeClimateMessage(d.Body)

			if err != nil {
				log.Println("Error decoding JSON:", err)
				d.Nack(false, false)
				continue
			}

			weatherDto := WeatherToCreateDTO(weather)
			jsonData, err := json.Marshal(weatherDto)
			if err != nil {
				log.Println("Error marshaling DTO:", err)
				d.Nack(false, false) // descarta
				continue
			}
			log.Println("JSON decodificado: ", string(jsonData))

			status, err := sendToAPI(jsonData)
			if err != nil || status >= 400 {
				log.Println("Error send recurse to API:", err)
				log.Println("Error send recurse to API:", status)
				d.Nack(false, false)
				continue
			}

			log.Println("Send to API with success:")
			d.Ack(false)
		}
	}()
	<-forever

}
func decodeClimateMessage(body []byte) (Weather, error) {
	var weather Weather

	err := json.Unmarshal(body, &weather)
	if err != nil {
		return Weather{}, err
	}

	return weather, nil
}

func WeatherToCreateDTO (weather Weather) CreateWeatherDTO {
	return CreateWeatherDTO {
		Temperature: weather.Payload.Temperature,
		WindSpeed: weather.Payload.WindSpeed,
		Humidity: weather.Payload.Humidity,
		CollectedAt: weather.CollectedAt,
		City: weather.Payload.City,
		Source: weather.Payload.Source,
	}
}

func sendToAPI (body []byte) (int, error) {
	log.Printf("ApiURL: ", ApiURL)

	req, err := http.NewRequest("POST", ApiURL, bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}

	defer resp.Body.Close()
	_, err = io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Aviso: falha ao ler o corpo da resposta: %v\n", err)
	}

	statusCode := resp.StatusCode

	return statusCode, nil

}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("❌ %s: %s", msg, err)
	}
}

func getEnv(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}
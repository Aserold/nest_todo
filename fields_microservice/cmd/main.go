package main

import (
	"log"

	"github.com/Aserold/nest_todo/fields_microservice/config"
	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice/delivery/rmq"
	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice/repository"
	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice/usecase"
	"github.com/Aserold/nest_todo/fields_microservice/pkg/db/postgres"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	// init config
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("LoadConfig: %v", err)
	}

	log.Println("Config loaded")

	// init db
	psqlDB, err := postgres.NewPsqlDB(cfg)
	if err != nil {
		log.Fatalf("Postgresql init: %s", err)
	} else {
		log.Printf("Postgres connected, Status: %#v", psqlDB.Stats())
	}
	defer psqlDB.Close()

	// run microservice
	repo := repository.NewFieldsRepository(psqlDB)
	usecase := usecase.NewFieldsUseCase(repo)

	conn, err := amqp.Dial(cfg.RMQUrl)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %s", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %s", err)
	}
	defer ch.Close()

	handler := rmq.NewFieldsHandlers(usecase, ch)

	q, err := ch.QueueDeclare(
		"field_queue", // name
		false,         // durable
		false,         // delete when unused
		false,         // exclusive
		false,         // no-wait
		nil,           // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %s", err)
	}

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %s", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {

			switch d.Type {
			case "create-values":
				handler.Create()(d)
			case "findall-values":
				handler.FindAll()(d)
			case "update-values":
				handler.Update()(d)
			default:
				log.Printf("Unknown message type: %s", d.Type)
			}
		}
	}()

	log.Println("Waiting for messages. To exit press CTRL+C")
	<-forever

}

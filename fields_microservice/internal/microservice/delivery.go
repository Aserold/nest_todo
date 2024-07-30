package microservice

import amqp "github.com/rabbitmq/amqp091-go"

type Handlers interface {
	Create() func(amqp.Delivery)
	FindAll() func(amqp.Delivery)
	Update() func(amqp.Delivery)
}

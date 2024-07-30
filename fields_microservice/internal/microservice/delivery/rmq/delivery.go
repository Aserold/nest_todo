package rmq

import (
	"encoding/json"
	"log"

	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice"
	"github.com/Aserold/nest_todo/fields_microservice/internal/models"
	"github.com/pkg/errors"
	amqp "github.com/rabbitmq/amqp091-go"
)

type fieldsHandlers struct {
	fieldsUC microservice.UseCase
	ch       *amqp.Channel
}

func NewFieldsHandlers(fieldsUC microservice.UseCase, ch *amqp.Channel) microservice.Handlers {
	return &fieldsHandlers{fieldsUC: fieldsUC, ch: ch}
}

func (h *fieldsHandlers) Create() func(amqp.Delivery) {
	return func(msg amqp.Delivery) {
		bodyStr := string(msg.Body)
		log.Printf("Received message body: %s", bodyStr)

		var message models.Message
		if err := json.Unmarshal(msg.Body, &message); err != nil {
			log.Printf("Failed to unmarshal message: %s", err)
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		result, err := h.fieldsUC.CreateTaskFieldValue(&message.Data.FieldValue)
		if err != nil {
			log.Printf("Failed to create task field value: %s", errors.Wrap(err, "fieldsHandlers.Create"))
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		response := models.CreateResponse{
			FieldId:     result.FieldId,
			StringValue: result.StringValue,
			NumberValue: result.NumberValue,
		}

		h.publishResponse(msg.ReplyTo, msg.CorrelationId, response, nil)
		if err := msg.Ack(false); err != nil {
			log.Printf("Failed to acknowledge message: %s", err)
		}
	}
}

func (h *fieldsHandlers) FindAll() func(amqp.Delivery) {
	return func(msg amqp.Delivery) {
		bodyStr := string(msg.Body)
		log.Printf("Received message body: %s", bodyStr)

		var message models.Message
		if err := json.Unmarshal(msg.Body, &message); err != nil {
			log.Printf("Failed to unmarshal message: %s", err)
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		result, err := h.fieldsUC.FindAllTaskFieldValues(&message.Data)
		if err != nil {
			log.Printf("Failed to find task field values: %s", errors.Wrap(err, "fieldsHandlers.FindAll"))
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		h.publishResponse(msg.ReplyTo, msg.CorrelationId, result, nil)
		if err := msg.Ack(false); err != nil {
			log.Printf("Failed to acknowledge message: %s", err)
		}
	}
}

func (h *fieldsHandlers) Update() func(amqp.Delivery) {
	return func(msg amqp.Delivery) {
		bodyStr := string(msg.Body)
		log.Printf("Received message body: %s", bodyStr)

		var message models.Message
		if err := json.Unmarshal(msg.Body, &message); err != nil {
			log.Printf("Failed to unmarshal message: %s", err)
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		result, err := h.fieldsUC.UpdateTaskFieldValue(&message.Data.FieldValue)
		if err != nil {
			log.Printf("Failed to update task field value: %s", errors.Wrap(err, "fieldsHandlers.Update"))
			h.publishResponse(msg.ReplyTo, msg.CorrelationId, nil, err)
			return
		}

		response := models.UpdateResponse{
			FieldId:     result.FieldId,
			StringValue: result.StringValue,
			NumberValue: result.NumberValue,
		}

		h.publishResponse(msg.ReplyTo, msg.CorrelationId, response, nil)
		if err := msg.Ack(false); err != nil {
			log.Printf("Failed to acknowledge message: %s", err)
		}
	}
}

func (h *fieldsHandlers) publishResponse(replyTo, correlationId string, response interface{}, err error) {
	var responseBody []byte
	if err != nil {
		responseBody, _ = json.Marshal(map[string]string{"error": err.Error()})
	} else {
		responseBody, _ = json.Marshal(response)
	}

	err = h.ch.Publish(
		"",      // exchange
		replyTo, // routing key
		false,   // mandatory
		false,   // immediate
		amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: correlationId,
			Body:          responseBody,
		},
	)
	if err != nil {
		log.Printf("Failed to publish response: %s", err)
	}
}

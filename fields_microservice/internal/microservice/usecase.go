package microservice

import "github.com/Aserold/nest_todo/fields_microservice/internal/models"

type UseCase interface {
	CreateTaskFieldValue(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error)
	FindAllTaskFieldValues(ids *models.Data) (*models.TaskFieldValues, error)
	UpdateTaskFieldValue(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error)
}

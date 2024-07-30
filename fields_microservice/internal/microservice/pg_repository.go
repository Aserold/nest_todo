package microservice

import "github.com/Aserold/nest_todo/fields_microservice/internal/models"

type Repository interface {
	Create(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error)
	Update(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error)
	FindAll(ids *models.Data) (*models.TaskFieldValues, error)
}

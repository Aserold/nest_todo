package usecase

import (
	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice"
	"github.com/Aserold/nest_todo/fields_microservice/internal/models"
	"github.com/pkg/errors"
)

type fieldsUC struct {
	fieldsRepo microservice.Repository
}

func NewFieldsUseCase(fieldsRepo microservice.Repository) microservice.UseCase {
	return &fieldsUC{fieldsRepo: fieldsRepo}
}

func (u *fieldsUC) CreateTaskFieldValue(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error) {
	result, err := u.fieldsRepo.Create(fieldValue)
	if err != nil {
		return nil, errors.Wrap(err, "taskFieldValueUsecase.CreateTaskFieldValue")
	}
	return result, nil
}

func (u *fieldsUC) FindAllTaskFieldValues(ids *models.Data) (*models.TaskFieldValues, error) {
	result, err := u.fieldsRepo.FindAll(ids)
	if err != nil {
		return nil, errors.Wrap(err, "taskFieldValueUsecase.FindAllTaskFieldValues")
	}
	return result, nil
}

func (u *fieldsUC) UpdateTaskFieldValue(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error) {
	result, err := u.fieldsRepo.Update(fieldValue)
	if err != nil {
		return nil, errors.Wrap(err, "taskFieldValueUsecase.UpdateTaskFieldValue")
	}
	return result, nil
}

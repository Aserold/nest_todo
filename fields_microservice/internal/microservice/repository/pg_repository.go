package repository

import (
	"log"

	"github.com/Aserold/nest_todo/fields_microservice/internal/microservice"
	"github.com/Aserold/nest_todo/fields_microservice/internal/models"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type fieldsRepo struct {
	db *sqlx.DB
}

// Create implements microservice.Repository.
func (r *fieldsRepo) Create(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error) {
	f := &models.TaskFieldValue{}

	if err := r.db.QueryRowx(createQuery, &fieldValue.TaskId, &fieldValue.FieldId,
		&fieldValue.StringValue, &fieldValue.NumberValue).StructScan(f); err != nil {
		log.Printf("fieldsRepo.Create.StructScan: %s", err)
		return nil, errors.Wrap(err, "fieldsRepo.Create.StructScan")
	}

	return f, nil
}

// Findall implements microservice.Repository.
func (r *fieldsRepo) FindAll(ids *models.Data) (*models.TaskFieldValues, error) {
	fieldValues := &models.TaskFieldValues{}

	query, args, err := sqlx.In(findAllQuery, ids.TaskIds)
	if err != nil {
		log.Printf("fieldsRepo.FindAll.sqlx.In: %s", err)
		return nil, errors.Wrap(err, "fieldsRepo.FindAll.sqlx.In")
	}

	query = r.db.Rebind(query)

	if err := r.db.Select(&fieldValues.FieldValues, query, args...); err != nil {
		log.Printf("fieldsRepo.FindAll.Select: %s", err)
		return nil, errors.Wrap(err, "fieldsRepo.FindAll.Select")
	}

	return fieldValues, nil
}

// Update implements microservice.Repository.
func (r *fieldsRepo) Update(fieldValue *models.TaskFieldValue) (*models.TaskFieldValue, error) {
	f := &models.TaskFieldValue{}

	if err := r.db.Get(f, updateQuery, &fieldValue.TaskId, &fieldValue.FieldId, &fieldValue.StringValue, &fieldValue.NumberValue); err != nil {
		log.Printf("fieldsRepo.Update.Get: %s", err)
		return nil, errors.Wrap(err, "fieldsRepo.Update.Get")
	}

	return f, nil
}

func NewFieldsRepository(db *sqlx.DB) microservice.Repository {
	return &fieldsRepo{db: db}
}

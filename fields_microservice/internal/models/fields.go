package models

type Message struct {
	Pattern string `json:"pattern"`
	Data    Data   `json:"data"`
	Id      string `json:"id"`
}

type Data struct {
	FieldValue TaskFieldValue `json:"fieldValue,omitempty"`
	TaskIds    []int          `json:"taskIds"`
}

type TaskFieldValue struct {
	TaskId      int     `json:"taskId" db:"task_id"`
	FieldId     int     `json:"fieldId" db:"field_id"`
	StringValue string  `json:"stringValue,omitempty" db:"string_value"`
	NumberValue float64 `json:"numberValue,omitempty" db:"number_value"`
}

type TaskFieldValues struct {
	FieldValues []*TaskFieldValue `json:"fieldValues"`
}

type UpdateResponse struct {
	FieldId     int     `json:"id"`
	StringValue string  `json:"stringValue,omitempty"`
	NumberValue float64 `json:"numberValue"`
}

type CreateResponse struct {
	FieldId      int     `json:"id"`
	StringValue string  `json:"stringValue"`
	NumberValue float64 `json:"numberValue"`
}

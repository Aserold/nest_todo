package repository

const (
	createQuery = `INSERT INTO taskFieldValues (task_id, field_id, string_value, number_value)
	VALUES ($1, $2, $3, $4)
	RETURNING field_id, string_value, number_value`

	updateQuery = `INSERT INTO taskFieldValues (task_id, field_id, string_value, number_value)
VALUES ($1, $2, $3, $4)
ON CONFLICT (task_id, field_id)
DO UPDATE SET
    string_value = EXCLUDED.string_value,
    number_value = EXCLUDED.number_value
RETURNING field_id, string_value, number_value;`

	// getOneQuery = `SELECT field_id, string_value, number_value
	// FROM taskFieldValues
	// WHERE task_id = $1 AND field_id = $2`

	findAllQuery = `
SELECT task_id, field_id, string_value, number_value
FROM taskFieldValues
WHERE task_id IN (?)
ORDER BY field_id
`
)

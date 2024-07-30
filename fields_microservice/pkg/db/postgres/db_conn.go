package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/Aserold/nest_todo/fields_microservice/config"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
)

const (
	maxOpenConns    = 60
	connMaxLifetime = 120
	maxIdleConns    = 30
	connMaxIdleTime = 20
)

func NewPsqlDB(c *config.Config) (*sqlx.DB, error) {
	dataSourceName := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
		c.PostgresqlHost,
		c.PostgresqlPort,
		c.PostgresqlUser,
		c.PostgresqlDbname,
		c.PostgresqlPassword,
	)

	db, err := sqlx.Connect("pgx", dataSourceName)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(maxOpenConns)
	db.SetConnMaxLifetime(connMaxLifetime * time.Second)
	db.SetMaxIdleConns(maxIdleConns)
	db.SetConnMaxIdleTime(connMaxIdleTime * time.Second)
	if err = db.Ping(); err != nil {
		return nil, err
	}

	stmt, err := db.Prepare(`
    	CREATE TABLE IF NOT EXISTS taskFieldValues (
			task_id INT NOT NULL,
			field_id INT NOT NULL,
			string_value TEXT,
			number_value FLOAT,
			PRIMARY KEY (task_id, field_id)
);
        `)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	if _, err := stmt.Exec(); err != nil {
		log.Print(err)
		return nil, err
	}
	stmt.Close()

	return db, nil
}

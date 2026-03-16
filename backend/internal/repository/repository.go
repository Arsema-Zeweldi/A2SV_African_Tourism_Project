package repository

import "errors"

var ErrNotImplemented = errors.New("not implemented")

type Pagination struct {
	Page     int
	PageSize int
}

type Sort struct {
	Field string
	Order string
}

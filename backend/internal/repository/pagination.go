package repository

type Pagination struct {
	Page     int
	PageSize int
}

type Sort struct {
	Field string
	Order string
}

func normalizePagination(params Pagination) (int, int) {
	page := params.Page
	if page <= 0 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}
	return page, pageSize
}

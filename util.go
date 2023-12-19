package main

func Filter[T Note | Tag](collection []T, predicate func(x T) bool) []T {
	var results []T

	for _, item := range collection {
		if predicate(item) {
			results = append(results, item)
		}
	}

	return results
}

func Any[T comparable](collection []T, predicate func(x T) bool) bool {
	for _, item := range collection {
		if predicate(item) {
			return true
		}
	}

	return false
}

func Contains[T comparable](collection []T, item T) bool {
	for _, el := range collection {
		if el == item {
			return true
		}
	}

	return false
}

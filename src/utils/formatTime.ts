export const formatTime = (value: string) => {
	const date = new Date(value)

	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")

	return `${hours}:${minutes}`
}

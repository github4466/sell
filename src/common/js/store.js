export function saveToLocal (id, key, val) {
	let sellers = window.localStorage.__sellers__
	if (!sellers) {
		sellers = {}
		sellers[id] = {}
	} else {
		sellers = JSON.parse(sellers)
		if (!sellers[id]) {
			sellers[id] = {}
		}
	}
	sellers[id][key] = val
	window.localStorage.__sellers__ = JSON.stringify(sellers)
}
export function loadFromLocal (id, key, def) {
	let sellers = window.localStorage.__sellers__
	if (!sellers) {
		return def
	}
	let seller = JSON.parse(sellers)[id]
	if (!seller) {
		return def
	}
	let val = seller[key]
	return val || def
}

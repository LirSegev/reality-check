export const createLocationselectEvent = (detail: locationselectDetail) =>
	new CustomEvent('locationselect', {
		detail,
	});

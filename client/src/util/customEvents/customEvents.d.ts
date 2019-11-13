type locationselectDetail = {
	coords: {
		long: number;
		lat: number;
	};
};

interface DocumentEventMap {
	locationselect: CustomEvent<locationselectDetail>;
}

interface Document {
	addEventListener<K extends keyof DocumentEventMap>(
		type: K,
		listener: (this: Document, ev: DocumentEventMap[K]) => any,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener<K extends keyof DocumentEventMap>(
		type: K,
		listener: (this: Document, ev: DocumentEventMap[K]) => any,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}

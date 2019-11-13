import { IControl } from 'mapbox-gl';

const MIN_PHASE = 1;
const MAX_PHASE = 4;

export default class PhaseSelectControl implements IControl {
	_container = document.createElement('div');

	onAdd(map: mapboxgl.Map) {
		this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

		const uiForm = document.createElement('div');
		uiForm.className = 'ui form';
		uiForm.style.fontSize = 'unset';

		const input = document.createElement('input');
		input.type = 'number';
		input.name = 'phase-select';
		input.min = String(MIN_PHASE);
		input.max = String(MAX_PHASE);
		input.style.minWidth = '9em';
		input.onchange = this._handleChange.bind(this);
		uiForm.appendChild(input);
		this._container.appendChild(uiForm);

		return this._container;
	}

	onRemove(map: mapboxgl.Map) {
		this._container.parentNode!.removeChild(this._container);
	}

	_handleChange(e: Event) {
		const currentTarget = e.currentTarget as HTMLInputElement;
		const minValue = Number(currentTarget.min);
		const maxValue = Number(currentTarget.max);
		let phase = Number(currentTarget.value);

		if (phase < minValue) phase = minValue;
		else if (phase > maxValue) phase = maxValue;

		this._container.querySelector('input')!.value = String(phase);
		this._changePhase(phase);
	}

	_changePhase(phase: number) {}
}

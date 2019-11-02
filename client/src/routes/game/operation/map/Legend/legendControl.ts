import { store } from '../../../../../index';
import { toggleLegend } from '../../../../../reducers/map.reducer';

class LegendControl implements mapboxgl.IControl {
	_container = document.createElement('div');

	onAdd(map: mapboxgl.Map) {
		this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

		const button = document.createElement('button');
		button.className = 'mapboxgl-ctrl-icon';
		button.type = 'button';
		button.onclick = () => {
			store.dispatch(toggleLegend());
		};

		const icon = document.createElement('i');
		icon.className = 'info icon';
		icon.style.margin = '0';
		button.appendChild(icon);

		this._container.appendChild(button);

		return this._container;
	}

	onRemove(map: mapboxgl.Map) {
		this._container.parentNode!.removeChild(this._container);
	}
}

export default LegendControl;

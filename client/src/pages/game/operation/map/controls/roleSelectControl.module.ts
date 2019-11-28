import { IControl } from 'mapbox-gl';
import { PlayerRole } from '../../../../../util/db.types';

export default class RoleSelectControl implements IControl {
	_container = document.createElement('div');

	onAdd(map: mapboxgl.Map) {
		this._container.className = 'mapboxgl-ctrl';

		const dropdown = document.createElement('div');
		dropdown.className = 'ui selection dropdown';
		dropdown.style.minWidth = '9em';

		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'role-select';
		input.onchange = this._changeRole(map);
		dropdown.appendChild(input);

		const icon = document.createElement('i');
		icon.className = 'dropdown icon';
		dropdown.appendChild(icon);

		const defaultText = document.createElement('div');
		defaultText.className = 'default text';
		defaultText.innerText = 'Role';
		dropdown.appendChild(defaultText);

		const menu = document.createElement('div');
		menu.className = 'menu';
		const roles = ['chaser', 'intelligence', 'detective'] as PlayerRole[];
		roles.forEach(role => {
			const item = document.createElement('div');
			item.className = 'item';
			item.dataset.value = role;
			item.innerText = role[0].toUpperCase() + role.slice(1);

			menu.appendChild(item);
		});
		dropdown.appendChild(menu);
		this._container.appendChild(dropdown);

		return this._container;
	}

	onRemove(map: mapboxgl.Map) {
		this._container.parentNode!.removeChild(this._container);
	}

	/**
	 * Display map layers a player with role `role` would see
	 */
	_changeRole = (map: mapboxgl.Map) => (e: Event) => {
		const role = (e.currentTarget as HTMLInputElement).value as PlayerRole;
		switch (role) {
			case 'chaser':
				map.setLayoutProperty('intelligence-points', 'visibility', 'none');
				map.setLayoutProperty('detective-points', 'visibility', 'none');
				break;
			case 'detective':
				map.setLayoutProperty('intelligence-points', 'visibility', 'none');
				map.setLayoutProperty('detective-points', 'visibility', 'visible');
				break;
			case 'intelligence':
				map.setLayoutProperty('intelligence-points', 'visibility', 'visible');
				map.setLayoutProperty('detective-points', 'visibility', 'none');
				break;
		}
	};
}

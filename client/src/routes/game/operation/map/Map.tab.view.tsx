import * as React from 'react';
import { Page } from 'react-onsenui';

import ReactMapboxFactory, { MapContext } from 'react-mapbox-gl';
import { GeolocateControl } from 'mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

const MapTabView: React.FC = () => (
	<Page>
		<Map
			// eslint-disable-next-line
			style={mapboxConfig.styleURL}
			center={[14.42, 50.08]}
			zoom={[12]}
			containerStyle={{
				height: '100%',
				width: '100%',
			}}
		>
			<MapContext.Consumer>
				{/* Locate the user */
				map => {
					if (map)
						map.addControl(
							new GeolocateControl({
								positionOptions: {
									enableHighAccuracy: true,
								},
								trackUserLocation: true,
							})
						);
					return <React.Fragment />;
				}}
			</MapContext.Consumer>
		</Map>
	</Page>
);

export default MapTabView;

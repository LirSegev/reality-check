import * as React from 'react';
import { Page } from 'react-onsenui';

import ReactMapboxFactory, { MapContext, Layer } from 'react-mapbox-gl';
import { GeolocateControl } from 'mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

let hasControl = false;

interface Props {
	playerLocationMarkers: JSX.Element[];
}

const MapTabView: React.FC<Props> = props => (
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
					if (map && !hasControl)
						map.addControl(
							new GeolocateControl({
								positionOptions: {
									enableHighAccuracy: true,
								},
								trackUserLocation: true,
							})
						);
					hasControl = true;
					return <React.Fragment />;
				}}
			</MapContext.Consumer>
			<Layer layout={{ 'icon-image': 'point-large' }}>
				{props.playerLocationMarkers}
			</Layer>
		</Map>
	</Page>
);

export default MapTabView;

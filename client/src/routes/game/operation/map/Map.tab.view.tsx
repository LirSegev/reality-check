import * as React from 'react';
import { Page } from 'react-onsenui';

import ReactMapboxFactory, { MapContext, Layer } from 'react-mapbox-gl';
import { GeolocateControl } from 'mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';
import { MapOrientation } from '../../../../index.d';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

let hasControl = false;

interface Props {
	playerLocationMarkers: JSX.Element[];
	mapOrientation: MapOrientation;
	onMove: (map: mapboxgl.Map) => void;
}

const MapTabView: React.FC<Props> = props => (
		<Page>
			<Map
			// eslint-disable-next-line
			style={mapboxConfig.styleURL}
			center={[
				props.mapOrientation.center.longitude,
				props.mapOrientation.center.latitude,
			]}
			zoom={[props.mapOrientation.zoom]}
			containerStyle={{
					height: '100%',
					width: '100%',
				}}
				onMove={props.onMove}
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

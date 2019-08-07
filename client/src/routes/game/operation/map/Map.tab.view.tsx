import * as React from 'react';
import { Page } from 'react-onsenui';

import ReactMapboxFactory, {
	MapContext,
	Layer,
	Feature,
} from 'react-mapbox-gl';
import { GeolocateControl } from 'mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';
import { MapOrientation } from '../../../../index.d';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

let hasControl = false;

interface Props {
	playerLocationMarkers: JSX.Element[];
	mrZRoute: number[][];
	mapOrientation: MapOrientation;
	onMove: (map: mapboxgl.Map) => void;
	onStyleLoad: (map: mapboxgl.Map) => void;
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
			onStyleLoad={props.onStyleLoad}
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
			<Layer
				type="line"
				layout={{
					'line-cap': 'round',
					'line-join': 'round',
				}}
				paint={{
					'line-color': '#50a882',
					'line-width': 10,
				}}
			>
				<Feature coordinates={props.mrZRoute} />
			</Layer>
			<Layer layout={{ 'icon-image': 'z-green', 'icon-size': 0.25 }}>
				<Feature
					coordinates={
						props.mrZRoute.length > 0
							? props.mrZRoute[props.mrZRoute.length - 1]
							: []
					}
				/>
			</Layer>
		</Map>
	</Page>
);

export default MapTabView;

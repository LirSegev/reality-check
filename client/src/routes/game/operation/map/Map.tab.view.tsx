import * as React from 'react';
import { Page, Dialog } from 'react-onsenui';

import ReactMapboxFactory, { Layer, Feature } from 'react-mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';
import DistantPoint from './distantPoint.component';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';
import Legend from './Legend';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

interface Props {
	mrZRoute: number[][];
	mapOrientation: MapOrientation;
	onMove: (map: mapboxgl.Map) => void;
	onStyleLoad: (map: mapboxgl.Map) => void;
	destination?: { latitude: number; longitude: number };
}

const MapTabView: React.FC<Props> = props => (
	<Page>
		<div id="ripple" />
		{props.destination && <DistantPoint coordinate={props.destination} />}
		<Legend />
		<Map
			// eslint-disable-next-line
			style={mapboxConfig.styleURL}
			center={[
				props.mapOrientation.center.longitude,
				props.mapOrientation.center.latitude,
			]}
			zoom={[props.mapOrientation.zoom]}
			bearing={[props.mapOrientation.bearing]}
			containerStyle={{
				height: '100%',
				width: '100%',
			}}
			onMove={props.onMove}
			onStyleLoad={props.onStyleLoad}
		>
			<Layer
				id="mr-z-route-line"
				before="mr-z-route"
				type="line"
				layout={{
					'line-cap': 'round',
					'line-join': 'round',
				}}
				paint={{
					'line-color': '#2e6eb2',
					'line-width': ['interpolate', ['linear'], ['zoom'], 14, 4, 17, 8],
					'line-opacity': 0.5,
				}}
			>
				<Feature coordinates={props.mrZRoute} />
			</Layer>
			<Layer
				id="mr-z-route-end"
				before="player-locations"
				layout={{
					'icon-image': 'folder-30',
					'icon-size': 0.75,
					'icon-allow-overlap': true,
				}}
			>
				<Feature
					coordinates={
						props.mrZRoute.length > 0
							? props.mrZRoute[props.mrZRoute.length - 1]
							: []
					}
				/>
			</Layer>
			<Layer
				id="destination"
				layout={{
					'icon-image': 'placeholder-red-30',
					'icon-offset': [0, -15],
					'icon-ignore-placement': true,
				}}
			>
				{props.destination && (
					<Feature
						coordinates={[
							props.destination.longitude,
							props.destination.latitude,
						]}
					/>
				)}
			</Layer>
		</Map>
	</Page>
);

const mapState = (state: ReduxState) => ({
	destination: state.map.destination,
	mapOrientation: state.map.mapOrientation,
});
export default connect(mapState)(MapTabView);

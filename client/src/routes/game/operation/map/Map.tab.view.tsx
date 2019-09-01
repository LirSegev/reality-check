import * as React from 'react';
import { Page } from 'react-onsenui';

import ReactMapboxFactory, { Layer, Feature } from 'react-mapbox-gl';
import mapboxConfig from '../../../../config/Mapbox';

const Map = ReactMapboxFactory({
	accessToken: mapboxConfig.accessToken,
});

interface Props {
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
			<Layer
				id="mr-z-route-line"
				before="mr-z-route"
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
			<Layer
				id="mr-z-route-end"
				before="player-locations"
				layout={{
					'icon-image': 'z-green',
					'icon-size': 0.25,
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
		</Map>
	</Page>
);

export default MapTabView;

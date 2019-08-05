import * as React from 'react';
import { Page, Tab, Tabbar } from 'react-onsenui';
import MapTab from './map';
import ChatTab from './chat';
import { MapOrientation } from '../../../index.d';

interface Props {
	gameId: string;
	mapOrientation: MapOrientation;
	onMapMove: (map: mapboxgl.Map) => void;

}

const OperationTabView: React.FC<Props> = props => (
	<Page>
		<Tabbar
			index={0}
			position="auto"
			renderTabs={() => [
				{
					content: <MapTab mapOrientation={props.mapOrientation} onMove={props.onMapMove} gameId={props.gameId} key="mapTab-content" />,
					tab: <Tab label="Map" key="mapTab-button" />,
				},
				{
					content: <ChatTab key="chatTab-content" />,
					tab: <Tab label="Chat" key="chatTab-button" />,
				},
			]}
		/>
	</Page>
);

export default OperationTabView;

import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import Tab from '../../../components/Tab.component';
import MapTab from './map';
import ChatTab from './chat';

interface Props {
	gameId: string;
	mapOrientation: MapOrientation;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (event: any) => void;
	tabIndex: number;
}

const OperationTabView: React.FC<Props> = props => (
	<Page>
		<Tabbar
			index={props.tabIndex}
			position="auto"
			// @ts-ignore
			onPreChange={props.onTabChange}
			renderTabs={() => [
				{
					content: (
						<MapTab
							mapOrientation={props.mapOrientation}
							onMove={props.onMapMove}
							gameId={props.gameId}
							key="mapTab-content"
						/>
					),
					tab: <Tab label="Map" key="mapTab-button" />,
				},
				{
					content: <ChatTab key="chatTab-content" gameId={props.gameId} />,
					tab: <Tab label="Chat" key="chatTab-button" />,
				},
			]}
		/>
	</Page>
);

export default OperationTabView;

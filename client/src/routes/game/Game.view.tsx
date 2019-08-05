import * as React from 'react';
import { Page, Tabbar, Tab } from 'react-onsenui';
import TargetTabView from './target';
import OperationTabView from './operation';
import IntelTabView from './intel';
import { MapOrientation } from '../../index.d';

interface Props {
	gameId: string;
	isAdmin: boolean;
	mapOrientation: MapOrientation;
	onMapMove: (map: mapboxgl.Map) => void;
}

const GameView: React.FC<Props> = props => (
	<Page>
		<Tabbar
			index={2}
			position="auto"
			renderTabs={() => [
				{
					content: <TargetTabView key="targetTab-content" />,
					tab: <Tab label="Target" key="targetTab-button" />,
				},
				{
					content: (
						<IntelTabView
							isAdmin={props.isAdmin}
							gameId={props.gameId}
							key="intelTab-content"
						/>
					),
					tab: <Tab label="Intel" key="intelTab-button" />,
				},
				{
					content: (
						<OperationTabView
							gameId={props.gameId}
							key="operationTab-content"
							mapOrientation={props.mapOrientation}
							onMapMove={props.onMapMove}
						/>
					),
					tab: <Tab label="Operation" key="operationTab-button" />,
				},
			]}
		/>
	</Page>
);

export default GameView;

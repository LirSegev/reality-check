import * as React from 'react';
import { Page, Tabbar, Tab } from 'react-onsenui';
import TargetTabView from './target';
import OperationTabView from './operation';
import IntelTabView from './intel';

interface Props {
	gameId: string;
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
						<IntelTabView gameId={props.gameId} key="intelTab-content" />
					),
					tab: <Tab label="Intel" key="intelTab-button" />,
				},
				{
					content: (
						<OperationTabView
							gameId={props.gameId}
							key="operationTab-content"
						/>
					),
					tab: <Tab label="Operation" key="operationTab-button" />,
				},
			]}
		/>
	</Page>
);

export default GameView;

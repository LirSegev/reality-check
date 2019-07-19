import * as React from 'react';
import { Page, Tabbar, Tab } from 'react-onsenui';
import TargetTabView from './target';
import OperationTabView from './operation';
import IntelTabView from './intel';

const GameView: React.FC = () => (
	<Page>
		<Tabbar
			index={1}
			position="auto"
			swipeable={true}
			renderTabs={() => [
				{
					content: <TargetTabView key="targetTab-content" />,
					tab: <Tab label="Target" key="targetTab-button" />,
				},
				{
					content: <OperationTabView key="operationTab-content" />,
					tab: <Tab label="Operation" key="operationTab-button" />,
				},
				{
					content: <IntelTabView key="intelTab-content" />,
					tab: <Tab label="Intel" key="intelTab-button" />,
				},
			]}
		/>
	</Page>
);

export default GameView;

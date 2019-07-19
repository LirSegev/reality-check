import * as React from 'react';
import { Page, Tab, Tabbar } from 'react-onsenui';
import MapTabView from './map';
import ChatTabView from './chat';

const OperationTabView: React.FC = () => (
	<Page>
		<Tabbar
			index={0}
			position="auto"
			swipeable={true}
			renderTabs={() => [
				{
					content: <MapTabView key="mapTab-content" />,
					tab: <Tab label="Map" key="mapTab-button" />,
				},
				{
					content: <ChatTabView key="chatTab-content" />,
					tab: <Tab label="Chat" key="chatTab-button" />,
				},
			]}
		/>
	</Page>
);

export default OperationTabView;

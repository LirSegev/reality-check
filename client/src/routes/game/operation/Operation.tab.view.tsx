import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import Tab from '../../../components/Tab.component';
import MapTab from './map';
import ChatTab from './chat';
import { ReduxState } from '../../../reducers/initialState';
import { connect } from 'react-redux';

interface Props {
	mapOrientation: MapOrientation;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (event: any) => void;
	tabIndex: number;
	incrementUnreadNum: (type: UnreadType) => boolean;
	unreadNumChat: number;
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
							key="mapTab-content"
						/>
					),
					tab: <Tab label="Map" key="mapTab-button" />,
				},
				{
					content: (
						<ChatTab
							key="chatTab-content"
							incrementUnreadNum={props.incrementUnreadNum}
						/>
					),
					tab: (
						<Tab
							unreadNum={props.unreadNumChat}
							label="Chat"
							key="chatTab-button"
						/>
					),
				},
			]}
		/>
	</Page>
);

const mapState = (state: ReduxState) => ({
	tabIndex: state.main.opTabIndex,
});
export default connect(mapState)(OperationTabView);

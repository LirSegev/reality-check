import React from 'react';
import { Dialog } from 'react-onsenui';
import LegendContainer from './Legend.container';
import { ReduxState } from '../../../../../reducers/initialState';
import { toggleLegend } from '../../../../../reducers/map.reducer';
import { connect } from 'react-redux';

interface Props {
	isOpen: boolean;
	toggleLegend: ConnectedAction<typeof toggleLegend>;
}

const LegendWrapper: React.FC<Props> = props => (
	<Dialog isOpen={props.isOpen} onCancel={() => props.toggleLegend()}>
		<LegendContainer />
	</Dialog>
);

const mapState = (state: ReduxState) => ({
	isOpen: state.map.isLegendOpen,
});
const mapActions = {
	toggleLegend,
};
export default connect(
	mapState,
	mapActions
)(LegendWrapper);

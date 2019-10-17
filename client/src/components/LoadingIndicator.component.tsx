import React from 'react';
import { Modal, ProgressCircular } from 'react-onsenui';
import { connect } from 'react-redux';
import { ReduxState } from '../reducers/initialState';

const LoadingIndicator: React.FC<{ isLoading: boolean }> = props => (
	<Modal isOpen={props.isLoading} animation={'fade'}>
		<ProgressCircular indeterminate />
	</Modal>
);

const mapStateToProps = (state: ReduxState) => ({
	isLoading: state.main.isLoading,
});
export default connect(mapStateToProps)(LoadingIndicator);
export const LoadingIndicatorNoStore = LoadingIndicator;

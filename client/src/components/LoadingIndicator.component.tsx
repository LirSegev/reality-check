import React from 'react';
import { Modal, ProgressCircular } from 'react-onsenui';

const LoadingIndicator: React.FC<{ isLoading: boolean }> = props => (
	<Modal isOpen={props.isLoading}>
		<ProgressCircular indeterminate />
	</Modal>
);

export default LoadingIndicator;

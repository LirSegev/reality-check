import React from 'react';
import { Modal, ProgressCircular } from 'react-onsenui';

const LoadingIndicator: React.FC<{ isLoading: boolean }> = props => (
	<Modal isOpen={props.isLoading} animation={'fade'}>
		<ProgressCircular indeterminate />
	</Modal>
);

export default LoadingIndicator;

import React from 'react';
import { ProgressCircular } from 'react-onsenui';

const LoadingIndicator: React.FC = props => (
	<section style={{ textAlign: 'center' }}>
		<ProgressCircular indeterminate />
	</section>
);

export default LoadingIndicator;

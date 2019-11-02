import React from 'react';
import { Dialog } from 'react-onsenui';
import LegendContainer from './Legend.container';

const LegendWrapper: React.FC = () => (
	<Dialog isOpen={true}>
		<LegendContainer />
	</Dialog>
);

export default LegendWrapper;

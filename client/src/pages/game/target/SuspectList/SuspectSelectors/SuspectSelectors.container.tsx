import React from 'react';
import SuspectSelectorsView from './SuspectSelectors.view';

interface Props {
	showLegend: boolean;
}

class SuspectSelectorsContainer extends React.Component<Props> {
	_stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

	render = () => {
		const { _stopPropagation: stopPropagation, props } = this;
		const { showLegend } = props;
		return <SuspectSelectorsView {...{ stopPropagation, showLegend }} />;
	};
}

export default SuspectSelectorsContainer;

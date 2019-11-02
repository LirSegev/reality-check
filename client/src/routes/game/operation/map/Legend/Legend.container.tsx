import React from 'react';
import ReactDOM from 'react-dom';
import LegendView from './Legend.view';
import styles from './Legend.module.css';

class LegendContainer extends React.Component {
	componentDidMount() {
		ReactDOM.findDOMNode(this)!.parentElement!.parentElement!.id =
			styles.legend;
	}

	render() {
		return <LegendView />;
	}
}

export default LegendContainer;

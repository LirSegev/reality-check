import React from 'react';
import ReactDOM from 'react-dom';
import LegendView from './Legend.view';
import styles from './Legend.module.css';
import { store } from '../../../../../index';
import { toggleLegend } from '../../../../../reducers/map.reducer';

class LegendContainer extends React.Component {
	componentDidMount() {
		ReactDOM.findDOMNode(this)!.parentElement!.parentElement!.id =
			styles.legend;
	}

	_closeLegend() {
		store.dispatch(toggleLegend());
	}

	render() {
		return <LegendView closeLegend={this._closeLegend} />;
	}
}

export default LegendContainer;

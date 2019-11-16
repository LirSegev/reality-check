import React from 'react';
import { Tab } from 'react-onsenui';
import ReactDOM from 'react-dom';
import styles from './Tab.module.css';

interface Props {
	label: string;
	icon?: string;
	unreadNum?: number;
}

class TabComponent extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this._updateUnreadNum = this._updateUnreadNum.bind(this);
	}

	componentDidMount() {
		// Wait for the button element to be added
		new MutationObserver((mutations, observer) => {
			try {
				const node = document.createElement('div');
				node.className = `ui circular blue label ${styles.label}`;
				(ReactDOM.findDOMNode(this.refs.tab) as Element)
					.querySelector('button')!
					.append(node);
				observer.disconnect();
				this._updateUnreadNum(this.props.unreadNum);
			} catch (err) {}
		}).observe((ReactDOM.findDOMNode(this.refs.tab) as Element) as Node, {
			childList: true,
		});
	}

	componentDidUpdate() {
		// For some reason this is called at the initial render
		// since the unreadNum element isn't until after the button element is added
		// this throws an error at the initial render
		try {
			this._updateUnreadNum(this.props.unreadNum);
		} catch (err) {}
	}

	_updateUnreadNum(unreadNum?: number) {
		(ReactDOM.findDOMNode(this.refs.tab) as Element).querySelector(
			'.ui.label'
		)!.innerHTML = String(unreadNum || '');
	}

	render() {
		return <Tab ref="tab" label={this.props.label} icon={this.props.icon} />;
	}
}

export default TabComponent;

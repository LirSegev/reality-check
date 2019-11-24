import React from 'react';

import styles from './Tabbar.module.css';

export interface Props {
	tabs: {
		tabTitle: string;
		content: JSX.Element;
	}[];
	index: number;
	handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TabbarView: React.FC<Props> = props => {
	const tabs = props.tabs.map((tab, index) => {
		const classes = [styles.button];
		if (index === props.index) classes.push(styles.active);

		return (
			<button
				className={classes.join(' ')}
				onClick={props.handleClick}
				data-index={index}
				key={`tabButton_${index}-${tab.tabTitle}`}
			>
				{tab.tabTitle}
			</button>
		);
	});

	return <div className={styles.bar}>{tabs}</div>;
};

export default TabbarView;

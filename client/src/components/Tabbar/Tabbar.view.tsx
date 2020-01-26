import React from 'react';

import styles from './Tabbar.module.css';

export interface Props {
	tabs: NonEmptyArray<{
		tabTitle: string;
		content: JSX.Element;
		className?: string;
	}>;
	index: number;
	handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TabbarView: React.FC<Props> = props => {
	const tabs = props.tabs.map((tab, index) => {
		const classes = [styles.button];
		if (tab.className) classes.push(tab.className);

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

	return (
		<React.Fragment>
			<div className={styles.bar}>{tabs}</div>
			<div className={styles.content} data-testid="content">
				{props.tabs[props.index].content}
			</div>
		</React.Fragment>
	);
};

export default TabbarView;

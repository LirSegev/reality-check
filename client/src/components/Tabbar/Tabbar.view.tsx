import React from 'react';
import styles from './Tabbar.module.css';

interface Props {
	tabs: {
		tabTitle: string;
		content: JSX.Element;
	}[];
	index: number;
	onChange?: (e: { index: number }) => void;
}

const TabbarView: React.FC<Props> = props => {
	const tabs = props.tabs.map((tab, index) => {
		const classes = [styles.button];
		if (index === props.index) classes.push(styles.active);

		return <button className={classes.join(' ')}>{tab.tabTitle}</button>;
	});

	return <div className={styles.bar}>{tabs}</div>;
};

export default TabbarView;

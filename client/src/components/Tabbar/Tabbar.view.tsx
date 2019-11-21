import React from 'react';
import styles from './Tabbar.module.css';

const TabbarView: React.FC = () => (
	<div className={styles.bar}>
		<button className={`${styles.button} ${styles.active}`}>Test</button>
		<button className={styles.button}>Test2</button>
		<button className={styles.button}>Test3</button>
		<button className={styles.button}>Test4</button>
		<button className={styles.button}>Test5</button>
		<button className={styles.button}>Test6</button>
		<button className={styles.button}>Test7</button>
	</div>
);

export default TabbarView;

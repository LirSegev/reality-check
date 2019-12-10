import React from 'react';
import { Card } from 'react-onsenui';

import { PlayerAction } from '../../../../util/db.types';
import styles from './Chat.module.css';

interface Props {
	action: PlayerAction;
}

const ActionItemComponent: React.FC<Props> = ({ action }) => {
	let text = '';

	switch (action.action) {
		case 'collected':
			text = `${action.subject.displayName} ${action.action} a point`;
			break;
		case 'marked':
			text = `${action.subject.displayName} ${action.action} ${action.object.name} as the main suspect`;
			break;
		case 'questioned':
			text = `${action.subject.displayName} ${action.action} a suspect`;
			break;
	}
	return (
		<React.Fragment>
			<div style={{ clear: 'both' }}></div>
			<Card className={[styles.chatItem, styles.middle, styles.action].join(' ')} >
				{text}
			</Card>
		</React.Fragment>
	);
};

export default ActionItemComponent;

import React from 'react';
import { PlayerAction } from '../../../../util/db.types';

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
	return <div>{text}</div>;
};

export default ActionItemComponent;

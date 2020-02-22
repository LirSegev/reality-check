import React from 'react';
import { Dialog } from 'react-onsenui';

interface Props {
	isOpen: boolean;
	closeList: () => void;
	openList: () => void;
	content: JSX.Element;
	button: JSX.Element;
}

const DialogWithButtonView: React.FC<Props> = props => (
	<div>
		<div onClick={props.openList}>{props.button}</div>
		<Dialog isOpen={props.isOpen} onCancel={props.closeList}>
			{props.content}
		</Dialog>
	</div>
);

export default DialogWithButtonView;

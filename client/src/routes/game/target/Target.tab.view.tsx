import * as React from 'react';
import { Page } from 'react-onsenui';
import Suspects from './suspects';
import Clues from './clues';

interface Props {
	incrementUnreadNum: (type: UnreadType) => boolean;
}

const TargetTabView: React.FC<Props> = props => (
	<Page>
		<div style={{ height: '100%' }}>
			<Suspects />
			<Clues incrementUnreadNum={props.incrementUnreadNum} />
		</div>
	</Page>
);

export default TargetTabView;

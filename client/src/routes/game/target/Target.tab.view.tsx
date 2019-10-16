import * as React from 'react';
import { Page } from 'react-onsenui';
import Suspects from './suspects';
import Clues from './clues';

interface Props {
	gameId: string;
	incrementUnreadNum: (type: UnreadType) => boolean;
}

const TargetTabView: React.FC<Props> = props => (
	<Page>
		<div style={{ height: '100%' }}>
			<Suspects gameId={props.gameId} />
			<Clues
				gameId={props.gameId}
				incrementUnreadNum={props.incrementUnreadNum}
			/>
		</div>
	</Page>
);

export default TargetTabView;

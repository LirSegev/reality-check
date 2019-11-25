import * as React from 'react';
import { Page } from 'react-onsenui';
import Suspects from './suspects';
import Clues from './clues';
import Tabbar from '../../../components/Tabbar';
import SuspectStory from './SuspectStory.component';

interface Props {
	incrementUnreadNum: (type: UnreadType) => boolean;
}

const TargetTabView: React.FC<Props> = props => (
	<Page>
		<div style={{ height: '100%' }}>
			<Suspects />
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: (
							<SuspectStory
								suspect={require('../../../files/suspect_stories/0.json')}
							/>
						),
					},
					{
						tabTitle: 'tom',
						content: <div>Tom's content</div>,
					},
				]}
			/>
			{/* <Clues incrementUnreadNum={props.incrementUnreadNum} /> */}
		</div>
	</Page>
);

export default TargetTabView;

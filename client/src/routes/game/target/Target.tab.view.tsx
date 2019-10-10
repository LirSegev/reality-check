import * as React from 'react';
import { Page } from 'react-onsenui';
import Suspects from './suspects';
import Clues from './clues';

const TargetTabView: React.FC = () => (
	<Page>
		<div style={{ height: '100%' }}>
			<Suspects />
			<Clues />
		</div>
	</Page>
);

export default TargetTabView;

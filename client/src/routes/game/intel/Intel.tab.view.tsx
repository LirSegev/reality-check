import * as React from 'react';
import { Page, List } from 'react-onsenui';
import renderIntelItem from './renderIntelItem';
import { IntelItem } from './Intel.d';

interface Props {
	intelItems: IntelItem[];
}

const IntelTabView: React.FC<Props> = props => (
	<Page>
		<section>
			<List dataSource={props.intelItems} renderRow={renderIntelItem} />
		</section>
		<a
			style={{
				position: 'absolute',
				bottom: '10px',
				color: '#999999',
				textDecoration: 'none',
			}}
			href="https://icons8.com"
		>
			Icons by Icons8
		</a>
	</Page>
);

export default IntelTabView;

import * as React from 'react';
import { Page, List, Fab, Icon, Dialog } from 'react-onsenui';
import renderIntelItem from './renderIntelItem';
import { IntelItem } from './Intel.d';

interface Props {
	intelItems: IntelItem[];
	isAddItemOpen: boolean;
	isAdmin: boolean;
	openAddItem: () => void;
	hideAddItem: () => void;
}

const IntelTabView: React.FC<Props> = props => (
	<Page
		renderFixed={() => {
			if (props.isAdmin)
				return (
					<Fab position="bottom right" onClick={props.openAddItem}>
						<Icon icon="md-plus" />
					</Fab>
				);
		}}
	>
		<Dialog isOpen={props.isAddItemOpen} onCancel={props.hideAddItem}>
			<Page>
				<h1>test</h1>
			</Page>
		</Dialog>
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

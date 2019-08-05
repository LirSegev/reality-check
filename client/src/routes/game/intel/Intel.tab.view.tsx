import * as React from 'react';
import { Page, List, Fab, Icon, Dialog } from 'react-onsenui';
import renderIntelItem from './renderIntelItem';
import { IntelItem } from './Intel.d';
import NewIntelItemForm from './NewIntelItemForm.component';
import styles from './Intel.module.css';

interface Props {
	intelItems: IntelItem[];
	isAddItemOpen: boolean;
	isAdmin: boolean;
	gameId: string;
	openAddItem: () => void;
	hideAddItem: () => void;
	handleClick: (e: React.MouseEvent<any, MouseEvent>) => void
}

const IntelTabView: React.FC<Props> = props => {
	const renderIntelItemWithProps = renderIntelItem({handleClick: props.handleClick});
	
	return (
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
			<NewIntelItemForm hideAddItem={props.hideAddItem} gameId={props.gameId} />
		</Dialog>
		<section className={styles.wrapper}>
			<List dataSource={props.intelItems} renderRow={renderIntelItemWithProps} />
			<a className={styles.footer} href="https://icons8.com">
				Icons by Icons8
			</a>
		</section>
	</Page>
)};

export default IntelTabView;

import * as React from 'react';
import { Page, List, Fab, Icon, Dialog } from 'react-onsenui';
import renderIntelItem from './renderIntelItem';
import NewIntelItemForm from './NewIntelItemForm';
import styles from './Intel.module.css';
import { ReduxState } from '../../../reducers/initialState';
import { connect } from 'react-redux';
import { IntelItem } from '../../../util/db.types';

interface Props {
	intelItems: IntelItem[];
	isAddItemOpen: boolean;
	isAdmin: boolean;
	gameId: string | null;
	openAddItem: () => void;
	hideAddItem: () => void;
	handleClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const IntelTabView: React.FC<Props> = props => {
	const renderIntelItemWithProps = renderIntelItem({
		handleClick: props.handleClick,
	});

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
				<NewIntelItemForm
					hideAddItem={props.hideAddItem}
					gameId={props.gameId}
					closeAddItem={props.hideAddItem}
					openAddItem={props.openAddItem}
				/>
			</Dialog>
			<section className={styles.wrapper}>
				<List
					dataSource={props.intelItems}
					renderRow={renderIntelItemWithProps}
				/>
				<a className={styles.footer} href="https://icons8.com">
					Icons by Icons8
				</a>
			</section>
		</Page>
	);
};

const mapState = (state: ReduxState) => ({
	gameId: state.main.gameId,
	isAdmin: state.main.isAdmin,
});
export default connect(mapState)(IntelTabView);

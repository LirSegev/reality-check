import React from 'react';
import { Button, Input, Select } from 'react-onsenui';

import { LoadingIndicatorNoStore as LoadingIndicator } from '../../../../components/LoadingIndicator.component';
import { MetroLine } from '../Intel.d';
import MoreInput from './moreInput.component';
import styles from './NewIntelItemForm.module.css';
import { ActionType } from '../../../../util/db.types';

interface Props {
	type: ActionType;
	more: number | MetroLine | string;
	location: firebase.firestore.GeoPoint | null;
	time: string;
	isLoading: boolean;
	onMyLocation: () => void;
	onMapLocation: () => void;
	submit: () => void;
	handleMoreChange: (e: React.ChangeEvent<any>) => void;
	handleTypeChange: (e: React.ChangeEvent<any>) => void;
	handleTimeChange: (e: React.ChangeEvent<any>) => void;
}

const NewIntelItemFormView: React.FC<Props> = props => {
	const moreInputProps = {
		onChange: props.handleMoreChange,
		value: props.more as string,
	};

	return (
		<section
			style={{
				padding: '10px',
			}}
		>
			<LoadingIndicator isLoading={props.isLoading} />
			<div className={[styles.input, styles.inline].join(' ')}>
				<label>Type</label>
				<Select value={props.type} onChange={props.handleTypeChange}>
					<option value="tram">Tram</option>
					<option value="metro">Metro</option>
					<option value="bus">Bus</option>
					<option value="walking">Walking</option>
				</Select>
			</div>
			<div className={[styles.input, styles.inline].join(' ')}>
				<label>Time</label>
				<Input
					type="time"
					value={props.time}
					onChange={props.handleTimeChange}
				/>
			</div>
			<div className={styles.input}>
				<label>More</label>
				<MoreInput
					moreInputProps={moreInputProps}
					location={props.location}
					onMyLocation={props.onMyLocation}
					onMapLocation={props.onMapLocation}
					type={props.type}
				/>
			</div>
			<Button style={{ float: 'right' }} onClick={props.submit}>
				Add
			</Button>
			<div style={{ clear: 'right' }} />
		</section>
	);
};

export default NewIntelItemFormView;

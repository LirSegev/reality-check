import React from 'react';
import { Select, Input, Button } from 'react-onsenui';
import { ActionType, MetroLine } from './Intel.d';
import * as firebase from 'firebase/app';
import { IntelItem } from './Intel';

interface State {
	type: ActionType;
	more: number | MetroLine | string;
	time: string;
}
interface Props {
	gameId: string;
	hideAddItem: () => void;
}

class NewIntelItemForm extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			type: 'tram',
			more: '',
			time: new Date().toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		this._handleTypeChange = this._handleTypeChange.bind(this);
		this._handleMoreChange = this._handleMoreChange.bind(this);
		this._handleTimeChange = this._handleTimeChange.bind(this);
		this._submit = this._submit.bind(this);
	}

	_handleTypeChange(e: React.ChangeEvent<any>) {
		this.setState({
			type: (e.target as HTMLSelectElement).value as ActionType,
		});
	}

	_handleMoreChange(e: React.ChangeEvent<any>) {
		this.setState({
			more: (e.target as HTMLSelectElement | HTMLInputElement).value as
				| number
				| string,
		});
	}

	_handleTimeChange(e: React.ChangeEvent<any>) {
		this.setState({
			time: (e.target as HTMLInputElement).value as string,
		});
	}

	_submit() {
		const type = (this.refs.type as Select).props.value;
		const more = (this.refs.more as Select | Input).props.value;
		const time = (this.refs.time as Input).props
			.value!.split(':')
			.map(num => Number(num));
		const db = firebase.firestore();
		db.collection(`games/${this.props.gameId}/intel`)
			.add({
				action: {
					type,
					more,
				},
				timestamp: new firebase.firestore.Timestamp(
					Math.round(new Date().setHours(time[0], time[1], 0) / 1000),
					0
				),
			} as IntelItem)
			.then(() => {
				this.props.hideAddItem();
			})
			.catch(err => console.error(new Error('Error adding intel item:'), err));
	}

	render = () => {
		const { type } = this.state;

		const moreInputProps = {
			onChange: this._handleMoreChange,
			value: this.state.more as string,
			ref: 'more',
		};
		const moreInput =
			type === 'tram' || type === 'bus' ? (
				<Input {...moreInputProps} modifier="underbar" type="number" />
			) : type === 'walking' ? (
				<Input {...moreInputProps} modifier="underbar" type="text" />
			) : (
				<Select {...moreInputProps}>
					<option value={MetroLine.A}>Green line</option>
					<option value={MetroLine.B}>Yellow line</option>
					<option value={MetroLine.C}>Red line</option>
				</Select>
			);

		return (
			<div>
				<p>Type</p>
				<Select
					ref="type"
					value={this.state.type}
					onChange={this._handleTypeChange}
				>
					<option value="tram">Tram</option>
					<option value="metro">Metro</option>
					<option value="bus">Bus</option>
					<option value="walking">Walking</option>
				</Select>
				<p>More</p>
				{moreInput}
				<p>Time</p>
				<Input
					type="time"
					ref="time"
					value={this.state.time}
					onChange={this._handleTimeChange}
				/>
				<Button onClick={this._submit}>Add</Button>
			</div>
		);
	};
}

export default NewIntelItemForm;

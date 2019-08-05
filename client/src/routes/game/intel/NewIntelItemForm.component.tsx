import React from 'react';
import { Select, Input, Button, Icon } from 'react-onsenui';
import { ActionType, MetroLine } from './Intel.d';
import * as firebase from 'firebase/app';
import { IntelItem } from './Intel';
import styles from './NewIntelItemForm.module.css';
import mapboxConfig from '../../../config/Mapbox';

interface State {
	type: ActionType;
	more: number | MetroLine | string;
	location: firebase.firestore.GeoPoint | null;
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
			location: null,
			time: new Date().toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		this._handleTypeChange = this._handleTypeChange.bind(this);
		this._handleMoreChange = this._handleMoreChange.bind(this);
		this._handleTimeChange = this._handleTimeChange.bind(this);
		this._onMyLocation = this._onMyLocation.bind(this);
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
		const { type, more } = this.state;
		const time = this.state.time.split(':').map(num => Number(num));
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

	_onMyLocation() {
		if (!navigator.geolocation) alert('Geolocation is not available');
		else {
			navigator.geolocation.getCurrentPosition(
				pos => {
					console.log(pos);
					fetch(
						`https://api.mapbox.com/geocoding/v5/mapbox.places/${
							pos.coords.longitude
						}%2C${pos.coords.latitude}.json?access_token=${
							mapboxConfig.accessToken
						}`
					)
						.then(res => res.json())
						.then(res => {
							console.log(res);
							const location = new firebase.firestore.GeoPoint(
								pos.coords.latitude,
								pos.coords.longitude
							);

							if (res.features.length) {
								const main = res.features[0];
								this.setState({
									more: `${main.text}, ${main.properties.address}`,
									location,
								});
							} else {
								this.setState({
									more: 'Unknown',
									location,
								});
							}
						})
						.catch(err => console.error(err));
				},
				err => {
					if (err.code === err.PERMISSION_DENIED)
						alert("Access to your device's location is required");
					else {
						console.error(err);
						alert('There was an error trying to get your location');
					}
				}
			);
		}
	}

	render = () => {
		const { type } = this.state;

		const moreInputProps = {
			onChange: this._handleMoreChange,
			value: this.state.more as string,
		};
		const moreInput =
			type === 'tram' || type === 'bus' ? (
				<Input {...moreInputProps} modifier="underbar" type="number" />
			) : type === 'walking' ? (
				<div style={{ display: 'flex' }}>
					<Button
						modifier="quiet"
						style={{
							display: 'inline-block',
							marginRight: '5px',
							color: this.state.location ? '#33b5e5' : '',
							flex: '0 0 auto',
						}}
						onClick={this._onMyLocation}
					>
						<Icon style={{ height: '32px' }} icon="md-gps-dot" />{' '}
					</Button>
					<Input {...moreInputProps} modifier="underbar" type="text" />
				</div>
			) : (
				<Select {...moreInputProps}>
					<option value={MetroLine.A}>Green line</option>
					<option value={MetroLine.B}>Yellow line</option>
					<option value={MetroLine.C}>Red line</option>
				</Select>
			);

		return (
			<section
				style={{
					padding: '10px',
				}}
			>
				<div className={[styles.input, styles.inline].join(' ')}>
					<label>Type</label>
					<Select value={this.state.type} onChange={this._handleTypeChange}>
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
						value={this.state.time}
						onChange={this._handleTimeChange}
					/>
				</div>
				<div className={styles.input}>
					<label>More</label>
					{moreInput}
				</div>
				<Button style={{ float: 'right' }} onClick={this._submit}>
					Add
				</Button>
				<div style={{ clear: 'right' }} />
			</section>
		);
	};
}

export default NewIntelItemForm;

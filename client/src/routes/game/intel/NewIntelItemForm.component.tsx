import React from 'react';
import { Select, Input, Button, Icon } from 'react-onsenui';
import { ActionType, MetroLine, IntelItem } from './Intel.d';
import * as firebase from 'firebase/app';
import styles from './NewIntelItemForm.module.css';
import mapboxConfig from '../../../config/Mapbox';
import { LoadingIndicatorNoStore as LoadingIndicator } from '../../../components/LoadingIndicator.component';

interface State {
	type: ActionType;
	more: number | MetroLine | string;
	location: firebase.firestore.GeoPoint | null;
	time: string;
	isLoading: boolean;
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
			isLoading: false,
		};

		document.addEventListener('onadditemopen', this._updateTime.bind(this));

		this._handleTypeChange = this._handleTypeChange.bind(this);
		this._handleMoreChange = this._handleMoreChange.bind(this);
		this._handleTimeChange = this._handleTimeChange.bind(this);
		this._onMyLocation = this._onMyLocation.bind(this);
		this._submit = this._submit.bind(this);
		this._sendNotification = this._sendNotification.bind(this);
	}

	_updateTime() {
		this.setState({
			time: new Date().toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		});
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
		const { type, more, location } = this.state;
		const time = this.state.time.split(':').map(num => Number(num));

		const db = firebase.firestore();
		db.collection(`games/${this.props.gameId}/intel`)
			.add({
				action: {
					type,
					text: more,
					...(location && { coordinates: location }),
				},
				timestamp: new firebase.firestore.Timestamp(
					Math.round(new Date().setHours(time[0], time[1], 0) / 1000),
					0
				),
			} as IntelItem)
			.then(() => {
				this.props.hideAddItem();
				// this._sendNotification();
			})
			.catch(err => console.error(new Error('Error adding intel item:'), err));
	}

	_sendNotification() {
		firebase
			.functions()
			.httpsCallable('sendNotificationToGroup')({
				gameId: this.props.gameId,
				notification: {
					title: 'New intel on Mr. Z',
				},
			})
			.then((res: any) => {
				if (res.failure) {
					// prettier-ignore
					alert(`Failed to send notification to ${res.failure} devices out of ${res.success + res.failure}`)
					throw new Error(res);
				}
			})
			.catch(err =>
				console.error(
					new Error('Error sending notification to device group:'),
					err
				)
			);
	}

	_onMyLocation() {
		if (!navigator.geolocation) alert('Geolocation is not available');
		else {
			this.setState({
				isLoading: true,
			});
			navigator.geolocation.getCurrentPosition(
				pos => {
					fetch(
						`https://api.mapbox.com/geocoding/v5/mapbox.places/${pos.coords.longitude}%2C${pos.coords.latitude}.json?access_token=${mapboxConfig.accessToken}`
					)
						.then(res => res.json())
						.then(res => {
							const location = new firebase.firestore.GeoPoint(
								pos.coords.latitude,
								pos.coords.longitude
							);

							if (res.features.length) {
								const main = res.features[0];
								this.setState({
									more: `${main.text}, ${main.properties.address}`,
									location,
									isLoading: false,
								});
							} else {
								this.setState({
									more: 'Unknown',
									location,
									isLoading: false,
								});
							}
						})
						.catch(err =>
							console.error(
								new Error('Error fetching address from mapbox.places api'),
								err
							)
						);
				},
				err => {
					if (err.code === err.PERMISSION_DENIED)
						alert("Access to your device's location is required");
					else {
						console.error(new Error('Error getting user location:'), err);
						alert('There was an error trying to get your location');
					}
					this.setState({ isLoading: false });
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
				<LoadingIndicator isLoading={this.state.isLoading} />
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

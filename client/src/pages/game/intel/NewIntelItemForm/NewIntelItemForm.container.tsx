import * as firebase from 'firebase/app';
import React from 'react';

import mapboxConfig from '../../../../config/Mapbox';
import { getGameDocRef } from '../../../../util/db';
import { ActionType, IntelItem, MetroLine } from '../Intel.d';
import NewIntelItemFormView from './NewIntelItemForm.view';

interface State {
	type: ActionType;
	more: number | MetroLine | string;
	location: firebase.firestore.GeoPoint | null;
	time: string;
	isLoading: boolean;
}
interface Props {
	gameId: string | null;
	hideAddItem: () => void;
}

class NewIntelItemFormContainer extends React.Component<Props, State> {
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
		this._setMoreLocation = this._setMoreLocation.bind(this);
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

		getGameDocRef()
			.collection('intel')
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
		if (this.props.gameId)
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
		else console.error(new Error('gameId is null'));
	}

	_onMyLocation() {
		if (!navigator.geolocation) alert('Geolocation is not available');
		else {
			this.setState({
				isLoading: true,
			});
			navigator.geolocation.getCurrentPosition(this._setMoreLocation, err => {
				if (err.code === err.PERMISSION_DENIED)
					alert("Access to your device's location is required");
				else {
					console.error(new Error('Error getting user location:'), err);
					alert('There was an error trying to get your location');
				}
				this.setState({ isLoading: false });
			});
		}
	}

	_setMoreLocation(pos: Position) {
		const { longitude, latitude } = pos.coords;
		const location = new firebase.firestore.GeoPoint(latitude, longitude);

		this._getAddressFromCoord(latitude, longitude)
			.then(address => {
				this.setState({
					more: address,
					location,
					isLoading: false,
				});
			})
			.catch(err => {
				this.setState({
					more: 'Unknown',
					location,
					isLoading: false,
				});
			});
	}

	// TODO: look into getting better results
	_getAddressFromCoord(lat: number, long: number) {
		return fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${long}%2C${lat}.json?access_token=${mapboxConfig.accessToken}`
		)
			.then(res => res.json())
			.then(res => {
				if (res.features.length) {
					const main = res.features[0];
					return `${main.text}, ${main.properties.address}`;
				} else {
					throw new Error('No address found');
				}
			})
			.catch(err => {
				console.error(err);
				throw new Error('Fetching address from mapbox.places api');
			});
	}

	render = () => (
		<NewIntelItemFormView
			{...this.state}
			handleMoreChange={this._handleMoreChange}
			handleTimeChange={this._handleTimeChange}
			handleTypeChange={this._handleTypeChange}
			onMyLocation={this._onMyLocation}
			submit={this._submit}
		/>
	);
}

export default NewIntelItemFormContainer;

import React from 'react';
import { Button, Icon, Input } from 'react-onsenui';

interface Props {
	onChange: (e: React.ChangeEvent<any>) => void;
	value: string;
	location: firebase.firestore.GeoPoint | null;
	onMyLocation: () => void;
	onMapLocation: () => void;
}

const MoreInputLocationInput: React.FC<Props> = props => {
	const buttonStyle = {
		display: 'inline-block',
		marginRight: '5px',
		color: props.location ? '' : '#000',
		flex: '0 0 auto',
		padding: '0.25em',
	};

	return (
		<div style={{ display: 'flex' }}>
			<Button modifier="quiet" style={buttonStyle} onClick={props.onMyLocation}>
				<Icon icon="md-gps-dot" size={20} />{' '}
			</Button>
			<Button
				modifier="quiet"
				style={buttonStyle}
				onClick={props.onMapLocation}
			>
				<Icon icon="md-map" size={20} />{' '}
			</Button>
			<Input
				onChange={props.onChange}
				value={props.value}
				modifier="underbar"
				type="text"
			/>
		</div>
	);
};

export default MoreInputLocationInput;

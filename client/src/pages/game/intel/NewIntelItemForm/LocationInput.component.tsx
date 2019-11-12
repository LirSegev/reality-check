import React from 'react';
import { Button, Icon, Input } from 'react-onsenui';

interface Props {
	onChange: (e: React.ChangeEvent<any>) => void;
	value: string;
	location: firebase.firestore.GeoPoint | null;
	onMyLocation: () => void;
	onMapLocation: () => void;
}

const MoreInputLocationInput: React.FC<Props> = props => (
	<div style={{ display: 'flex' }}>
		<Button
			modifier="quiet"
			style={{
				display: 'inline-block',
				marginRight: '5px',
				color: props.location ? '' : '#000',
				flex: '0 0 auto',
			}}
			onClick={props.onMyLocation}
		>
			<Icon style={{ height: '32px' }} icon="md-gps-dot" />{' '}
		</Button>
		<Button
			modifier="quiet"
			style={{
				display: 'inline-block',
				marginRight: '5px',
				color: props.location ? '' : '#000',
				flex: '0 0 auto',
			}}
			onClick={props.onMapLocation}
		>
			<Icon style={{ height: '32px' }} icon="md-map" />{' '}
		</Button>
		<Input
			onChange={props.onChange}
			value={props.value}
			modifier="underbar"
			type="text"
		/>
	</div>
);

export default MoreInputLocationInput;

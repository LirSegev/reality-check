import React from 'react';

import LocationInput from './LocationInput.component';
import MetroInput from './MetroInput.component';
import NumberInput from './NumberInput.component';

interface Props {
	type: DB.Game.Intel.ActionType;
	moreInputProps: {
		onChange: (e: React.ChangeEvent<any>) => void;
		value: string;
	};
	location: firebase.firestore.GeoPoint | null;
	onMyLocation: () => void;
	onMapLocation: () => void;
}

const MoreInput: React.FC<Props> = props =>
	props.type === 'tram' || props.type === 'bus' ? (
		<NumberInput {...props.moreInputProps} />
	) : props.type === 'walking' ? (
		<LocationInput
			{...props.moreInputProps}
			location={props.location}
			onMyLocation={props.onMyLocation}
			onMapLocation={props.onMapLocation}
		/>
	) : (
		<MetroInput {...props.moreInputProps} />
	);

export default MoreInput;

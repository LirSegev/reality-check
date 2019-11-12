import React from 'react';
import { Select } from 'react-onsenui';
import { MetroLine } from '../Intel.d';

interface Props {
	onChange: (e: React.ChangeEvent<any>) => void;
	value: string;
}

const MoreInputMetroInput: React.FC<Props> = props => (
	<Select {...props}>
		<option value={MetroLine.A}>Green line</option>
		<option value={MetroLine.B}>Yellow line</option>
		<option value={MetroLine.C}>Red line</option>
	</Select>
);

export default MoreInputMetroInput;

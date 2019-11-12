import React from 'react';
import { Input } from 'react-onsenui';

interface Props {
	onChange: (e: React.ChangeEvent<any>) => void;
	value: string;
}

const MoreInputNumberInput: React.FC<Props> = props => (
	<Input {...props} modifier="underbar" type="number" />
);

export default MoreInputNumberInput;

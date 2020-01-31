import React from 'react';

interface Props {
	onChange?: () => void;
	checked?: boolean;
}

const Checkbox: React.FC<Props> = props => (
	<label className="checkbox">
		<input
			onChange={props.onChange}
			checked={props.checked}
			type="checkbox"
			className="checkbox__input"
		/>
		<div className="checkbox__checkmark"></div>
	</label>
);

export default Checkbox;

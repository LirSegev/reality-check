import React from 'react';
import { Select } from 'react-onsenui';

interface State {
	value: string;
}

class SelectRole extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			value: '',
		};

		this._onChange = this._onChange.bind(this);
	}

	_onChange(e: React.ChangeEvent<HTMLSelectElement>) {
		this.setState({
			value: e.currentTarget.value,
		});
	}

	render() {
		return (
			<Select
				modifier="underbar"
				value={this.state.value}
				name="role"
				onChange={this._onChange}
			>
				<option value="" disabled>
					Role
				</option>
				<option value="detective">Detective</option>
				<option value="intelligence">Intelligence Collector</option>
				<option value="chaser">Chaser</option>
			</Select>
		);
	}
}

export default SelectRole;

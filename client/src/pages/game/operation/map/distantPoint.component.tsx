import React from 'react';
import ReactDOM from 'react-dom';
import {
	deg2rad,
	rad2deg,
	bearingBetweenPoints,
} from '../../../../util/general';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';

interface Props {
	mapOrientation: MapOrientation;
	coordinate: { longitude: number; latitude: number };
}
interface State {
	position: {
		top?: number;
		bottom?: number;
		right?: number;
		left?: number;
	};
}

class DistantPoint extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			position: {},
		};
	}

	componentDidMount() {
		this._setPosition(this._getBearing());
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props !== prevProps) this._setPosition(this._getBearing());
	}

	_getBearing() {
		const start = {
			latitude: this.props.mapOrientation.center.latitude,
			longitude: this.props.mapOrientation.center.longitude,
			accuracy: 0,
		} as Coordinates;
		const end = {
			latitude: this.props.coordinate.latitude,
			longitude: this.props.coordinate.longitude,
			accuracy: 0,
		} as Coordinates;

		const unadjustedBearing = bearingBetweenPoints(start, end);
		const adjustedBearing =
			(unadjustedBearing + (360 - this.props.mapOrientation.bearing)) % 360;
		return adjustedBearing;
	}

	_setPosition(bearing: number) {
		const thisEl = ReactDOM.findDOMNode(this)! as Element;
		const parentEl = thisEl.parentElement!;

		const height = parentEl.clientHeight - thisEl.clientHeight;
		const width = parentEl.clientWidth - thisEl.clientWidth;

		if (bearing > 360 || bearing < 0)
			console.error(new Error('Bearing is out of bounds (should be 0-360)'));

		let position: State['position'] = {};
		const atan = rad2deg(Math.atan(width / height));
		switch (true) {
			case bearing <= atan:
				position = {
					left: width / 2 + (height / 2) * Math.tan(deg2rad(bearing % 90)),
					top: 0,
				};
				break;
			case bearing <= 90:
				position = {
					top:
						height / 2 - (width / 2) * Math.tan(deg2rad(90 - (bearing % 90))),
					right: 0,
				};
				break;
			case bearing <= 180 - atan:
				position = {
					top: height / 2 + (width / 2) * Math.tan(deg2rad(bearing % 90)),
					right: 0,
				};
				break;
			case bearing <= 180:
				position = {
					left:
						width / 2 + (height / 2) * Math.tan(deg2rad(90 - (bearing % 90))),
					bottom: 0,
				};
				break;
			case bearing <= atan + 180:
				position = {
					left: width / 2 - (height / 2) * Math.tan(deg2rad(bearing % 90)),
					bottom: 0,
				};
				break;
			case bearing <= 270:
				position = {
					top:
						height / 2 + (width / 2) * Math.tan(deg2rad(90 - (bearing % 90))),
					left: 0,
				};
				break;
			case bearing <= 360 - atan:
				position = {
					top: height / 2 - (width / 2) * Math.tan(deg2rad(bearing % 90)),
					left: 0,
				};
				break;
			case bearing <= 360:
				position = {
					left:
						width / 2 - (height / 2) * Math.tan(deg2rad(90 - (bearing % 90))),
					top: 0,
				};
				break;
		}

		this.setState(prevState => ({
			...prevState,
			position,
		}));
	}

	render() {
		const style: React.CSSProperties = {
			position: 'absolute',
			zIndex: 1,
		};

		const bounds = this.props.mapOrientation.bounds;
		if (
			bounds === undefined ||
			(bounds &&
				bounds.north > this.props.coordinate.latitude &&
				bounds.south < this.props.coordinate.latitude &&
				bounds.east > this.props.coordinate.longitude &&
				bounds.west < this.props.coordinate.longitude)
		)
			style.display = 'none';

		return (
			<div
				style={{
					...style,
					...this.state.position,
				}}
			>
				{this.props.children ? (
					this.props.children
				) : (
					<img
						src="/images/arrow-pointing-to-right.png"
						alt="destination"
						style={{
							transform: `rotate(${this._getBearing() - 90}deg)`,
						}}
					/>
				)}
			</div>
		);
	}
}

const mapState = (state: ReduxState) => ({
	mapOrientation: state.map.mapOrientation,
});
export default connect(mapState)(DistantPoint);

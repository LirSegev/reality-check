import React from 'react';
import * as firebase from 'firebase/app';
import TargetTabView from './Target.tab.view';

class TargetTabContainer extends React.Component<{}> {
	constructor(props: {}) {
		super(props);

		const storage = firebase.storage();
		storage
			.ref()
			.listAll()
			.then(res => {
				res.items.forEach(imgRef => {
					imgRef
						.getDownloadURL()
						.then(url => {
							this._imgSrc.push({
								url,
								name: imgRef.name.split('.')[0],
							});
						})
						.catch(err =>
							console.error(new Error('Getting download url of image'), err)
						);
				});
			})
			.catch(err => console.error(new Error('Getting list of files'), err));
	}

	_imgSrc: { url: string; name: string }[] = [];

	render() {
		return <TargetTabView imgSrc={this._imgSrc} />;
	}
}

export default TargetTabContainer;

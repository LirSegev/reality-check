import * as React from 'react';
import AdminPageView from './admin.page.view';

interface Props {
	stopLoading: () => void;
}

class AdminPageContainer extends React.Component<Props> {
	componentDidMount() {
		this.props.stopLoading();
	}

	render() {
		return <AdminPageView />;
	}
}

export default AdminPageContainer;

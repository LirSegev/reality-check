import React from 'react';
import { ListItem } from 'react-onsenui';

interface Props {
	handleSuspectClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const renderSuspectListItem = (props: Props) => (id: number) => {
	const suspect = require(`../../../../files/suspects/${id}.json`) as SuspectFile;

	return (
		<ListItem
			key={`suspectList_suspect-${id}`}
			data-suspect_id={id}
			tappable
			onClick={props.handleSuspectClick}
		>
			<div className="left">
				<div
					className="ui mini circular image"
					style={{
						width: '35px',
						height: '35px',
						flex: 'none',
						borderRadius: '50%',
					}}
				>
					<img
						style={{
							width: '60px',
							height: '60px',
							marginLeft: '-12px',
							marginTop: '-8px',
							maxWidth: 'unset',
							borderRadius: 'unset',
						}}
						src={`/images/suspects/${id}.jpg`}
						alt=""
					/>
				</div>
				{suspect.name}
			</div>
			{/* <div className="right">right</div> */}
		</ListItem>
	);
};

export default renderSuspectListItem;

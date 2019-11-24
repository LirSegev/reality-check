import React from 'react';

interface Props {
	suspect: {
		[title: string]:
			| string
			| {
					[subtitle: string]:
						| string
						| {
								[key: string]: string;
						  };
			  };
	};
}

const SuspectStory: React.FC<Props> = props => {
	const els = Object.keys(props.suspect).map(title => {
		const content = props.suspect[title];
		if (typeof content === 'string') {
			return (
				<React.Fragment key={title}>
					<h1>{title}</h1>
					<p>{content}</p>
				</React.Fragment>
			);
		} else {
			const result = Object.keys(content).map(subtitle => {
				const subContent = content[subtitle];
				if (typeof subContent === 'string')
					return (
						<tr key={[title, subtitle].join('-')}>
							<td>{subtitle}</td>
							<td>{subContent}</td>
						</tr>
					);
				else {
					const result = Object.keys(subContent).map(key => {
						const value = subContent[key];
						return (
							<tr key={[title, subtitle, key].join('-')}>
								<td>{key}</td>
								<td>{value}</td>
							</tr>
						);
					});

					return (
						<React.Fragment key={[title, subtitle].join('-')}>
							<h1>{subtitle}</h1>
							<table>
								<tbody>{result}</tbody>
							</table>
						</React.Fragment>
					);
				}
			});

			if (result[0].type === 'tr')
				return (
					<React.Fragment key={title}>
						<h1>{title}</h1>
						<table>
							<tbody>{result}</tbody>
						</table>
					</React.Fragment>
				);
			else
				return (
					<React.Fragment key={title}>
						<h1>{title}</h1>
						{result}
					</React.Fragment>
				);
		}
	});

	return <div>{els}</div>;
};

export default SuspectStory;
